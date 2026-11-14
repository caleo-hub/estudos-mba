import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {questions,cards,testOrder} from '../src/content.js';
import {AXES} from '../src/diagnosis.js';
const sources=JSON.parse(await readFile(new URL('../src/sources.json',import.meta.url),'utf8'));
assert.equal(questions.length,100);assert.equal(cards.length,200);assert.equal(new Set(questions.map(q=>q.id)).size,100);assert.equal(new Set(cards.map(c=>c.id)).size,200);
assert.equal(new Set(testOrder).size,100);assert.equal(testOrder.length,100);
assert.equal(questions.filter(q=>q.integrative).length,30);
for(const[d,n]of[['basica',30],['intermediaria',50],['avancada',20]])assert.equal(questions.filter(q=>q.difficulty===d).length,n,d);
for(const a of AXES)assert.equal(questions.filter(q=>q.axis===a.id).length,a.quota,a.title);
for(let subject=2;subject<=38;subject++)assert.ok(questions.filter(q=>q.topics.includes(subject)).length>=2,`Cobertura assunto ${subject}`);
for(const q of questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert.ok(q.correct>=0&&q.correct<4);assert.ok(q.stem&&q.explanation&&q.recall&&q.application&&q.solution);assert.ok(q.skills.length);
 for(const[o,i]of q.options.map((o,i)=>[o,i])){assert.ok(o.reason,`${q.id}: distrator sem explicação`);if(i!==q.correct)assert.ok(o.errors.length);else assert.equal(o.errors.length,0);}
 for(const r of q.refs){const s=sources.find(s=>s.id===r.source);assert.ok(s,`${q.id}: fonte inexistente`);assert.ok(r.page>=1&&r.page<=s.pageCount,`${q.id}: página inexistente`);assert.equal(s.subject,r.subject);}
 for(const c of cards.filter(c=>c.questionId===q.id)){assert.ok(c.front&&c.back&&c.example);assert.notEqual(c.front,q.stem);const l=c.lesson;assert.ok(l,`${c.id}: sem teoria`);assert.equal(l.steps.length,3,`${c.id}: exemplo sem três passos`);for(const key of ['idea','example','mistake','prompt','model'])assert.ok(typeof l[key]==='string'&&l[key].length>30,`${c.id}: seção ${key} incompleta`);assert.ok(l.steps.every(s=>s.length>30),`${c.id}: passo incompleto`);}
}
console.log('Banco validado: 100 questões, 200 cartões, 30 integradoras, oito quotas e cobertura dos 37 assuntos.');
const matrix=questions.map(q=>({id:q.id,eixo:q.axis,competencias:q.skills,contexto:q.family,integrativa:q.integrative,dificuldade:q.difficulty,fontes:q.refs,cartoes:cards.filter(c=>c.questionId===q.id).map(c=>c.id)}));
await mkdir(new URL('../docs',import.meta.url),{recursive:true});
await writeFile(new URL('../docs/matriz-cobertura.json',import.meta.url),JSON.stringify(matrix,null,2)+'\n');
