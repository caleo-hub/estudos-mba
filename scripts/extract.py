from pathlib import Path
import json, re, sys
from pypdf import PdfReader
sys.stdout.reconfigure(encoding='utf-8')
root=Path(__file__).resolve().parent.parent
data=json.loads((root/'inventario-slides.json').read_text(encoding='utf-8'))
out=root/'.local';out.mkdir(exist_ok=True)
docs=[]
for gi,g in enumerate(data['grupos'],1):
 for fi,f in enumerate(g['arquivos'],1):
  pages=[]
  for page in PdfReader(root/f['caminho']).pages:
   text=page.extract_text() or ''
   text=re.sub(r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b','',text)
   text=re.sub(r'Caléo Meneses Santos','',text,flags=re.I)
   pages.append(text)
  docs.append({'id':f's{gi:02d}-{fi}','subject':gi,'title':g['assunto'],'file':f['nome'],'path':f['caminho'],'pages':pages})
(out/'sources.json').write_text(json.dumps(docs,ensure_ascii=False),encoding='utf-8')
for d in docs:
 if d['id'].endswith('-1'):
  print('\n'+d['id']+' '+d['title']+' ('+str(len(d['pages']))+'p)')
  for pi,t in enumerate(d['pages']):
   lines=[x.strip() for x in t.splitlines() if x.strip() and not re.search(r'responsabilidade|idoneidade|Proibida|9610|originalidade|ilicitude|licitude|conteúdos didáticos|professor\.',x,re.I)]
   if pi>1 and lines: print(str(pi+1)+': '+' / '.join(lines[:2])[:170])
