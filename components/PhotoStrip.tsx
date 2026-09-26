"use client";

import Image from "next/image";

import { useState } from "react";

/**
 * Abstract illustrations; replace the assets and captions with real photos
 * when available.
 */
const PHOTOS = [
  { src: "/photos/photo-1.svg", caption: "warm sand", rotate: -11, lift: 4 },
  { src: "/photos/photo-2.svg", caption: "blue study", rotate: 6, lift: -3 },
  { src: "/photos/photo-3.svg", caption: "rose study", rotate: -4, lift: 6 },
  { src: "/photos/photo-4.svg", caption: "green study", rotate: 9, lift: 0 },
  { src: "/photos/photo-5.svg", caption: "violet study", rotate: -7, lift: 5 },
  { src: "/photos/photo-6.svg", caption: "gold study", rotate: 3, lift: -2 },
  { src: "/photos/photo-7.svg", caption: "grey study", rotate: -9, lift: 3 },
];

/**
 * A scattered album of prints. Hovering lifts one out of the pile and names it
 * underneath; clicking pulls it to the front and enlarges it, clicking again
 * puts it back.
 */
export function PhotoStrip() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const active = selected ?? hovered;

  return (
    <div className="photo-strip mt-8" onKeyDown={(event) => { if (event.key === "Escape") setSelected(null); }}>
      <div
        className="flex min-h-[210px] items-center justify-center"
        onMouseLeave={() => setHovered(null)}
      >
        <div className="flex items-center">
          {PHOTOS.map((photo, i) => {
            const isSelected = selected === i;
            const dimmed = selected !== null && !isSelected;

            return (
              <button
                key={photo.src}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(isSelected ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                style={{
                  rotate: isSelected ? "0deg" : `${photo.rotate}deg`,
                  zIndex: isSelected ? 30 : hovered === i ? 20 : i,
                  marginLeft: i === 0 ? 0 : "var(--photo-overlap)",
                  translate: isSelected ? "0 0" : `0 ${photo.lift}px`,
                }}
                className={`photo-card group relative shrink-0 cursor-pointer rounded-[2px] bg-card p-[6px] pb-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.13)] ring-1 ring-black/5 transition-[scale,rotate,translate,opacity,box-shadow,filter] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg ${
                  isSelected
                    ? "scale-[1.2] sm:scale-[1.5] shadow-[0_16px_44px_rgba(0,0,0,0.24)]"
                    : "hover:rotate-0 hover:scale-[1.08] hover:shadow-[0_10px_26px_rgba(0,0,0,0.18)]"
                } ${dimmed ? "opacity-30 blur-[1.5px]" : "opacity-100"}`}
              >
                <Image
                  src={photo.src}
                  alt={`Abstract illustration: ${photo.caption}`}
                  width={76}
                  height={96}
                  loading="lazy"
                  draggable={false}
                  className="photo-image rounded-[1px] object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* One caption line for whichever print is active. The non-breaking space
          keeps the row's height reserved so nothing shifts. */}
      <p
        aria-live="polite"
        className={`mt-1 text-center text-muted transition-opacity duration-200 ${
          active === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {active === null ? " " : PHOTOS[active].caption}
      </p>
    </div>
  );
}
