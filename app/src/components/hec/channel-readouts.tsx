import { CHANNELS } from "@/hec-content";

/** Chapter 3: the group's channels as launch-console readouts. */
export function ChannelReadouts() {
  return (
    <ul className="hec-readouts">
      {CHANNELS.map((channel) => (
        <li key={channel.label}>
          <span className="hec-readouts__label">{channel.label}</span>
          <span className="hec-readouts__text">{channel.text}</span>
        </li>
      ))}
    </ul>
  );
}
