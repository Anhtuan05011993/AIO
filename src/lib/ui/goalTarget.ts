// Input validation for the local target form; no learning/scoring logic.
export function targetDate(value: string, today: string): { iso: string; error: string } {
  if (!value.trim()) return { iso: "", error: "" };
  const parts = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!parts) return { iso: "", error: "Nhập ngày theo dạng ngày/tháng/năm." };
  const day = Number(parts[1]), month = Number(parts[2]), year = Number(parts[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return { iso: "", error: "Ngày không hợp lệ." };
  const start = Date.parse(`${today}T00:00:00Z`);
  if (date.getTime() < start) return { iso: "", error: "Ngày thi không được ở quá khứ." };
  if (date.getTime() > start + 730 * 86400000) return { iso: "", error: "Chọn ngày thi trong vòng 2 năm tới." };
  return { iso: date.toISOString().slice(0, 10), error: "" };
}
export function targetDateLabel(iso: string): string {
  const [year, month, day] = iso.split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
}
export function targetToeic(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const score = Number(value);
  return score >= 10 && score <= 990 ? score : null;
}
export function normalizeTargetGoal(goal: string): string {
  const ielts = /^IELTS(?: Band)?\s+(\d+(?:\.\d+)?)$/.exec(goal);
  if (ielts) return `IELTS Band ${Number(ielts[1]).toFixed(1)}`;
  return goal;
}
