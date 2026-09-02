import { CHANNELS } from "@/hec-content";

/** Chapter 3: the group's channels as launch-console readouts, each with a
 * glyph from the generated icon set. */
export function ChannelReadouts() {
  return (
    <ul className="hec-readouts">
      {CHANNELS.map((channel) => (
        <li key={channel.label}>
          <img
            className="hec-icon"
            src={`/assets/icons/${channel.icon}.webp`}
            alt=""
            width={28}
            height={28}
            decoding="async"
          />
          <span className="hec-readouts__label">{channel.label}</span>
          <span className="hec-readouts__text">{channel.text}</span>
        </li>
      ))}
    </ul>
  );
}
