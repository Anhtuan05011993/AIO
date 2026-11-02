"use client";
import SettingsFriends from "./SettingsFriends";
import SettingsAppearance from "./SettingsAppearance";
import SettingsPrivacy from "./SettingsPrivacy";
import SettingsActionDialog from "./SettingsActionDialog";
import { SettingsArt } from "./SettingsMisc";
import SettingsLevel from "./SettingsLevel";
import SettingsAccent from "./SettingsAccent";
import { CritterAvatar } from "../app/dashboard/DashboardArt";
import settingsHeaderArt from "@/lib/ui-fixtures/settings-header-art.json";
import settingsIcons from "@/lib/ui-fixtures/settings-icons.json";
import "@/styles/custom/settings-reference.css";
import "@/styles/custom/settings-parity.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDemoUser,
  setDemoUser,
  clearDemoUser,
  type DemoUser,
} from "@/lib/store/auth";
import GoalDialog from "../app/GoalDialog";
import { loadProgress } from "@/lib/store/progress";
import ContentNotice from "../app/ContentNotice";
const SECTIONS = [
  ["profile", "Hồ sơ"],
  ["friends", "Bạn bè"],
  ["level", "Trình độ"],
  ["minutes", "Mục tiêu"],
  ["accent", "Giọng"],
  ["appearance", "Giao diện"],
  ["privacy", "Quyền riêng tư"],
  ["account", "Tài khoản"],
];
const DEFAULT: DemoUser = {
  name: "Học viên",
  email: "",
  level: "A1",
  goal: "Hoàn thành B1",
  accent: "uk",
  minutesPerDay: 45,
  createdAt: 0,
};
const scope={"data-v-45fbf440":""}, cardScope={"data-v-1c47b92f":""}, profileScope={"data-v-fcaf31cf":""};
const SOURCE_IDS: Record<string,string>={profile:"hoso",friends:"ban-be",level:"trinhdo",minutes:"muctieu",accent:"giong",appearance:"giaodien",privacy:"riengtu",account:"taikhoan"};
function SettingsHeading({section,title,tone,hint}:{section:string;title:string;tone:string;hint?:string}) {
 return <div {...cardScope} className="nbc-bh sts-bh"><div {...cardScope} className="nbc-bh-t"><span {...cardScope} className="nbc-sk" data-tone={tone} aria-hidden="true" style={{"--nb-sk-size":"44px","--nb-fc":`var(--nb-paper-${tone}-bg)`} as React.CSSProperties} dangerouslySetInnerHTML={{__html:(settingsIcons as Record<string,string>)[SOURCE_IDS[section]]??""}}/><h2 {...cardScope} id={`${SOURCE_IDS[section]}-h`}>{title}</h2></div>{hint&&<p {...scope} className="nbc-hint cd-lv-hint">{hint}</p>}</div>;
}
export default function CaiDat() {
  const router = useRouter();
  const [user, setUser] = useState<DemoUser>(DEFAULT);
  const [name, setName] = useState(DEFAULT.name);
  const [handle, setHandle] = useState("hocvien");
  const [savedHandle,setSavedHandle] = useState("hocvien");
  const [theme, setTheme] = useState("light");
  const [skin, setSkin] = useState("sotay");
  const [motion, setMotion] = useState("system");
  const [sound, setSound] = useState(true);
  const [online, setOnline] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [feed, setFeed] = useState("anonymous");
  const [saved, setSaved] = useState("");
  const [goal, setGoal] = useState(false);
  const [accountAction,setAccountAction] = useState<"revoke"|"delete"|null>(null);
  const [section, setSection] = useState("profile");
  useEffect(() => {
    const u = getDemoUser() ?? DEFAULT;
    setUser(u);
    setName(u.name);
    try {
      setTheme(localStorage.getItem("aio-demo-theme") ?? "light");
      setSkin(localStorage.getItem("aio-demo-skin") ?? "sotay");
      setHandle(localStorage.getItem("aio-ui-handle") ?? "hocvien");
      setSavedHandle(localStorage.getItem("aio-ui-handle") ?? "hocvien");
      setOnline(localStorage.getItem("aio-ui-hide-online") === "true");
      setHidden(localStorage.getItem("aio-ui-hide-ranking") === "true");
      setMotion(localStorage.getItem("aio-ui-motion") ?? "system");
      setSound(localStorage.getItem("aio-ui-key-sound") !== "false");
      setFeed(localStorage.getItem("aio-ui-feed") ?? "anonymous");
    } catch {}
  }, []);
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      const entry = SECTIONS.find(([id]) => id === hash || SOURCE_IDS[id] === hash);
      setSection(entry?.[0] ?? "profile");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);
  function flash(text = "Đã lưu") {
    setSaved(text);
  }
  function update(patch: Partial<DemoUser>) {
    const next = { ...user, ...patch };
    setUser(next);
    setDemoUser(next);
    flash();
  }
  function pref(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {}
    flash();
  }
  function appearance(next: string) {
    setTheme(next);
    pref("aio-demo-theme", next);
    const resolved =
      next === "system"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : next;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }
  function chooseSkin(next: string) {
    setSkin(next);
    pref("aio-demo-skin", next);
    document.documentElement.dataset.skin = next;
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob(
        [JSON.stringify({ profile: user, progress: loadProgress() }, null, 2)],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "aio-ho-so.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div {...scope} className="nb-skin cd ui-settings" data-nb-accent="nga"><div {...scope} className="nbc-page cd-wrap">
      <header {...scope} className="nbc-hd is-st" data-nb-header="">
        <span className="nbc-tape is-msk" style={{top:-11,left:"40%","--nb-tape-r":"-3deg"} as React.CSSProperties} aria-hidden="true"/>
        <div className="nbc-hd-row is-top"><div className="nbc-hd-head"><div className="nbc-hd-tt"><span className="ta-tile is-hd ta-plate nbx-r-ivory nbc-hd-ic" aria-hidden="true"><span style={{display:"contents"}} dangerouslySetInnerHTML={{__html:settingsHeaderArt.html}}/></span><h1>Cài đặt.</h1></div></div></div>
        <div className="nbc-hd-tools"><nav {...scope} className="nbc-seg" aria-label="Mục trong Cài đặt">
          {SECTIONS.map(([id,label])=><a key={id} {...scope} href={`#${SOURCE_IDS[id]}`} className={section===id?"is-on":""} onClick={()=>setSection(id)} aria-current={section===id?"location":undefined}>{label}</a>)}
        </nav></div>
      </header>
      <div {...scope} className="cd-cols ui-settings-columns">
        <div {...scope} className="cd-col">
          <section {...scope} {...cardScope} id="hoso" data-nb-accent="hong" className="nbc-lv1 sts is-acard " aria-labelledby="hoso-h"><span {...cardScope} className="nbc-tape is-cor" style={{left:44,"--nb-tape-r":"-4deg","--nb-tape-c":"var(--nb-a-under)"} as React.CSSProperties} aria-hidden="true"/><span id="profile" className="ui-settings-alias" aria-hidden="true"/>
            <SettingsHeading section="profile" title="Hồ sơ." tone="hong"/>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = name.trim();
                if (!trimmed) return;
                setName(trimmed);
                update({ name: trimmed });
              }}
            >
              <div {...profileScope} className="apc-row"><span className="nbc-avring ui-settings-avatar" aria-hidden="true"><CritterAvatar index={-1}/></span><div {...profileScope} className="nbc-fld apc-field"><label {...profileScope} htmlFor="display-name">Tên hiển thị</label><div {...profileScope} className="nbc-inp"><input {...profileScope} id="display-name" required maxLength={40} placeholder="Tên bạn muốn hiển thị" value={name} onChange={e=>setName(e.target.value)}/></div></div></div>
              <div {...profileScope} className="apc-actions"><ContentNotice className="nbc-btn is-soft is-sm"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14.5 4h-5L7 7H3v13h18V7h-4Z"/><circle cx="12" cy="13" r="3"/></svg>Đổi ảnh</ContentNotice><span className="nbc-sp" aria-hidden="true"/><span {...profileScope} className="apc-save" data-on={name.trim()&&name.trim()!==user.name?"1":"0"}><button type="submit" className="nbc-btn is-ink is-sm" disabled={!name.trim()||name.trim()===user.name}>Lưu hồ sơ</button></span></div>
            </form>
          </section>
          <section {...scope} {...cardScope} id="ban-be" data-nb-accent="coral" className="nbc-lv1 sts is-acard " aria-labelledby="ban-be-h"><span id="friends" className="ui-settings-alias" aria-hidden="true"/>
            <SettingsHeading section="friends" title="Bạn bè." tone="coral"/>
            <SettingsFriends handle={handle} savedHandle={savedHandle} onHandle={setHandle} onSave={()=>{pref("aio-ui-handle",handle);setSavedHandle(handle);flash("Đã lưu ID trên máy này.");}} online={online} onOnline={value=>{setOnline(value);pref("aio-ui-hide-online",String(value));}} feed={feed} onFeed={value=>{setFeed(value);pref("aio-ui-feed",value);}} notice={flash}/>

          </section>
          <section {...scope} {...cardScope} id="trinhdo" data-nb-accent="oaihuong" className="nbc-lv1 sts is-acard cd-lv" aria-labelledby="trinhdo-h"><span id="level" className="ui-settings-alias" aria-hidden="true"/>
            <SettingsHeading section="level" title="Trình độ." tone="oaihuong" hint="Bài học được lọc theo trình độ này."/>
            <SettingsLevel level={user.level} onChange={level=>update({level})}/>

          </section>
        </div>
        <div {...scope} className="cd-col">
          <section {...scope} {...cardScope} id="muctieu" data-nb-accent="camdao" className="nbc-lv1 sts is-acard is-grid20 cd-mt" aria-labelledby="muctieu-h"><span id="minutes" className="ui-settings-alias" aria-hidden="true"/>
            <SettingsHeading section="minutes" title="Mục tiêu." tone="camdao"/>
            <div {...scope} className="cd-mt-f"><small {...scope} className="cd-mt-l">Mỗi ngày</small><div {...scope} className="cd-goals" role="group" aria-label="Mục tiêu hằng ngày">
              {[30,45,60,180].map(n=><button key={n} {...scope} type="button" className={`nbc-pill${user.minutesPerDay===n?" is-on":""}`} aria-pressed={user.minutesPerDay===n} onClick={()=>update({minutesPerDay:n})}>{n<60?`${n} phút`:n===60?"1 giờ":"3 giờ"}</button>)}
            </div></div>
            <div {...scope} className="nbc-lv3 cd-tgt" data-testid="settings-target"><span {...scope} className="nbc-sk is-a" style={{"--nb-sk-size":"32px"} as React.CSSProperties} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg></span><span {...scope} className="cd-tgt-t"><small {...scope}>Cấp muốn đạt</small><b {...scope}><span {...scope} className="cd-tgt-name">{user.goal}</span></b></span><button {...scope} type="button" className="nbc-btn is-soft is-sm" aria-label="Sửa cấp muốn đạt" onClick={()=>setGoal(true)}>Sửa</button></div>
          </section>
          <section {...scope} {...cardScope} id="giong" data-nb-accent="xanhtroi" className="nbc-lv1 sts is-acard cd-acc" aria-labelledby="giong-h"><span id="accent" className="ui-settings-alias" aria-hidden="true"/>
            <span {...cardScope} className="is-msk nbc-tape" style={{right:50,"--nb-tape-r":"3deg"} as React.CSSProperties} aria-hidden="true"/><SettingsHeading section="accent" title="Giọng tiếng Anh." tone="xanhtroi"/>
            <p {...scope} className="nbc-hint">Đổi cả giọng đọc và phiên âm IPA.</p>
            <SettingsAccent value={user.accent} onChange={accent=>update({accent})}/>

          </section>
          <section {...scope} {...cardScope} id="giaodien" data-nb-accent="bacha" className="nbc-lv1 sts is-acard is-grid20 cd-gd" aria-labelledby="giaodien-h"><span id="appearance" className="ui-settings-alias" aria-hidden="true"/>
            <SettingsHeading section="appearance" title="Giao diện." tone="bacha"/>
            <SettingsAppearance theme={theme} skin={skin} motion={motion} sound={sound} onTheme={appearance} onSkin={chooseSkin} onMotion={value=>{setMotion(value);pref("aio-ui-motion",value);document.documentElement.dataset.uiMotion=value==="Giảm"?"reduce":"full";}} onSound={value=>{setSound(value);pref("aio-ui-key-sound",String(value));}}/>

          </section>
          <section {...scope} {...cardScope} id="riengtu" data-nb-accent="kraft" className="nbc-lv1 sts is-acard " aria-labelledby="riengtu-h"><span id="privacy" className="ui-settings-alias" aria-hidden="true"/>
            <SettingsHeading section="privacy" title="Quyền riêng tư." tone="kraft"/>
            <SettingsPrivacy hidden={hidden} onHidden={value=>{setHidden(value);pref("aio-ui-hide-ranking",String(value));}} download={download} onRevoke={()=>setAccountAction("revoke")}/>

          </section>
          <section {...scope} {...cardScope} id="taikhoan" data-nb-accent="kraft" className="nbc-lv1 sts is-s-kraft is-lined" aria-labelledby="taikhoan-h"><span id="account" className="ui-settings-alias" aria-hidden="true"/>
            <SettingsHeading section="account" title="Tài khoản." tone="kraft"/>
            <div {...scope} className="cd-out"><p {...scope}><b {...scope}>{user.email || "Tài khoản local"}</b></p><button {...scope} type="button" className="nbc-btn is-soft is-sm" onClick={async()=>{clearDemoUser();await fetch("/api/auth/logout",{method:"POST"}).catch(()=>{});router.push("/");}}><SettingsArt kind="logout"/> Đăng xuất</button></div>
            <div {...scope} className="nbc-danger"><p {...scope}>Xoá vĩnh viễn mọi dữ liệu học. Không thể hoàn tác.</p><button {...scope} type="button" className="nbc-btn is-bad is-sm" data-testid="settings-delete-open" onClick={()=>setAccountAction("delete")}><SettingsArt kind="trash"/> Xoá tài khoản</button></div>

          </section>
          <nav {...scope} className="nbc-legal" aria-label="Pháp lý"><Link {...scope} href="/phap-ly/quyen-rieng-tu" data-testid="settings-privacy-link"><SettingsArt kind="shield"/> Chính sách quyền riêng tư</Link><Link {...scope} href="/phap-ly/dieu-khoan" data-testid="settings-terms-link"><SettingsArt kind="legal"/> Điều khoản sử dụng</Link></nav>
        </div>
      </div>
      {saved && (
        <div className="ui-toast" role="status">
          {saved}
          <button aria-label="Đóng thông báo" onClick={() => setSaved("")}>
            ×
          </button>
        </div>
      )}
      {accountAction && <SettingsActionDialog kind={accountAction} email={user.email} onClose={()=>setAccountAction(null)} onConfirm={()=>{const action=accountAction;setAccountAction(null);flash(action==="delete"?"Chế độ local: chưa kết nối xóa tài khoản. Không có dữ liệu nào bị xóa.":"Chế độ local: chưa kết nối quản lý phiên trên thiết bị khác.");}}/>}
      {goal && (
        <GoalDialog
          kind="goal"
          onClose={() => {
            setGoal(false);
            setUser(getDemoUser() ?? user);
          }}
        />
      )}
    </div>
    </div>
  );
}
