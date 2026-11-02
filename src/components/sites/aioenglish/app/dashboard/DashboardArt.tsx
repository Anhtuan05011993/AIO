import art from "@/lib/ui-fixtures/dashboard-art.json";

export default function DashboardArt({
  kind,
}: {
  kind: "plan" | "path" | "rank" | "feed";
}) {
  return (
    <span
      aria-hidden="true"
      className={`ta-tile is-head ta-plate nbx-bh-art nbx-r-${kind === "plan" ? "do" : kind === "path" ? "goal" : "heat"}`}
      dangerouslySetInnerHTML={{ __html: art[kind] }}
    />
  );
}

export function CritterAvatar({
  index = 0,
  className = "",
}: {
  index?: number;
  className?: string;
}) {
  const html =
    index === -1 ? art.avatar : art.podium[index % art.podium.length];
  return (
    <span
      className={`ui-critter-avatar ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
