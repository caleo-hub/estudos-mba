import { DefaultScheduler, Rating } from 'ts-fsrs';
const scheduler=await DefaultScheduler({version:'FSRS-7',desiredRetention:.9,enableFuzz:false});
export const RATINGS=[['Errei',Rating.Again],['Difícil',Rating.Hard],['Bom',Rating.Good],['Fácil',Rating.Easy]];
export function newCard(now=new Date()){return scheduler.newCard({now});}
export function reviewCard(card,grade,now=new Date()){return scheduler.review({card,grade,now});}
export function dueCards(cards,states,mode,priority,now=new Date(),seen=new Set()){
 return cards.filter(c=>states[c.id]&&!(mode==='prova'&&seen.has(c.id))&&(mode==='prova'||new Date(states[c.id].dueAt)<=now)).sort((a,b)=>mode==='prova'?(priority(b)-priority(a)||+new Date(states[a.id].dueAt)-+new Date(states[b.id].dueAt)):(+new Date(states[a.id].dueAt)-+new Date(states[b.id].dueAt)||priority(b)-priority(a)));
}
