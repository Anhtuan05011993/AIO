"use client";
import UiDialog from "../app/UiDialog";
import { useId } from "react";
import { SettingsArt } from "./SettingsMisc";
import "@/styles/custom/settings-actions.css";
const s = { "data-v-45fbf440": "" };
export default function SettingsActionDialog({ kind, email, onClose, onConfirm }: { kind: "revoke" | "delete"; email: string; onClose: () => void; onConfirm: () => void }) {
  const removing = kind === "delete";
  const descriptionId = useId();
  return <UiDialog title={removing ? "Xoá tài khoản?" : "Đăng xuất thiết bị khác?"} sourceStyle className="ui-settings-action dlg-danger" onClose={onClose}>
    <div className="ui-settings-action-body">{removing ? <><p {...s} className="cd-dlg-p">Xoá <b {...s}>{email || "tài khoản local"}</b> và mọi dữ liệu học: tiến độ, từ vựng, bài làm.</p><p {...s} id={descriptionId} className="cd-dlg-warn">Không thể hoàn tác.</p></> : <p data-v-3860d508="" id={descriptionId} className="psc-dlg-p">Các thiết bị khác sẽ phải đăng nhập lại.</p>}</div>
    <div className="ui-settings-action-footer"><button type="button" className="nbc-btn is-soft" onClick={onClose}>Huỷ</button><button type="button" className="nbc-btn is-bad" aria-describedby={descriptionId} data-testid={removing ? "settings-delete-confirm" : "privacy-revoke-confirm"} onClick={onConfirm}>{removing && <SettingsArt kind="trash"/>}{removing ? "Xoá vĩnh viễn" : "Đăng xuất"}</button></div>
  </UiDialog>;
}
