import { SCHEDULE } from "@/hec-content";

/** Chapter 2: the weekly ledger. Whole rows shear on hover; one oversized
 * outlined numeral sits behind it as the page's single second-read moment. */
export function AgendaLedger() {
  return (
    <>
      <span className="hec-ledger__numeral" aria-hidden="true">
        4
      </span>
      <dl className="hec-ledger">
        {SCHEDULE.map((row) => (
          <div className="hec-ledger__row" key={row.day}>
            <dt>
              <span className="hec-ledger__day">{row.day}</span>
              <span className="hec-ledger__time">{row.time}</span>
            </dt>
            <dd>
              <strong>{row.name}</strong>
              <span>{row.text}</span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
