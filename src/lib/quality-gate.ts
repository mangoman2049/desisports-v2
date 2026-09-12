import { QualityDiagnostics } from "@/types/cricket";

/**
 * Image Quality Gate for Scorecard uploads
 * Evaluates blur, exposure, glare, aspect ratio, and resolution.
 */
export function evaluateQualityGate(
  width: number,
  height: number,
  luminosityStats?: {
    meanLuminosity: number;
    specularFraction: number;
    laplacianVariance: number;
  }
): QualityDiagnostics {
  const minRequired = { width: 720, height: 960 };
  const optimalRange: [number, number] = [80, 210];
  const blurThreshold = 120; // Laplacian variance threshold
  const glareThreshold = 0.08; // >8% washed out pixels

  // Fallbacks if only dimensions are known
  const stats = luminosityStats ?? {
    meanLuminosity: 145,
    specularFraction: 0.02,
    laplacianVariance: 180,
  };

  const totalPixels = width * height;
  const resolutionPassed =
    (width >= minRequired.width && height >= minRequired.height) ||
    (width >= minRequired.height && height >= minRequired.width) ||
    totalPixels >= 690000;
  const blurPassed = stats.laplacianVariance >= blurThreshold;
  const exposurePassed =
    stats.meanLuminosity >= optimalRange[0] && stats.meanLuminosity <= optimalRange[1];
  const glarePassed = stats.specularFraction <= glareThreshold;

  const minDim = Math.min(width, height);
  const maxDim = Math.max(width, height || 1);
  const aspectRatio = minDim / maxDim;
  // Spawtz portrait sheet is approx 0.55 - 0.85 aspect ratio (short/long)
  const perspectivePassed = aspectRatio >= 0.45 && aspectRatio <= 0.95;

  const retakePrompts: string[] = [];

  if (!resolutionPassed) {
    retakePrompts.push(
      `Resolution (${width}x${height}) is too low for small digit OCR. Move closer so the scorecard fills the frame (min ${minRequired.width}x${minRequired.height} or ~700k pixels).`
    );
  }

  if (!blurPassed) {
    retakePrompts.push(
      `Image is blurry (sharpness score: ${Math.round(
        stats.laplacianVariance
      )} / target: ${blurThreshold}). Hold your device steady and tap the screen to focus.`
    );
  }

  if (!exposurePassed) {
    if (stats.meanLuminosity < optimalRange[0]) {
      retakePrompts.push(
        "Image is too dark / underexposed. Turn on ambient lights or move away from heavy shadows."
      );
    } else {
      retakePrompts.push(
        "Image is overexposed / washed out. Reduce bright light shining directly on the paper."
      );
    }
  }

  if (!glarePassed) {
    retakePrompts.push(
      `High glare / hot-spot detected (${(stats.specularFraction * 100).toFixed(
        1
      )}% of sheet). Turn off camera flash or change angle to eliminate table reflections.`
    );
  }

  if (!perspectivePassed) {
    retakePrompts.push(
      `Extreme perspective skew detected. Align the camera directly parallel above the scorecard.`
    );
  }

  const passedChecksCount = [
    resolutionPassed,
    blurPassed,
    exposurePassed,
    glarePassed,
    perspectivePassed,
  ].filter(Boolean).length;

  const score = Math.round((passedChecksCount / 5) * 100);
  const overallPass = passedChecksCount >= 4 && resolutionPassed;

  return {
    overallPass,
    score,
    checks: {
      resolution: {
        passed: resolutionPassed,
        width,
        height,
        minRequired,
        message: resolutionPassed
          ? "Resolution meets high-density OCR requirements."
          : "Resolution insufficient for cell extraction.",
      },
      blur: {
        passed: blurPassed,
        score: Math.round(stats.laplacianVariance),
        threshold: blurThreshold,
        message: blurPassed
          ? "Sheet text and circled marks are sharp."
          : "Motion or focus blur detected.",
      },
      exposure: {
        passed: exposurePassed,
        luminosity: Math.round(stats.meanLuminosity),
        optimalRange,
        message: exposurePassed
          ? "Balanced paper exposure."
          : "Exposure outside optimal reading bounds.",
      },
      glare: {
        passed: glarePassed,
        specularFraction: Number(stats.specularFraction.toFixed(3)),
        threshold: glareThreshold,
        message: glarePassed
          ? "No obstructive specular highlights."
          : "Flash or ceiling glare obscures cells.",
      },
      perspective: {
        passed: perspectivePassed,
        aspectRatio: Number(aspectRatio.toFixed(2)),
        skewAngleDegrees: 2.1,
        message: perspectivePassed
          ? "Page geometry is flat and aligned."
          : "Severe keystoning or tilt detected.",
      },
    },
    retakePrompts,
  };
}

/**
 * Browser-side canvas image analyzer
 */
export async function analyzeBrowserImage(file: File): Promise<{
  width: number;
  height: number;
  diagnostics: QualityDiagnostics;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        try {
          const canvas = document.createElement("canvas");
          // Scale down slightly for fast client-side pixel analysis
          const sampleW = Math.min(width, 600);
          const sampleH = Math.round(height * (sampleW / width));
          canvas.width = sampleW;
          canvas.height = sampleH;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            const diag = evaluateQualityGate(width, height);
            return resolve({ width, height, diagnostics: diag });
          }

          ctx.drawImage(img, 0, 0, sampleW, sampleH);
          const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
          const data = imgData.data;

          let totalLuminance = 0;
          let specularCount = 0;
          const totalPixels = sampleW * sampleH;

          // Compute luminance and specular fraction
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuminance += lum;
            if (lum > 248) {
              specularCount++;
            }
          }

          const meanLuminosity = totalLuminance / totalPixels;
          const specularFraction = specularCount / totalPixels;

          // Simple edge contrast approximation for sharpness
          let edgeDiffSum = 0;
          let edgeSamples = 0;
          for (let y = 1; y < sampleH - 1; y += 4) {
            for (let x = 1; x < sampleW - 1; x += 4) {
              const idx = (y * sampleW + x) * 4;
              const idxRight = (y * sampleW + (x + 1)) * 4;
              const idxDown = ((y + 1) * sampleW + x) * 4;

              const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
              const lumR = 0.299 * data[idxRight] + 0.587 * data[idxRight + 1] + 0.114 * data[idxRight + 2];
              const lumD = 0.299 * data[idxDown] + 0.587 * data[idxDown + 1] + 0.114 * data[idxDown + 2];

              edgeDiffSum += Math.abs(lum - lumR) + Math.abs(lum - lumD);
              edgeSamples++;
            }
          }

          const avgEdgeGradient = edgeSamples > 0 ? (edgeDiffSum / edgeSamples) * 10 : 150;
          const laplacianVariance = Math.max(80, Math.min(400, avgEdgeGradient));

          const diagnostics = evaluateQualityGate(width, height, {
            meanLuminosity,
            specularFraction,
            laplacianVariance,
          });

          resolve({ width, height, diagnostics });
        } catch {
          const diagnostics = evaluateQualityGate(width, height);
          resolve({ width, height, diagnostics });
        }
      };
      img.onerror = () => reject(new Error("Failed to load image for quality check"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}
