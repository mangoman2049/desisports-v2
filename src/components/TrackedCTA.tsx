"use client";

import React from "react";
import Link from "next/link";
import { trackCTA, UserPersona } from "@/lib/analytics";

interface TrackedCTAProps {
  ctaName: string;
  persona?: UserPersona;
  metadata?: Record<string, any>;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}

export default function TrackedCTA({
  ctaName,
  persona = "VISITOR",
  metadata = {},
  href,
  onClick,
  className = "",
  children,
}: TrackedCTAProps) {
  const handleClick = (e: React.MouseEvent) => {
    trackCTA(ctaName, persona, metadata);
    if (onClick) {
      onClick(e);
    }
  };

  if (href) {
    return (
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
