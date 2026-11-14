export const AXES = [
 ['estatistica','Fundamentos e modelagem',12],['dados','Python e dados',12],['multivariada','Multivariada, redes e espaço',12],['supervisionada','Aprendizagem supervisionada',18],['temporal','Séries temporais',8],['ia','Deep Learning, NLP e LLMs',12],['infra','Infraestrutura e otimização',12],['gestao','Decisão, governança e gestão',14]
].map(([id,title,quota])=>({id,title,quota}));
export const BANK_VERSION='mba-2026-v1';
export const EXAM_DATE='2026-11-17';
export function betaCDF(x,a,b){
 if(x<=0)return 0;if(x>=1)return 1;
 // For integer a,b: beta CDF equals a binomial upper tail. n <= 102.
 const n=a+b-1;let term=(1-x)**n,sum=0;
 for(let j=0;j<=n;j++){if(j>=a)sum+=term;term*=((n-j)/(j+1))*(x/(1-x));}
 return Math.min(1,Math.max(0,sum));
}
export function quantile(p,a,b){let lo=0,hi=1;for(let i=0;i<55;i++){let mid=(lo+hi)/2;if(betaCDF(mid,a,b)<p)lo=mid;else hi=mid;}return(lo+hi)/2;}
export function diagnose(questions,answers){
 const answered=questions.filter(q=>answers[q.id]?.confidence&&Number.isInteger(answers[q.id]?.choice));
 const evidence={};
 for(const q of answered){const a=answers[q.id],ok=a.choice===q.correct;
  // A wrong composite answer only implicates the selected distractor's explicit cause.
  const skills=ok?q.skills:q.options[a.choice].errors;
  for(const skill of skills){const e=evidence[skill]??={skill,right:[],wrong:[],safeErrors:[]};
   const list=ok?e.right:e.wrong;if(!list.some(id=>questions.find(t=>t.id===id)?.family===q.family))list.push(q.id);
   if(!ok&&a.confidence==='seguro')e.safeErrors.push(q.id);
  }
 }
 const competencies=Object.values(evidence).map(e=>({...e,status:e.wrong.length>=2?'revisar':e.wrong.length===1&&e.right.length>=2?'deslize':e.wrong.length?'confirmar':e.right.length>=2?'consistente':'insuficiente'}));
 const axes=AXES.map(axis=>{const qs=answered.filter(q=>q.axis===axis.id),n=qs.length,s=qs.filter(q=>answers[q.id].choice===q.correct).length;
  const failures=new Set(qs.filter(q=>answers[q.id].choice!==q.correct).map(q=>q.family));
  const coverage=new Set(qs.filter(q=>answers[q.id].choice===q.correct).flatMap(q=>q.skills));
  const below=betaCDF(.7,1+s,1+n-s);
  const status=n===0?'insuficiente':below>=.8&&failures.size>=3?'alta':1-below>=.8&&n>=8&&coverage.size>=3?'baixa':'intermediaria';
  return{...axis,n,s,mean:(s+1)/(n+2),interval:[quantile(.05,1+s,1+n-s),quantile(.95,1+s,1+n-s)],below,status,items:qs.map(q=>q.id)};
 });
 return{score:answered.filter(q=>answers[q.id].choice===q.correct).length,total:answered.length,axes,competencies};
}
export function questionPriority(q,answers,report){
 const a=answers[q.id];if(!a)return 0;
 const axis=report.axes.find(axis=>axis.id===q.axis);
 const axisBoost=axis?.status==='alta'?(q.axis==='estatistica'?2000:1000):0;
 const relevant=report.competencies.filter(c=>q.skills.includes(c.skill));
 if(relevant.some(c=>c.status==='revisar'))return axisBoost+500+(a.choice!==q.correct&&a.confidence==='seguro'?50:0);
 if(a.choice!==q.correct&&a.confidence==='seguro')return axisBoost+400;
 if(relevant.some(c=>['deslize','confirmar'].includes(c.status)))return axisBoost+300;
 if(a.choice!==q.correct)return axisBoost+250;
 return a.confidence==='seguro'?0:axisBoost+100;
}
export function reviewTargets(questions,answers,report){
 return questions.flatMap(q=>{const a=answers[q.id];if(!Number.isInteger(a?.choice)||!a.confidence)return[];const ok=a.choice===q.correct;
 const axis=report.axes.find(axis=>axis.id===q.axis);
 // Correct answers outside a high-priority axis stay in the library, even if
 // every card was manually activated in an earlier version of the app.
 if(ok&&(a.confidence==='seguro'||axis?.status!=='alta'))return[];
 const isolated=report.competencies.some(c=>q.skills.includes(c.skill)&&c.status==='deslize');
 const ids=ok||isolated?[`${q.id}-aplicar`]:[`${q.id}-conceito`,`${q.id}-aplicar`];
 const reason=ok?'Acerto inseguro em eixo de prioridade alta':isolated?'Confirmar possível deslize':'Erro no diagnóstico';
 return ids.map(id=>({id,questionId:q.id,reason}));});
}
export function initialCards(questions,answers,report){return reviewTargets(questions,answers,report).map(t=>t.id);}
