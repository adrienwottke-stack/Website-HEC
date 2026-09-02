import { useState } from "react";

import type { Reel } from "@/hec-content";

function reelCode(url: string): string | null {
  const match = /instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/.exec(url);
  return match?.[1] ?? null;
}

function ReelTile({ reel }: { reel: Reel }) {
  const [open, setOpen] = useState(false);
  const code = reelCode(reel.url);

  if (open && code) {
    return (
      <article className="hec-reel">
        <iframe
          src={`https://www.instagram.com/reel/${code}/embed/`}
          title={reel.caption}
          loading="lazy"
          allow="encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </article>
    );
  }

  return (
    <article className="hec-reel">
      <button
        type="button"
        className="hec-reel__facade"
        aria-label={`Reel abspielen: ${reel.caption}`}
        onClick={() => {
          if (code) {
            setOpen(true);
          } else {
            window.open(reel.url, "_blank", "noopener");
          }
        }}
      >
        {reel.poster ? (
          <img className="hec-reel__poster" src={reel.poster} alt="" loading="lazy" />
        ) : null}
        <span className="hec-reel__ring" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M6 3l15 9-15 9z" />
          </svg>
        </span>
        <span className="hec-reel__caption">{reel.caption}</span>
      </button>
    </article>
  );
}

/** Reels from the meetups, each behind a click facade so Instagram's iframe
 * only loads on demand. Renders nothing while the list is empty. */
export function ReelsStrip({ reels, plate }: { reels: Reel[]; plate?: string }) {
  if (reels.length === 0) return null;
  return (
    <section className="hec-reels" id="reels" aria-labelledby="reels-title">
      {plate ? (
        <div
          className="hec-reels__plate"
          style={{ backgroundImage: `url(${plate})` }}
          aria-hidden="true"
        />
      ) : null}
      <p className="hec-eyebrow">Aus den Treffen</p>
      <h2 className="hec-h2" id="reels-title">
        So sieht das aus.
      </h2>
      <div className="hec-reels__strip">
        {reels.map((reel) => (
          <ReelTile key={reel.url} reel={reel} />
        ))}
      </div>
    </section>
  );
}
