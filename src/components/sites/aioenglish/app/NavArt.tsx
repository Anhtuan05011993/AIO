import art from "@/lib/ui-fixtures/nav-art.json";

/** Fixed SVG illustrations captured from the source navigation, never user HTML. */
export default function NavArt({ route }: { route: string }) {
  return (
    <span
      className="ui-nav-art"
      aria-hidden="true"
      dangerouslySetInnerHTML={{
        __html: (art as Record<string, string>)[route] ?? "",
      }}
    />
  );
}
