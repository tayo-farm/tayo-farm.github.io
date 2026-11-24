const C='tayo-v8';
const A=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable.png','./apple-touch-icon.png','./banner.jpg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const off=()=>new Response('<meta charset="utf-8"><body dir="rtl" style="font-family:sans-serif;padding:30px">مفيش إنترنت دلوقتي. افتح التطبيق تاني لما النت يرجع.</body>',{status:200,headers:{'Content-Type':'text/html;charset=utf-8'}});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);if(u.origin!==location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(C);
  try{
   const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),8000);
   const n=await fetch(r,{signal:ctl.signal,cache:'no-cache'});clearTimeout(t);
   if(n&&n.ok)c.put(r,n.clone());
   return n;
  }catch(err){
   const m=await c.match(r,{ignoreSearch:true});
   if(m)return m;
   if(r.mode==='navigate'){const i=await c.match('./index.html');if(i)return i;return off()}
   return new Response('',{status:504});
  }
 })())});
