"use client";
import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { type DictEntry } from "@/lib/demo-data/dictionary";
import { speak } from "../lesson/speech";
import samples from "@/lib/ui-fixtures/grammar-word-tap-samples.json";
import "@/styles/custom/grammar-word-tap.css";

const names: Record<string,string> = {noun:"Danh từ",verb:"Động từ",adjective:"Tính từ",adverb:"Trạng từ",pronoun:"Đại từ",preposition:"Giới từ",conjunction:"Liên từ",determiner:"Từ hạn định"};
function WordIcon({kind}:{kind:"sound"|"save"|"book"|"close"}) {
  return <svg width={kind==="sound"?16:18} height={kind==="sound"?16:18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind==="sound"?<><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M16 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></>:kind==="save"?<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>:kind==="book"?<><path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z"/></>:<path d="m18 6-12 12M6 6l12 12"/>}
  </svg>;
}
export default function GrammarWordTap({text, focus = [], highlightClass = "gdr-focus"}:{text:string;focus?:string[];highlightClass?:"gdr-focus"|"text-primary"}) {
  const words=text.split(/(\s+)/), indexes=words.flatMap((word,i)=>/[\p{L}\p{N}]/u.test(word)?[i]:[]);
  const root=useRef<HTMLSpanElement>(null), popup=useRef<HTMLSpanElement>(null), trigger=useRef<HTMLElement|null>(null);
  const id=useId(), [current,setCurrent]=useState(indexes[0]), [selected,setSelected]=useState<string|null>(null);
  const tabbable=indexes.includes(current)?current:indexes[0];
  const [entries,setEntries]=useState<DictEntry[]>([]),[status,setStatus]=useState<"loading"|"ready"|"error">("loading");
  const [savedNotice,setSavedNotice]=useState(false),[position,setPosition]=useState<{left:number;top:number;arrow:number;above:boolean}|null>(null),[anchorVersion,setAnchorVersion]=useState(0);
  const normalize=(word:string)=>word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,"");
  function close(restore=true){setSelected(null);if(restore&&trigger.current?.isConnected)trigger.current.focus();}
  function open(element:HTMLElement,word:string){trigger.current=element;setPosition(null);setSelected(normalize(word));setSavedNotice(false);setAnchorVersion(value=>value+1);}
  useEffect(()=>{setSelected(null);setCurrent(indexes[0]);},[text]);
  useEffect(()=>{
    if(!selected)return;
    let cancelled=false;setStatus("loading");setEntries([]);
    void import("@/lib/demo-data/dictionary").then(({searchDictionary})=>{
      if(cancelled)return;
      const specimen=(samples as Record<string,{word:string;ipa:string;pos:string;vi:string;details:string}>)[selected.toLowerCase()];
      setEntries(specimen?[{...specimen,level:null,def:specimen.details,example:null,exampleVi:null}]:searchDictionary(selected,30).items.filter(item=>item.word.toLowerCase()===selected.toLowerCase()));setStatus("ready");
    }).catch(()=>{if(!cancelled)setStatus("error")});
    return()=>{cancelled=true};
  },[selected]);
  useLayoutEffect(()=>{
    if(!selected)return;
    function place(){
      if(!trigger.current||!popup.current)return;
      if(window.innerWidth<640){setPosition(null);return;}
      const a=trigger.current.getBoundingClientRect(),p=popup.current.getBoundingClientRect();
      const left=Math.max(8,Math.min(a.left+a.width/2-p.width/2,window.innerWidth-p.width-8));
      const above=a.top-p.height-12>=8;
      const top=above?a.top-p.height-12:Math.min(a.bottom+12,Math.max(8,window.innerHeight-p.height-8));
      const arrow=Math.max(14,Math.min(a.left+a.width/2-left-7,p.width-28));
      setPosition(old=>old?.left===left&&old.top===top&&old.arrow===arrow&&old.above===above?old:{left,top,arrow,above});
    }
    let frame=0;
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;place()})};
    place();const resize=new ResizeObserver(schedule);if(popup.current)resize.observe(popup.current);
    window.addEventListener("resize",schedule);window.addEventListener("scroll",schedule,true);
    return()=>{resize.disconnect();window.removeEventListener("resize",schedule);window.removeEventListener("scroll",schedule,true);if(frame)cancelAnimationFrame(frame)};
  },[selected,status,savedNotice,anchorVersion]);
  useEffect(()=>{
    if(!selected)return;
    const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close();}};
    const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!popup.current?.contains(event.target)&&!trigger.current?.contains(event.target))close(false)};
    const focusOutside=(event:FocusEvent)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))close(false)};
    document.addEventListener("keydown",key,true);document.addEventListener("pointerdown",outside);document.addEventListener("focusin",focusOutside);
    return()=>{document.removeEventListener("keydown",key,true);document.removeEventListener("pointerdown",outside);document.removeEventListener("focusin",focusOutside)};
  },[selected]);
  const first=entries[0];
  return <span ref={root} className="ui-grammar-word-tap">
    {words.map((word,i)=>indexes.includes(i)?<span key={i} className="dict-word" data-dict-term={normalize(word)} role="button" tabIndex={tabbable===i?0:-1}
      aria-haspopup="dialog" aria-expanded={selected!==null&&trigger.current?.dataset.dictIndex===String(i)} data-dict-index={i}
      aria-controls={selected&&trigger.current?.dataset.dictIndex===String(i)?id:undefined} onClick={event=>{setCurrent(i);open(event.currentTarget,word)}}
      onKeyDown={event=>{
        if(event.key==="Tab"&&!event.shiftKey&&selected&&trigger.current===event.currentTarget){event.preventDefault();popup.current?.querySelector<HTMLButtonElement>("button")?.focus();return;}
        if(event.key==="Enter"||event.key===" "){event.preventDefault();event.stopPropagation();open(event.currentTarget,word);return;}
        const step=event.key==="ArrowRight"?1:event.key==="ArrowLeft"?-1:0;
        if(!step&&event.key!=="Home"&&event.key!=="End")return;
        event.preventDefault();event.stopPropagation();
        const next=event.key==="Home"?indexes[0]:event.key==="End"?indexes.at(-1)!:indexes[(indexes.indexOf(i)+step+indexes.length)%indexes.length];
        setCurrent(next);root.current?.querySelector<HTMLElement>(`[data-dict-index="${next}"]`)?.focus();
      }}>{focus.includes(normalize(word))?<strong className={highlightClass}>{word}</strong>:word}</span>:word)}
    {selected&&<span ref={popup} id={id} role="dialog" aria-label={`Tra từ ${selected}`} className="ui-grammar-word-popup rounded-card border-bw border-border-strong bg-surface p-4 shadow-sh-2"
      data-side={position?.above?"above":"below"} style={position?{left:position.left,top:position.top,"--gwt-arrow":`${position.arrow}px`} as CSSProperties:undefined}
      onKeyDown={event=>{if(event.key==="Tab"&&event.shiftKey&&event.target===popup.current?.querySelector("button")){event.preventDefault();trigger.current?.focus();}}}>
      <span className="ui-gwt-head"><span className="ui-gwt-title">{selected}<button type="button" aria-label="Phát âm" onClick={()=>speak(selected)}><WordIcon kind="sound"/></button></span>
        <span className="ui-gwt-tools"><button type="button" aria-label="Lưu vào danh sách từ" onClick={()=>setSavedNotice(true)}><WordIcon kind="save"/></button><Link href={`/tu-dien?q=${encodeURIComponent(selected)}`} aria-label="Xem chi tiết trong Từ điển chuyên sâu"><WordIcon kind="book"/></Link><button type="button" aria-label="Đóng" onClick={()=>close()}><WordIcon kind="close"/></button></span></span>
      {savedNotice&&<span role="status" className="ui-gwt-notice">Lưu từ tại chỗ chưa được kết nối. Bạn có thể mở Từ điển chuyên sâu.</span>}
      {status==="loading"?<span role="status" className="ui-gwt-content">Đang tra cứu…</span>:status==="error"?<span role="status" className="ui-gwt-content">Không tải được từ điển. Hãy mở Từ điển chuyên sâu.</span>:<>
        <span className="ui-gwt-meta">{first?.ipa&&<span className="font-ipa ipa-tone text-sm">{first.ipa}</span>}{first&&<span className="ui-gwt-pos">{names[first.pos]??first.pos}</span>}</span>
        <span className="ui-gwt-content">{first?<><span className="ui-gwt-primary">{first.vi??first.def??selected}</span><span className="ui-gwt-rule" aria-hidden="true"/>{entries.map((entry,i)=><span key={`${entry.pos}-${i}`} className="ui-gwt-row"><em>{names[entry.pos]??entry.pos}</em><span>{(samples as Record<string,{details:string}>)[selected.toLowerCase()]?.details??entry.vi??entry.def??"Chưa có nghĩa tiếng Việt trong dữ liệu local."}</span></span>)}</>:<span>Chưa có kết quả trong từ điển local.</span>}</span>
      </>}
    </span>}
  </span>;
}
