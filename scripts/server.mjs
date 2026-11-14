import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.pdf':'application/pdf','.svg':'image/svg+xml'};
const documents=JSON.parse(await readFile(path.join(root,'src/sources.json'),'utf8'));
let localInventory;try{localInventory=JSON.parse(await readFile(path.join(root,'inventario-slides.json'),'utf8'));}catch{}
const server=http.createServer(async(req,res)=>{try{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
 const u=new URL(req.url,'http://127.0.0.1');
 if(u.pathname==='/health'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({app:'estudos-mba',version:1}));}
 let file;
 if(u.pathname.startsWith('/materiais/')){
  const source=documents.find(s=>s.id===u.pathname.split('/')[2]);
  const g=source&&localInventory?.grupos[source.subject-1];
  const match=g?.arquivos.find(f=>f.nome===source.file);
  if(!match){res.writeHead(404);return res.end('PDF local indisponível. Copie a pasta Slides e o inventário para este projeto.');}
  file=path.join(root,match.caminho);
 }else{
  const relative=decodeURIComponent(u.pathname==='/'?'index.html':u.pathname.slice(1));
  file=path.resolve(root,'dist',relative);
  if(!file.startsWith(path.join(root,'dist')+path.sep)){res.writeHead(403);return res.end();}
 }
 const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(404);res.end('Arquivo não encontrado.');}});
server.on('error',async e=>{if(e.code==='EADDRINUSE'){try{let data=await(await fetch('http://127.0.0.1:4173/health')).json();if(data.app==='estudos-mba'){console.log('O site já está aberto em http://127.0.0.1:4173');process.exit(0);}}catch{}}console.error(e.message);process.exit(1);});
server.listen(4173,'127.0.0.1',()=>console.log('Estudos MBA: http://127.0.0.1:4173'));
