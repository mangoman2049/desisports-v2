import sharp from "sharp";

export interface PreprocessResult {
  buffer: Buffer;
  format: "webp";
  width: number;
  height: number;
  cropped: boolean;
  cropBox?: { left: number; top: number; width: number; height: number };
}

/**
 * Intelligent paper boundary detector:
 * Detects scorecard sheet edges against dark or patterned table/desk surfaces.
 * Returns crop coordinates to isolate the scorecard paper.
 */
async function detectScorecardCropBox(
  imageBuffer: Buffer
): Promise<{ left: number; top: number; width: number; height: number } | null> {
  try {
    // 1. Resize down to thumbnail for fast, noise-resistant boundary detection
    const thumbWidth = 400;
    const { data: rawPixels, info } = await sharp(imageBuffer)
      .resize(thumbWidth, null, { withoutEnlargement: true })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const w = info.width;
    const h = info.height;

    // Calculate row and column average brightness
    const rowMeans = new Float32Array(h);
    const colMeans = new Float32Array(w);

    for (let y = 0; y < h; y++) {
      let sum = 0;
      for (let x = 0; x < w; x++) {
        sum += rawPixels[y * w + x];
      }
      rowMeans[y] = sum / w;
    }

    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = 0; y < h; y++) {
        sum += rawPixels[y * w + x];
      }
      colMeans[x] = sum / h;
    }

    // Baseline background brightness from outer 3% borders
    const borderSampleCount = Math.max(2, Math.floor(h * 0.04));
    let bgSum = 0;
    for (let i = 0; i < borderSampleCount; i++) {
      bgSum += rowMeans[i] + rowMeans[h - 1 - i];
    }
    const bgAvg = bgSum / (borderSampleCount * 2);

    // Center paper luminance
    let centerSum = 0;
    const centerYStart = Math.floor(h * 0.3);
    const centerYEnd = Math.floor(h * 0.7);
    for (let y = centerYStart; y < centerYEnd; y++) {
      centerSum += rowMeans[y];
    }
    const centerAvg = centerSum / (centerYEnd - centerYStart);

    // If center is significantly brighter than background table edge (> 18 difference)
    const hasTableBorder = Math.abs(centerAvg - bgAvg) > 18;

    let topY = 0;
    let bottomY = h - 1;
    let leftX = 0;
    let rightX = w - 1;

    if (hasTableBorder) {
      const threshold = bgAvg + (centerAvg - bgAvg) * 0.35;

      // Scan top-down (clamp search to first 22% of height)
      for (let y = 0; y < Math.floor(h * 0.22); y++) {
        if (Math.abs(rowMeans[y] - bgAvg) > Math.abs(threshold - bgAvg)) {
          topY = Math.max(0, y - 2);
          break;
        }
      }

      // Scan bottom-up (clamp search to bottom 22% of height)
      for (let y = h - 1; y > Math.floor(h * 0.78); y--) {
        if (Math.abs(rowMeans[y] - bgAvg) > Math.abs(threshold - bgAvg)) {
          bottomY = Math.min(h - 1, y + 2);
          break;
        }
      }

      // Scan left-to-right (clamp to 20% width)
      for (let x = 0; x < Math.floor(w * 0.2); x++) {
        if (Math.abs(colMeans[x] - bgAvg) > Math.abs(threshold - bgAvg)) {
          leftX = Math.max(0, x - 2);
          break;
        }
      }

      // Scan right-to-left (clamp to 20% width)
      for (let x = w - 1; x > Math.floor(w * 0.8); x--) {
        if (Math.abs(colMeans[x] - bgAvg) > Math.abs(threshold - bgAvg)) {
          rightX = Math.min(w - 1, x + 2);
          break;
        }
      }
    }

    // Scale back to original image dimensions
    const meta = await sharp(imageBuffer).metadata();
    const origW = meta.width || w;
    const origH = meta.height || h;
    const scale = origW / w;

    const cropLeft = Math.floor(leftX * scale);
    const cropTop = Math.floor(topY * scale);
    const cropWidth = Math.floor((rightX - leftX) * scale);
    const cropHeight = Math.floor((bottomY - topY) * scale);

    // Safety checks: ensure crop retains at least 70% of area
    if (cropWidth >= origW * 0.7 && cropHeight >= origH * 0.7 && (cropLeft > 0 || cropTop > 0 || cropWidth < origW || cropHeight < origH)) {
      return {
        left: cropLeft,
        top: cropTop,
        width: cropWidth,
        height: cropHeight,
      };
    }

    return null;
  } catch (err) {
    console.warn("Auto-crop edge detection fallback:", err);
    return null;
  }
}

/**
 * End-to-end Scorecard Image Preprocessing:
 * 1. Edge detection & Auto-cropping of table/desk borders.
 * 2. Grayscale conversion (eliminates color casts and shadows).
 * 3. Contrast normalization & sharpening (enhances handwritten ink tokens).
 * 4. WebP Q75 compression (max dimension 1800px).
 */
export async function preprocessScorecardImage(
  inputBuffer: Buffer
): Promise<PreprocessResult> {
  const cropBox = await detectScorecardCropBox(inputBuffer);

  let pipeline = sharp(inputBuffer);

  // 1. Crop to detected scorecard boundaries
  let cropped = false;
  if (cropBox) {
    pipeline = pipeline.extract({
      left: cropBox.left,
      top: cropBox.top,
      width: cropBox.width,
      height: cropBox.height,
    });
    cropped = true;
  } else {
    // Fallback: smart trim of border pixels
    try {
      pipeline = pipeline.trim();
    } catch {}
  }

  // 2. Convert to grayscale (eliminates paper yellowing, shadows, and reflections)
  // 3. Contrast normalization & sharpening for optimal OCR legibility
  // 4. Resize to max 1800px bounding box
  // 5. Convert to WebP at quality 75
  const processedBuffer = await pipeline
    .grayscale()
    .normalize()
    .sharpen({ sigma: 1.0, m1: 1.5, m2: 0.7 })
    .resize(1800, 1800, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 75,
      effort: 6,
    })
    .toBuffer();

  const meta = await sharp(processedBuffer).metadata();

  return {
    buffer: processedBuffer,
    format: "webp",
    width: meta.width || 1800,
    height: meta.height || 1800,
    cropped,
    cropBox: cropBox || undefined,
  };
}
