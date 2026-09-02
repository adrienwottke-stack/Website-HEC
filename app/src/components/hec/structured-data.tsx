/** JSON-LD block. SSR-safe, the json prop is a pre-stringified object. */
export function StructuredData({ json }: { json: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
