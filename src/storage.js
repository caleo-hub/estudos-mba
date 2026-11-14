import {BANK_VERSION} from './diagnosis.js';
export function freshState(){return{schema:1,bank:BANK_VERSION,answers:{},finished:false,index:0,cards:{},reviews:[],attempts:[]};}
let db;
async function database(){if(db)return db;db=await new Promise((resolve,reject)=>{const r=indexedDB.open('estudos-mba',1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return db;}
export async function load(){const d=await database();return new Promise((resolve,reject)=>{const r=d.transaction('state').objectStore('state').get('current');r.onsuccess=()=>resolve(r.result??freshState());r.onerror=()=>reject(r.error);});}
export async function save(state){const d=await database();return new Promise((resolve,reject)=>{const t=d.transaction('state','readwrite');t.objectStore('state').put(state,'current');t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
export function exportBackup(state){return JSON.stringify({app:'estudos-mba',exportedAt:new Date().toISOString(),state},null,2);}
export function parseBackup(text,questions,cardIds){
 const data=JSON.parse(text),s=data.state;
 if(data.app!=='estudos-mba'||!s||s.schema!==1||s.bank!==BANK_VERSION)throw Error('Backup de outro aplicativo ou versão incompatível.');
 if(typeof s.finished!=='boolean'||!Number.isInteger(s.index)||s.index<0||s.index>=100||!s.answers||!s.cards||!Array.isArray(s.reviews)||!Array.isArray(s.attempts))throw Error('Estrutura de backup inválida.');
 const known=new Set(questions.map(q=>q.id));
 for(const[id,a]of Object.entries(s.answers))if(!known.has(id)||!a||(a.choice!==null&&(!Number.isInteger(a.choice)||a.choice<0||a.choice>3))||![null,'chute','duvida','seguro'].includes(a.confidence)||typeof a.flag!=='boolean')throw Error('Resposta inválida no backup.');
 if(s.finished&&questions.some(q=>!Number.isInteger(s.answers[q.id]?.choice)||!s.answers[q.id]?.confidence))throw Error('Diagnóstico finalizado incompleto.');
 const allowed=new Set(cardIds);
 for(const[id,c]of Object.entries(s.cards))if(!allowed.has(id)||!c||!c.dueAt||!Number.isFinite(+new Date(c.dueAt))||!Number.isFinite(c.reps)||c.reps<0||!Number.isFinite(c.stability)||c.stability<0||!Number.isFinite(c.stabilityFast)||c.stabilityFast<0||!Number.isFinite(c.difficulty)||c.difficulty<0||c.difficulty>10||![0,1,2,3].includes(c.state)||!['new','learning','review','relearning'].includes(c.scheduleStatus))throw Error('Agendamento inválido no backup.');
 for(const r of s.reviews)if(!r||!allowed.has(r.cardId)||!Number.isFinite(+new Date(r.at))||![1,2,3,4].includes(r.grade))throw Error('Histórico inválido no backup.');
 return revive(s);
}
export function revive(value){if(Array.isArray(value))return value.map(revive);if(value&&typeof value==='object'){for(const key of Object.keys(value)){if(['dueAt','lastReviewAt','reviewedAt','createdAt'].includes(key)&&typeof value[key]==='string'&&Number.isFinite(Date.parse(value[key])))value[key]=new Date(value[key]);else value[key]=revive(value[key]);}}return value;}
