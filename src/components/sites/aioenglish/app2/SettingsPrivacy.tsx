"use client";
import { useId } from "react";
import { SettingsArt } from "./SettingsMisc";
import "@/styles/custom/settings-privacy-reference.css";
const s = { "data-v-3860d508": "" };
export default function SettingsPrivacy({ hidden, onHidden, download, onRevoke }: { hidden: boolean; onHidden: (value: boolean) => void; download: () => void; onRevoke: () => void }) {
  const id = useId();
  return <>
    <p {...s} className="psc-profile" data-testid="privacy-profile-hint">Ai đã đăng nhập cũng xem được hồ sơ @ID của bạn.</p>
    <div {...s} className="nbc-lv3 is-w nbc-srow"><span {...s}><b {...s} id={`${id}-label`}>Ẩn tôi khỏi bảng xếp hạng</b><p {...s} id={`${id}-description`}>Người khác không thấy tên, điểm, cấp và XP của bạn.</p></span><button {...s} type="button" role="switch" className="nbc-sw" aria-checked={hidden} aria-labelledby={`${id}-label`} aria-describedby={`${id}-description`} data-testid="privacy-lb-switch" onClick={() => onHidden(!hidden)}><i {...s} aria-hidden="true"/></button></div>
    <div {...s} className="nbc-lv3 is-w nbc-srow"><span {...s}><b {...s}>Tải dữ liệu của tôi</b></span><button {...s} type="button" className="nbc-btn is-soft is-sm" aria-label="Tải dữ liệu của tôi" data-testid="privacy-export" onClick={download}><SettingsArt kind="download"/> Tải xuống</button></div>
    <div {...s} className="nbc-lv3 is-w nbc-srow"><span {...s}><b {...s}>Đăng xuất thiết bị khác</b></span><button {...s} type="button" className="nbc-btn is-soft is-sm" data-testid="privacy-revoke-open" aria-label="Đăng xuất thiết bị khác" onClick={onRevoke}><SettingsArt kind="logout"/> Đăng xuất</button></div>
  </>;
}
