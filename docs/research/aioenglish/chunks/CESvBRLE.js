import{t as e}from"./BbfpZ9Tg.js";import{O as t,_t as n,lt as r,mt as i,ut as a,w as o}from"./12Oibn0q.js";var s=Error.captureStackTrace,c=class t extends Error{get why(){return this.message}constructor(n,r=t){super(n.why,{cause:n.cause}),e(this,`name`,void 0),e(this,`code`,void 0),e(this,`docs`,void 0),e(this,`fix`,void 0),e(this,`sources`,void 0),this.code=this.name=n.code,this.fix=n.fix,this.docs=n.docs,this.sources=n.sources,s?.(this,r)}toJSON(){return{name:this.name,why:this.why,fix:this.fix,docs:this.docs,sources:this.sources,cause:this.cause,stack:this.stack}}};function l(e,t){return typeof e==`string`?`${e}/${t.toLowerCase()}`:e?.(t)}function u(e={}){let{docsBase:t,reporters:n=[]}=e;return new Proxy({},{get(e,r){if(typeof r!=`string`)return;let i=(e={},a={})=>{let o=l(t,r),s=new c({code:r,why:o??``,docs:o,cause:e.cause,sources:e.sources},i);for(let e of n)e(s,a);return s};return i}})}function d(e){return`https://nuxt.com/docs/4.x/errors/${e.replace(`NUXT_`,``).toLowerCase()}`}var f=[e=>{console.error(`[${e.name}]`)}],p=u({docsBase:d,reporters:f});function m(e,t={},n){for(let r in e){let i=e[r],a=n?`${n}:${r}`:r;typeof i==`object`&&i?m(i,t,a):typeof i==`function`&&(t[a]=i)}return t}var h=(()=>{if(console.createTask)return console.createTask;let e={run:e=>e()};return()=>e})();function g(e,t,n,r){for(let i=n;i<e.length;i+=1)try{let n=r?r.run(()=>e[i](...t)):e[i](...t);if(n&&typeof n.then==`function`)return Promise.resolve(n).then(()=>g(e,t,i+1,r))}catch(e){return Promise.reject(e)}}function ee(e,t,n){if(e.length>0)return g(e,t,0,h(n))}function _(e,t,n){if(e.length>0){let r=h(n);return Promise.all(e.map(e=>r.run(()=>e(...t))))}}function v(e,t){for(let n of[...e])n(t)}var y=class{constructor(){e(this,`_hooks`,void 0),e(this,`_before`,void 0),e(this,`_after`,void 0),e(this,`_deprecatedHooks`,void 0),e(this,`_deprecatedMessages`,void 0),this._hooks={},this._before=void 0,this._after=void 0,this._deprecatedMessages=void 0,this._deprecatedHooks={},this.hook=this.hook.bind(this),this.callHook=this.callHook.bind(this),this.callHookWith=this.callHookWith.bind(this)}hook(e,t,n={}){if(!e||typeof t!=`function`)return()=>{};let r=e,i;for(;this._deprecatedHooks[e];)i=this._deprecatedHooks[e],e=i.to;if(i&&!n.allowDeprecated){let e=i.message;e||=`${r} hook has been deprecated`+(i.to?`, please use ${i.to}`:``),this._deprecatedMessages||=new Set,this._deprecatedMessages.has(e)||(console.warn(e),this._deprecatedMessages.add(e))}if(!t.name)try{Object.defineProperty(t,"name",{get:()=>`_`+e.replace(/\W+/g,`_`)+`_hook_cb`,configurable:!0})}catch{}return this._hooks[e]=this._hooks[e]||[],this._hooks[e].push(t),()=>{t&&=(this.removeHook(e,t),void 0)}}hookOnce(e,t){let n,r=(...e)=>(typeof n==`function`&&n(),n=void 0,r=void 0,t(...e));return n=this.hook(e,r),n}removeHook(e,t){let n=this._hooks[e];if(n){let r=n.indexOf(t);r!==-1&&n.splice(r,1),n.length===0&&(this._hooks[e]=void 0)}}clearHook(e){this._hooks[e]=void 0}deprecateHook(e,t){this._deprecatedHooks[e]=typeof t==`string`?{to:t}:t;let n=this._hooks[e]||[];this._hooks[e]=void 0;for(let t of n)this.hook(e,t)}deprecateHooks(e){for(let t in e)this.deprecateHook(t,e[t])}addHooks(e){let t=m(e),n=Object.keys(t).map(e=>this.hook(e,t[e]));return()=>{for(let e of n)e();n.length=0}}removeHooks(e){let t=m(e);for(let e in t)this.removeHook(e,t[e])}removeAllHooks(){this._hooks={}}callHook(e,...t){return this.callHookWith(ee,e,t)}callHookParallel(e,...t){return this.callHookWith(_,e,t)}callHookWith(e,t,n){let r=this._before||this._after?{name:t,args:n,context:{}}:void 0;this._before&&v(this._before,r);let i=e(this._hooks[t]?[...this._hooks[t]]:[],n,t);return i instanceof Promise?i.finally(()=>{this._after&&r&&v(this._after,r)}):(this._after&&r&&v(this._after,r),i)}beforeEach(e){return this._before=this._before||[],this._before.push(e),()=>{if(this._before!==void 0){let t=this._before.indexOf(e);t!==-1&&this._before.splice(t,1)}}}afterEach(e){return this._after=this._after||[],this._after.push(e),()=>{if(this._after!==void 0){let t=this._after.indexOf(e);t!==-1&&this._after.splice(t,1)}}}};function b(){return new y}var te=class{constructor(){e(this,`_hooks`,void 0),this._hooks={}}hook(e,t){return!e||typeof t!=`function`?()=>{}:(this._hooks[e]=this._hooks[e]||[],this._hooks[e].push(t),()=>{t&&=(this.removeHook(e,t),void 0)})}removeHook(e,t){let n=this._hooks[e];if(n){let r=n.indexOf(t);r!==-1&&n.splice(r,1),n.length===0&&(this._hooks[e]=void 0)}}callHook(e,...t){let n=this._hooks[e];if(!(!n||n.length===0))return g(n,t,0)}};function ne(e,t){if(t.has(e))throw TypeError(`Cannot initialize the same private elements twice on an object`)}function x(e,t,n){ne(e,t),t.set(e,n)}function S(e,t,n){if(typeof e==`function`?e===t:e.has(t))return arguments.length<3?t:n;throw TypeError(`Private element is not present on this object`)}function C(e,t,n){return e.set(S(e,t),n),n}function w(e,t){return e.get(S(e,t))}var T;function E(){return globalThis.AsyncLocalStorage||globalThis.process?.getBuiltinModule?.(`node:async_hooks`)?.AsyncLocalStorage}var D=globalThis.WeakRef||(T=new WeakMap,class{constructor(e){x(this,T,void 0),C(T,this,e)}deref(){return w(T,this)}});function O(e={}){let t,n=!1,r=e=>{if(t&&t!==e)throw Error(`Context conflict`)},i;if(e.asyncContext){let t=e.AsyncLocalStorage||E();t?i=new t:console.warn("[unctx] `AsyncLocalStorage` is not provided.")}let a=e=>i&&typeof e==`object`&&e?{__unctx_weak:new D(e)}:e,o=e=>e&&e.__unctx_weak?e.__unctx_weak.deref():e,s=()=>{if(i){let e=i.getStore();if(e!==void 0)return o(e)}return t};return{use:()=>{let e=s();if(e===void 0)throw Error(`Context is not available`);return e},tryUse:()=>s()??null,set:(e,i)=>{i||r(e),t=e,n=!0},unset:()=>{t=void 0,n=!1},call:(e,o)=>{r(e),t=e;try{return i?i.run(a(e),o):o()}finally{n||(t=void 0)}},async callAsync(e,r){t=e;let o=()=>{t=e},s=()=>t===e?o:void 0;F.add(s);try{let o=i?i.run(a(e),r):r();return n||(t=void 0),await o}finally{F.delete(s)}}}}function k(e={}){let t={};return{get(n,r={}){return t[n]||(t[n]=O({...e,...r})),t[n]}}}var A=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof global<`u`?global:typeof window<`u`?window:{},j=`__unctx__`,M=A[j]||(A[j]=k()),N=(e,t={})=>M.get(e,t),P=`__unctx_async_handlers__`,F=A[P]||(A[P]=new Set);function I(e){let t=[];for(let e of F){let n=e();n&&t.push(n)}let n=()=>{for(let e of t)e()},r=e();return r&&typeof r==`object`&&`catch`in r&&(r=r.catch(e=>{throw n(),e})),[r,n]}var L={name:`page`,mode:`out-in`},R={meta:[{charset:`utf-8`},{name:`viewport`,content:`width=device-width, initial-scale=1, viewport-fit=cover`},{name:`theme-color`,content:`#f3f2eb`,tagPriority:0},{name:`mobile-web-app-capable`,content:`yes`},{name:`apple-mobile-web-app-capable`,content:`yes`},{name:`apple-mobile-web-app-title`,content:`AIO English`},{name:`description`,content:`Mọi thứ về tiếng Anh, trong một ứng dụng.`},{name:`application-name`,content:`AIO English`},{property:`og:type`,content:`website`},{property:`og:site_name`,content:`AIO English`},{property:`og:locale`,content:`vi_VN`},{property:`og:title`,content:`AIO English`},{property:`og:description`,content:`Mọi thứ về tiếng Anh, trong một ứng dụng.`},{property:`og:image`,content:`https://aioenglish.com/brand/tienganh/social-banner.jpg`},{property:`og:image:width`,content:`1200`},{property:`og:image:height`,content:`675`},{property:`og:image:type`,content:`image/jpeg`},{property:`og:image:alt`,content:`AIO English - học nhẹ nhàng, tiến bộ mỗi ngày: từ vựng, phản xạ, giao tiếp`},{property:`og:url`,content:`https://aioenglish.com`},{name:`twitter:card`,content:`summary_large_image`},{name:`twitter:title`,content:`AIO English`},{name:`twitter:description`,content:`Mọi thứ về tiếng Anh, trong một ứng dụng.`},{name:`twitter:image`,content:`https://aioenglish.com/brand/tienganh/social-banner.jpg`},{name:`twitter:image:alt`,content:`AIO English - học nhẹ nhàng, tiến bộ mỗi ngày: từ vựng, phản xạ, giao tiếp`}],link:[{rel:`manifest`,href:`/manifest.webmanifest`},{rel:`icon`,type:`image/svg+xml`,href:`/brand/tienganh/favicon.svg`},{rel:`apple-touch-icon`,sizes:`180x180`,href:`/brand/tienganh/apple-touch-icon-180.png`},{rel:`preload`,as:`font`,type:`font/woff2`,href:`/fonts/quicksand-300-700-latin.woff2`,crossorigin:``},{rel:`preload`,as:`font`,type:`font/woff2`,href:`/fonts/quicksand-300-700-latin-ext.woff2`,crossorigin:``},{rel:`preload`,as:`font`,type:`font/woff2`,href:`/fonts/quicksand-300-700-vietnamese.woff2`,crossorigin:``},{rel:`preload`,as:`font`,type:`font/woff2`,href:`/fonts/lexend-500-800-vietnamese.woff2`,crossorigin:``}],style:[{innerHTML:`/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=Quicksand:wght@300..700 (Quicksand, giấy phép OFL).
   Vì sao tự host thay vì gọi Google: xem đầu tools/vendor-webfont.mjs. */
/* vietnamese */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url(/fonts/quicksand-300-700-vietnamese.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url(/fonts/quicksand-300-700-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 300 700;
  font-display: swap;
  src: url(/fonts/quicksand-300-700-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=Lexend:wght@500..800 (Lexend, giấy phép OFL).
   Vì sao tự host thay vì gọi Google: xem đầu tools/vendor-webfont.mjs. */
/* vietnamese */
@font-face {
  font-family: 'Lexend';
  font-style: normal;
  font-weight: 500 800;
  font-display: swap;
  src: url(/fonts/lexend-500-800-vietnamese.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Lexend';
  font-style: normal;
  font-weight: 500 800;
  font-display: swap;
  src: url(/fonts/lexend-500-800-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Lexend';
  font-style: normal;
  font-weight: 500 800;
  font-display: swap;
  src: url(/fonts/lexend-500-800-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=Nunito:wght@400..800 (Nunito, giấy phép OFL).
   Vì sao tự host thay vì gọi Google: xem đầu tools/vendor-webfont.mjs. */
/* vietnamese */
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url(/fonts/nunito-400-800-vietnamese.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url(/fonts/nunito-400-800-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url(/fonts/nunito-400-800-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700 (Newsreader, giấy phép OFL).
   Vì sao tự host thay vì gọi Google: xem đầu tools/vendor-webfont.mjs. */
/* vietnamese */
@font-face {
  font-family: 'Newsreader';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url(/fonts/newsreader-400-700-vietnamese.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin */
@font-face {
  font-family: 'Newsreader';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url(/fonts/newsreader-400-700-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=Andika:wght@<w>&text=<bộ ký tự IPA> (Andika, giấy phép OFL).
   Subset theo KÝ TỰ (404 mã) - lý do ở mục Andika trong tools/vendor-webfont.mjs. */
@font-face {
  font-family: 'Andika';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/fonts/andika-400-ipa.woff2) format('woff2');
  unicode-range: U+0020-007E, U+00A0, U+00B7, U+00E6-00E7, U+00F0, U+00F8, U+0127, U+014B, U+0153, U+0250-036F, U+03B2, U+03B8, U+03C7, U+1D4A, U+1D7B, U+1D7F, U+2016, U+203F, U+2191, U+2193, U+2197-2198;
}
@font-face {
  font-family: 'Andika';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(/fonts/andika-700-ipa.woff2) format('woff2');
  unicode-range: U+0020-007E, U+00A0, U+00B7, U+00E6-00E7, U+00F0, U+00F8, U+0127, U+014B, U+0153, U+0250-036F, U+03B2, U+03B8, U+03C7, U+1D4A, U+1D7B, U+1D7F, U+2016, U+203F, U+2191, U+2193, U+2197-2198;
}

/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..500 (JetBrains Mono, giấy phép OFL).
   Vì sao tự host thay vì gọi Google: xem đầu tools/vendor-webfont.mjs. */
/* vietnamese */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url(/fonts/jetbrains-mono-400-500-vietnamese.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url(/fonts/jetbrains-mono-400-500-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400 500;
  font-display: swap;
  src: url(/fonts/jetbrains-mono-400-500-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800 (Bricolage Grotesque, giấy phép OFL).
   Vì sao tự host thay vì gọi Google: xem đầu tools/vendor-webfont.mjs. */
/* vietnamese */
@font-face {
  font-family: 'Bricolage Grotesque';
  font-style: normal;
  font-weight: 600 800;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/bricolage-600-800-vietnamese.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Bricolage Grotesque';
  font-style: normal;
  font-weight: 600 800;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/bricolage-600-800-latin-ext.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Bricolage Grotesque';
  font-style: normal;
  font-weight: 600 800;
  font-stretch: 100%;
  font-display: swap;
  src: url(/fonts/bricolage-600-800-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* FILE SINH RA - node tools/vendor-webfont.mjs. ⛔ ĐỪNG SỬA TAY.
   Nguồn: fonts.googleapis.com/css2?family=Patrick+Hand (Patrick Hand, giấy phép OFL).
   Vì sao tự host thay vì gọi Google: xem đầu tools/vendor-webfont.mjs. */
/* vietnamese */
@font-face {
  font-family: 'Patrick Hand';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/fonts/patrick-hand-400-vietnamese.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin */
@font-face {
  font-family: 'Patrick Hand';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/fonts/patrick-hand-400-latin.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* DỰ PHÒNG CÙNG SỐ ĐO CHO LEXEND (tiêu đề + số) - VIẾT TAY, nhúng vào <head> cùng lexend.css/quicksand.css
   (nuxt.config \`fontFaceCss\`), token \`--font-display\` gọi nó NGAY SAU "Lexend" (assets/css/main.css).

   VÌ SAO (đo 06/10, probe tools/ui-probes/landing_font_swap_cls.py): preload chỉ đưa BYTE về sớm, không bảo đảm
   font đã ÁP DỤNG ở lần layout đầu - máy yếu / mạng chậm vẫn vẽ khung đầu bằng chữ dự phòng rồi HOÁN. Hero landing
   @360 có tiêu đề "Học tiếng Anh" rộng 277px trong hộp 272px: Lexend ngắt 2 dòng, chữ dự phòng cũ (Quicksand/Segoe,
   ~255px) vừa 1 dòng ⇒ hoán là CẢ hero tụt 41,5px (CLS 0,026-0,031, 10/10 lần tải prod @CPU 4× + 3G).
   Dự phòng này là Arial Bold phóng theo bề rộng Lexend ⇒ hai trạng thái ngắt dòng GIỐNG NHAU, hoán chỉ đổi nét chữ.

   CÁCH TÍNH (đừng chép số của họ khác - mỗi họ một phép đo):
   · size-adjust = bề rộng Lexend 800 / bề rộng Arial Bold trên tiêu đề hero ở font-size thật (~1,08), rồi dò mịn bằng probe:
     1,0885-1,0895 cho 0 lệch ở MỌI bề rộng nguyên 362-368px; thấp hơn còn lệch 1-6px trong cụm 360-365 (1,04-1,06: cả cụm;
     1,084-1,088: chỉ còn 365), 1,09 lệch 366. Dải hẹp vì tiêu đề (277,1px) sát hộp @365px - mặt dự phòng trên máy KHÁC (Mac:
     bề rộng không làm tròn px nguyên) có thể lệch 1-2px quanh 365px, bề rộng không có máy thật nào dùng. Bản 500-600 = Arial
     thường, tỉ lệ Lexend500/Arial 1,1055 · Lexend600/Arial 1,1276 (lấy giữa) trên ~90 câu copy landing.
   · ascent/descent-override = số đo Lexend (hhea 1000/-250 trên 1000 upm) / size-adjust - Chrome nhân override với
     size-adjust nên chia lại; line-gap 0. Tắt bù x-height của .font-display/.font-hero (font-size-adjust: none) nên
     size-adjust ở đây KHÔNG bị font-size-adjust khử (Quicksand thì bị - xem rule design-tokens, mục Phông).
   · src chỉ là local(): không tải gì, không phụ thuộc mạng. Máy không có Arial/Liberation/Arimo (Android) ⇒ face không
     hợp lệ ⇒ trình duyệt bỏ qua, rơi về Quicksand như trước (không tệ đi).
   ⚠️ Đổi font/weight tiêu đề hay cỡ chữ hero ⇒ đo lại bằng probe trên. */
@font-face {
  font-family: 'Lexend Fallback';
  font-style: normal;
  font-weight: 700 800;
  src: local('Arial Bold'), local('Arial-BoldMT'), local('Liberation Sans Bold'), local('LiberationSans-Bold'), local('Arimo Bold'), local('Arimo-Bold');
  size-adjust: 108.9%;
  ascent-override: 91.83%;
  descent-override: 22.96%;
  line-gap-override: 0%;
}
@font-face {
  font-family: 'Lexend Fallback';
  font-style: normal;
  font-weight: 500 600;
  src: local('Arial'), local('ArialMT'), local('Liberation Sans'), local('LiberationSans'), local('Arimo'), local('Arimo-Regular');
  size-adjust: 111.5%;
  ascent-override: 89.69%;
  descent-override: 22.42%;
  line-gap-override: 0%;
}
`}],script:[{innerHTML:`(function(){try{var d=document.documentElement;var t=null,g=null;try{t=localStorage.getItem('lh-theme');g=localStorage.getItem('langhub:bb-suggest');if(localStorage.getItem('lh-theme-light-1030')!=='1'){localStorage.setItem('lh-theme-light-1030','1');if(t!==null){localStorage.removeItem('lh-theme');t=null;}}localStorage.removeItem('langhub:theme');localStorage.removeItem('langhub:mode');localStorage.removeItem('langhub:font');localStorage.removeItem('langhub:bb-copy');localStorage.removeItem('langhub:sidebar');}catch(e){}d.setAttribute('data-app','tienganh');d.setAttribute('data-lm-boot','');if(g!=='0')d.setAttribute('data-bb-suggest','1');var k=t==='dark';if(t==='system'){try{k=!!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);}catch(e){}}var m=k?'dark':'light';d.setAttribute('data-theme',m);d.style.setProperty('color-scheme',m);var c=document.querySelector('meta[name="theme-color"]');if(c)c.setAttribute('content',k?'#23211d':'#f3f2eb');}catch(e){}try{var r=document.documentElement,n=null;try{n=localStorage.getItem('lh-skin');}catch(e){}r.setAttribute('data-skin',(n==='sotay'||n==='neo')?n:'sotay');}catch(e){}try{if(/Android/.test(navigator.userAgent)){var x=document.createElement('meta');x.name='text-scale';x.content='scale';document.head.appendChild(x);}}catch(e){}try{var q=document.documentElement,F=document.fonts;if(F&&F.load){q.setAttribute('data-webfont-wait','');var z=0,u=function(){if(!z){z=1;q.removeAttribute('data-webfont-wait');}},w=function(e){if(z)return;Promise.all([F.load('800 16px "Bricolage Grotesque"','Aa Ẩ'),F.load('600 16px "Nunito"','Aa Ẩ')]).then(function(a){for(var i=0;i<a.length;i++)if(!a[i].length&&!e)return;u();},u);};document.addEventListener('DOMContentLoaded',function(){w(0);});window.addEventListener('load',function(){w(1);});setTimeout(u,1200);}}catch(e){}})();`,tagPosition:`head`}],noscript:[],htmlAttrs:{lang:`vi`,"data-app":`tienganh`},title:`AIO English`},z={id:`__nuxt-loader`},B={componentName:`NuxtLink`,prefetch:!0,prefetchOn:{visibility:!0}},V={deep:!1},re={resetOnClear:!1},H=`#__nuxt`,U=`nuxt-app`,W=36e5,G=`vite:preloadError`;function K(e=`nuxt-app`){return N(e,{asyncContext:!1})}var q=`__nuxt_plugin`;function J(e){let t=0,o={_id:e.id||`nuxt-app`,_scope:r(),provide:void 0,versions:{get nuxt(){return`4.5.2`},get vue(){return o.vueApp.version}},payload:n({...e.ssrContext?.payload||{},data:n({}),state:i({}),once:new Set,_errors:n({})}),static:{data:{}},runWithContext(e){return o._scope.active&&!a()?o._scope.run(()=>Z(o,e)):Z(o,e)},isHydrating:!0,deferHydration(){if(!o.isHydrating)return()=>{};t++;let e=!1;return()=>{if(!e&&(e=!0,t--,t===0))return o.isHydrating=!1,o.callHook(`app:suspense:resolve`)}},_asyncDataPromises:{},_asyncData:n({}),_state:n({}),_payloadRevivers:{},...e};{let e=window.__NUXT__;if(e)for(let t in e)switch(t){case`data`:case`state`:case`_errors`:Object.assign(o.payload[t],e[t]);break;default:o.payload[t]=e[t]}}o.hooks=b(),o.hook=o.hooks.hook;{let e=o.hooks.callHook;o.hooks.callHook=(t,...n)=>Promise.resolve().then(()=>e(t,...n))}o.callHook=o.hooks.callHook,o.provide=(e,t)=>{let n=`$`+e;$(o,n,t),$(o.vueApp.config.globalProperties,n,t)},$(o.vueApp,`$nuxt`,o),$(o.vueApp.config.globalProperties,`$nuxt`,o);{window.addEventListener(G,e=>{o.callHook(`app:chunkError`,{error:e.payload}),e.payload?.message?.includes(`Unable to preload CSS`)&&e.preventDefault()}),window.useNuxtApp||=Q;let e=o.hook(`app:error`,(...e)=>{p.NUXT_E1005({cause:e.length>1?e:e[0]})});o.hook(`app:mounted`,e)}let s=o.payload.config;return o.provide(`config`,s),o}async function Y(e,t){if(typeof t==`function`){let{provide:n}=await e.runWithContext(()=>t(e))||{};if(n&&typeof n==`object`)for(let t in n)e.provide(t,n[t])}}async function X(e,t){let n;for(let r of t)try{await Y(e,r)}catch(t){if(!e.payload.error)throw t;n||=t}if(n)throw e.payload.error||n}function ie(e){if(typeof e==`function`)return e;let t=e._name||e.name;return delete e.name,Object.assign(e.setup||(()=>{}),e,{[q]:!0,_name:t})}function Z(e,t,n){return K(e._id).set(e),e.vueApp.runWithContext(()=>n?t(...n):t())}function ae(e){let n;return t()&&(n=o()?.appContext.app.$nuxt),n||=K(e).tryUse(),n||null}function Q(e){let t=ae(e);if(!t)throw p.NUXT_E1001();return t}function oe(e){return Q().$config}function $(e,t,n){Object.defineProperty(e,t,{get:()=>n})}function se(e){return Array.isArray(e)?e:[e]}var ce=/bot\b|chrome-lighthouse|facebookexternalhit|google\b/i;function le(e){return ce.test(e)}import.meta.url.replace(/\/app\/.*$/,`/`);export{f as C,d as S,I as _,ie as a,te as b,R as c,z as d,V as f,H as g,re as h,J as i,U as l,W as m,se as n,Q as o,B as p,X as r,oe as s,le as t,L as u,w as v,u as w,p as x,x as y};