"use client";
import { useEffect, useId, useRef, useState } from "react";
import icons from "@/lib/ui-fixtures/settings-friends-icons.json";
import "@/styles/custom/settings-friends-reference.css";
import "@/styles/custom/settings-friends-parity.css";
const s={"data-v-da0b53b5":""};
const MODES=["Không đưa lên","Ẩn danh","Hiện @ID"];
function Art({kind}:{kind:keyof typeof icons}){return <span aria-hidden="true" style={{display:"contents"}} dangerouslySetInnerHTML={{__html:icons[kind]}}/>;}
export default function SettingsFriends({handle,savedHandle,onHandle,onSave,online,onOnline,feed,onFeed,notice}:{
  handle:string;savedHandle:string;onHandle:(value:string)=>void;onSave:()=>void;
  online:boolean;onOnline:(value:boolean)=>void;feed:string;onFeed:(value:string)=>void;notice:(text:string)=>void;
}) {
 const id=useId(),[help,setHelp]=useState(false),[linkRevision,setLinkRevision]=useState(0);
 const [host,setHost]=useState("localhost");
 useEffect(()=>setHost(window.location.host),[]);
 const helpRoot=useRef<HTMLSpanElement>(null),helpButton=useRef<HTMLButtonElement>(null);
 const value=feed==="anonymous"?"Ẩn danh":MODES.includes(feed)?feed:"Ẩn danh";
 const dirty=handle!==savedHandle,valid=/^[a-z0-9._]{3,20}$/.test(handle);
 const invitePrefix=`/@${encodeURIComponent(savedHandle)}?m=`;
 const inviteToken=`localdemo${linkRevision||""}`;
 const invite=invitePrefix+inviteToken;
 useEffect(()=>{
  if(!help)return;
  const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();setHelp(false);helpButton.current?.focus();}};
  const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!helpRoot.current?.contains(event.target))setHelp(false)};
  document.addEventListener("keydown",key,true);document.addEventListener("pointerdown",outside);
  return()=>{document.removeEventListener("keydown",key,true);document.removeEventListener("pointerdown",outside)};
 },[help]);
 async function copy(){try{await navigator.clipboard.writeText(location.origin+invite);notice("Đã sao chép link hồ sơ local. Kết bạn tự động chưa được kết nối.");}catch{notice("Không thể sao chép. Bạn có thể chọn đường dẫn để sao chép.");}}
 return <>
  <form {...s} className="fsc-claimed" onSubmit={event=>{event.preventDefault();if(valid&&dirty)onSave();}}>
   <div {...s} className="nbc-fld"><label {...s} htmlFor={`${id}-handle`}>ID của bạn</label><div {...s} className="fsc-row">
    <span {...s} className="nbc-inp fsc-field"><span {...s} className="fsc-at" aria-hidden="true">@</span><input {...s} id={`${id}-handle`} value={handle} type="text" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} required pattern="[a-z0-9._]{3,20}" minLength={3} maxLength={20} aria-invalid={dirty&&!valid||undefined} aria-describedby={`${id}-msg`} data-testid="fs-handle-input" onChange={event=>onHandle(event.target.value)}/><span {...s} className="fsc-counter" aria-hidden="true">{handle.length}/20</span></span>
    <span {...s} className="fsc-save" data-on={dirty?"1":"0"}><button {...s} type="submit" className="nbc-btn is-ink is-sm fsc-save-btn" disabled={!dirty||!valid} data-testid="fs-handle-save">Lưu ID</button></span>
   </div><p {...s} id={`${id}-msg`} aria-live="polite" className={`nbc-hint fsc-msg${dirty&&!valid?" is-on":""}`} data-testid="fs-handle-msg">{dirty&&!valid?"ID gồm 3–20 ký tự: a-z, số, dấu chấm, gạch dưới.":"3-20 ký tự: a-z, số, dấu chấm, gạch dưới. 30 ngày đổi một lần."}</p></div>
   <div {...s} className="nbc-fld"><span {...s} className="nbc-lb">Link mời kết bạn</span><p {...s} className="nbc-linkbox" data-testid="fs-link"><Art kind="link"/><span>{host}{invitePrefix}<b {...s}>{inviteToken}</b></span></p></div>
   <div {...s} className="fsc-actions fsc-actions-pair"><button {...s} type="button" className="nbc-btn is-act is-sm" onClick={copy} data-testid="fs-copy"><Art kind="copy"/>Sao chép</button><button {...s} type="button" className="nbc-btn is-soft is-sm" onClick={()=>{setLinkRevision(value=>value+1);notice("Đã tạo link minh hoạ local; chưa thay link mời trên máy chủ.");}} data-testid="fs-new-link"><Art kind="refresh"/>Tạo link mới</button></div>
   <p {...s} className="nbc-hint fsc-tight">Ai mở link và đăng nhập sẽ thành bạn bè ngay.</p>
  </form>
  <div {...s} className="nbc-lv3 nbc-srow fsc-own"><span><b id={`${id}-hidden`}>Ẩn trạng thái online</b><p id={`${id}-hidden-description`}>Bạn bè không thấy bạn đang học gì.</p></span><button {...s} type="button" role="switch" className="nbc-sw" aria-checked={online} aria-labelledby={`${id}-hidden`} aria-describedby={`${id}-hidden-description`} data-testid="fs-hidden-switch" onClick={()=>onOnline(!online)}><i aria-hidden="true"/></button></div>
  <div {...s} className="nbc-fld"><span {...s} className="fsc-lbq" ref={helpRoot}><span {...s} id={`${id}-feed`} className="nbc-lb">Bảng tin</span><button {...s} ref={helpButton} type="button" className="fsc-q" aria-expanded={help} aria-haspopup="dialog" aria-describedby={help?`${id}-help`:undefined} aria-controls={help?`${id}-help`:undefined} aria-label="Bảng tin hoạt động thế nào" onClick={()=>setHelp(value=>!value)}><Art kind="help"/></button>{help&&<span id={`${id}-help`} role="dialog" aria-label="Bảng tin hoạt động thế nào" className="ui-fsc-help rounded-card border-bw border-border-strong bg-surface shadow-sh-3"><span {...s} className="fsc-pop-p">Ẩn danh hiện tên một con vật. Áp cho cả tin cũ. Khi vào top 100 XP tháng, bạn cũng có thể xuất hiện trong Gợi ý kết bạn.</span></span>}</span>
   <div {...s} className="nbc-seg is-full" role="radiogroup" aria-labelledby={`${id}-feed`} data-testid="fs-feed-mode">{MODES.map((mode,index)=><button key={mode} {...s} type="button" role="radio" className={value===mode?"is-on":""} aria-checked={value===mode} tabIndex={value===mode?0:-1} onClick={()=>onFeed(mode)} onKeyDown={event=>{if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;const step=event.key==="ArrowRight"||event.key==="ArrowDown"?1:event.key==="ArrowLeft"||event.key==="ArrowUp"?-1:0;if(!step&&event.key!=="Home"&&event.key!=="End")return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?2:(index+step+3)%3;onFeed(MODES[next]);event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();}}>{mode}</button>)}</div>
  </div>
  <p {...s} className="nbc-hint fsc-tight">{value==="Ẩn danh"?"Tin của bạn hiện dưới tên một con vật.":value==="Hiện @ID"?"Tin của bạn hiện dưới ID của bạn.":"Hoạt động của bạn không được đưa lên bảng tin."}</p>
  <div {...s} className="nbc-fld"><span {...s} className="nbc-lb">Người đã chặn</span><p {...s} className="nbc-lv3 is-w fsc-none" data-testid="fs-blocked-empty"><Art kind="blocked"/>Bạn chưa chặn ai.</p></div>
 </>;
}
