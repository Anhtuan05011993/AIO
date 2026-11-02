"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import BrandLockup from "../auth/BrandLockup";
import { CritterAvatar } from "../app/dashboard/DashboardArt";
import NbArtDefs from "../NbArtDefs";
import { IconFlame } from "../app/icons";
import { getDemoUser, useDemoUserSync, type DemoUser } from "@/lib/store/auth";
import { loadProgress, onProgressChange } from "@/lib/store/progress";
import { MONTHLY_USER_XP } from "@/lib/ui-fixtures/dashboard";
import art from "@/lib/ui-fixtures/nav-art.json";
import palette from "@/lib/ui-fixtures/nav-palette.json";
import "@/styles/custom/lesson-nav-reference.css";
import "@/styles/custom/lesson-navigation.css";
const s = { "data-v-865472da": "" }, group = { "data-v-fc002a5b": "" };
const entries = [
 ["/", "Trang chủ", "home"], ["/go-cau", "Học qua gõ câu", "go"],
 ["/tu-vung", "Từ vựng & Phát âm", "voc"], ["/ngu-phap", "Luyện ngữ pháp", "gram"],
 ["/luyen-dich-thuat", "Luyện đọc & dịch", "read"], ["/video", "Dictation & Shadowing", "vid"],
 ["/tu-dien", "Từ điển chuyên sâu", "dict"], ["/lo-trinh", "Lộ trình học", "path"],
 ["/luyen-thi", "Luyện thi", "exam"], ["/ban-be", "Tiến độ & Bạn bè", "friend"],
 ["/yeu-cau-tinh-nang", "Yêu cầu tính năng", "req"],
];
export default function LessonNavigationDrawer({ active, onClose }: { active: string; onClose: () => void }) {
 const ref = useRef<HTMLDialogElement>(null), brand = useRef<HTMLAnchorElement>(null);
 const [user, setUser] = useState<DemoUser | null>(null), [streak, setStreak] = useState(0);
 useEffect(() => {
  const sync = () => setUser(getDemoUser()); sync();
  const progress = () => setStreak(loadProgress().streakDays); progress();
  const offUser = useDemoUserSync(sync), offProgress = onProgressChange(progress);
  const previous = document.activeElement as HTMLElement | null;
  const dialog = ref.current; dialog?.showModal(); brand.current?.focus();
  return () => { offUser(); offProgress(); dialog?.close(); if (previous?.isConnected) previous.focus(); };
 }, []);
 const item = ([href, label, tile]: string[]) => {
  const colors = palette.find(p => p.href === href)?.vars ?? {};
  return <Link key={href} {...group}  href={href} onClick={onClose} aria-current={active === href ? "page" : undefined}
   className={`nbr-item nbx-ni nbx-f-${tile}${active === href ? " nbx-on is-on" : ""}`} style={colors as CSSProperties}>
   <span className="nbx-tile nbr-tile" aria-hidden="true" dangerouslySetInnerHTML={{__html: (art as Record<string,string>)[href] ?? ""}} />
   <span className="nav-label nbr-label nbx-nl">{label}</span>{href === "/luyen-thi" && <span className="nbr-tag">Sắp có</span>}
  </Link>;
 };
 return <dialog ref={ref} className="ui-lesson-navigation nbd-panel nb-frame" aria-label="Menu điều hướng" aria-modal="true"
  onCancel={onClose} onKeyDown={e => {
   if(e.key !== "Tab") return;
   const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>("a[href]"));
   const first=links[0], last=links[links.length-1];
   if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last?.focus(); }
   else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first?.focus(); }
  }} onClick={e => { if(e.target !== e.currentTarget) return; const r=e.currentTarget.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); }}>
  <NbArtDefs />
  <aside {...s} className="sb-drawer nb-frame nbr" data-testid="app-sidebar">
   <nav {...s} className="nbr-sheet nbx-rail-in" aria-label="Điều hướng chính">
    <div className="nbx-holes nbx-pp" aria-hidden="true"><i/><i/><i/><i/></div>
    <div {...s} className="nbr-head"><Link ref={brand} href="/" className="tap-40 flex items-center gap-2.5 sb-logo nbr-logo-full" onClick={onClose}><BrandLockup idSuffix="lesson-drawer" /></Link></div>
    <div {...s} className="sb-nav nbr-nav"><div {...group} className="nbr-group">{entries.slice(0,9).map(item)}</div><hr {...s} className="nbx-nsep nbr-rule"/><div {...group} className="nbr-group">{entries.slice(9).map(item)}</div></div>
    <div {...s} className="nbu nbx-me nbr-foot" data-testid="user-card"><div className="nbu-row nbx-who">
     <span className="nbu-av" aria-hidden="true"><CritterAvatar index={-1}/></span>
     <div className="nbu-text"><p className="nbu-name">{user?.name ?? "Học viên demo"}</p><p className="nbu-sub">Trình độ {user?.level ?? "A1"}</p></div>
     <Link href="/cai-dat" onClick={onClose} className="nb-btn nb-btn-soft nb-btn-sm nbu-settings"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nb-btn-ic" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>Cài đặt</Link>
    </div><div className="nbu-stats nbx-st"><span className="nbu-st"><b><IconFlame size={14}/>{streak}</b><small>ngày liền</small></span><span className="nbu-st"><b>{MONTHLY_USER_XP}</b><small>XP tháng</small></span></div></div>
   </nav>
  </aside>
 </dialog>;
}
