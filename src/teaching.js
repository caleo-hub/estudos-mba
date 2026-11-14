const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function lessonMarkup(card,{interactive=true}={}){
 const l=card.lesson;
 if(!l)throw Error('Explicação ausente: '+card.id);
 const comparison=`<p>${escape(l.model)}</p><p class="hint">Compare o raciocínio, não as palavras. Se você só conseguiu repetir um termo técnico, volte à ideia e tente explicar o termo também.</p>`;
 return `<div class="feynman-lesson"><section class="lesson-idea"><h3>1. A ideia, sem complicar</h3><p>${escape(l.idea)}</p></section><section><h3>2. Veja num exemplo</h3><p class="worked-example">${escape(l.example)}</p><ol class="worked-steps">${l.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol></section><section class="lesson-trap"><h3>3. Onde a gente se confunde</h3><p>${escape(l.mistake)}</p></section><section class="teach-back"><h3>4. Agora explique com suas palavras</h3><p>${escape(l.prompt)}</p>${interactive?`<label>Como você explicaria para alguém que nunca estudou isso?<textarea rows="3" placeholder="Tente explicar sem olhar a teoria. Pode escrever ou falar em voz alta." aria-label="Minha explicação com palavras simples"></textarea></label><p class="hint">Este rascunho é opcional e não é salvo. Não há correção automática por IA.</p><details><summary>Já tentei. Comparar com uma explicação simples</summary>${comparison}</details>`:comparison}</section></div>`;
}
export function cardAnswerMarkup(card){
 return `<p><strong>Resposta:</strong> ${escape(card.back)}</p>${lessonMarkup(card,{interactive:false})}<p><strong>Outro contexto:</strong> ${escape(card.example)}</p>`;
}
