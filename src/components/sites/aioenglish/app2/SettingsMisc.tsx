"use client";
import art from "@/lib/ui-fixtures/settings-misc-art.json";
export function SettingsArt({ kind }: { kind: keyof typeof art }) {
  return <span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: art[kind] }}/>;
}
