import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FolioImageProps = {
  src: string;
  /** Required. Use "" only for purely decorative images. */
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
};

/** MDX image with required `alt` text. */
export function FolioImage({
  src,
  alt,
  width,
  height,
  caption,
  className,
}: FolioImageProps) {
  if (alt === undefined || alt === null) {
    throw new Error("FolioImage: `alt` is required.");
  }

  return (
    <figure className="my-8 not-prose">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={cn("max-w-full rounded-md border border-border", className)}
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export type FolioVideoProps = {
  src: string;
  title: string;
  /** URL to WebVTT captions (WCAG 1.2.2+). */
  captionsSrc?: string;
  /** Plain-text or markdown path for transcript (WCAG 1.2.8 AAA). */
  transcript?: ReactNode;
  poster?: string;
};

/** MDX video with optional captions (`captionsSrc`) and transcript. */
export function FolioVideo({
  src,
  title,
  captionsSrc,
  transcript,
  poster,
}: FolioVideoProps) {
  return (
    <figure className="my-8 not-prose space-y-3">
      <video
        controls
        preload="metadata"
        poster={poster}
        title={title}
        className="w-full max-w-full rounded-md border border-border"
      >
        <source src={src} />
        {captionsSrc ? (
          <track kind="captions" src={captionsSrc} srcLang="en" label="English" />
        ) : null}
      </video>
      <figcaption className="text-sm font-medium text-foreground">{title}</figcaption>
      {transcript ? (
        <div className="rounded-md border border-border bg-muted p-4 text-sm leading-relaxed">
          <p className="mb-2 font-medium text-foreground">Transcript</p>
          <div className="text-foreground">{transcript}</div>
        </div>
      ) : null}
    </figure>
  );
}
