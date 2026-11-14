# Estudos MBA

Diagnóstico pessoal e revisão para o MBA em Data Science e Analytics USP/Esalq. Site local em português: 100 questões, oito eixos e 200 cartões com FSRS. Não representa o banco ou o formato da prova oficial.

## Abrir no Windows

1. Tenha Node.js 24 ou superior instalado.
2. Dê dois cliques em **Iniciar MBA.cmd** na pasta do projeto.
3. Use sempre **http://127.0.0.1:4173** no mesmo navegador/perfil.

Alternativa pelo terminal:

```powershell
npm ci
npm run build
npm start
```

O servidor escuta somente na interface local. Se a porta 4173 já estiver ocupada por outro serviço, ele informa erro; não muda a origem silenciosamente. Para encerrar, finalize o processo Node correspondente ao servidor local.

## Estudar

- **Diagnóstico:** responda uma questão por vez e indique Chute, Com dúvida ou Seguro. Use A–D e 1–3 como atalhos. Marque dúvidas, navegue pelo mapa e pause quando quiser. Há salvamento automático em IndexedDB.
- **Meu resultado:** disponível depois das 100 respostas. Exibe nota, oito eixos, incerteza e as questões que sustentam cada conclusão. O gabarito explica também os distratores.
- **Revisão:** recupere a resposta antes de revelar, e avalie Errei, Difícil, Bom ou Fácil. Não há limite diário. Até a prova antecipa cartões e prioriza conceitos com erros repetidos e erros seguros. Revisão espaçada mostra somente os novos/vencidos. A nota do diagnóstico não muda com as revisões.
- **Biblioteca:** ative qualquer cartão ou todos os 200. Um possível deslize ativa inicialmente só o cartão de aplicação da questão errada.
- **Método e backup:** exporte JSON para preservar respostas, histórico e agendamento. Limpar dados do navegador, mudar perfil ou mudar origem não sincroniza progresso. Restauração substitui o estado atual após confirmação. TSV exporta cartões para Anki; não transfere o agendamento FSRS do site.

Uma nova tentativa arquiva a anterior no backup e preserva cartões e revisões. Como as questões são as mesmas, retestes após consultar o gabarito têm exposição prévia. As respostas ficam novamente ocultas até concluir a nova tentativa.

## Conteúdo e referências

- 70 questões focadas e 30 integradoras; 30 básicas, 50 intermediárias e 20 avançadas, segundo classificação editorial.
- Quotas: fundamentos 12; Python/dados 12; multivariada/redes/espaço 12; supervisionada 18; temporal 8; IA/NLP/LLMs 12; infraestrutura/otimização 12; gestão/decisão 14.
- Os 37 assuntos substantivos têm ao menos duas aparições como tema principal ou secundário. Abertura e boas-vindas ficam fora.
- Cada questão tem uma competência-alvo. Os temas secundários dão contexto e não duplicam a pontuação. Cada cartão de aplicação muda o cenário e usa resposta aberta.
- Referências identificam o PDF e o número da página no arquivo (que pode diferir da numeração impressa no slide). Exemplos e explicações são originais; o material de aula fundamenta os conceitos.
- `docs/matriz-cobertura.json` liga questões, competências, eixos, fontes e cartões. `src/content.js` contém o banco editorial; `src/sources.json` contém somente os metadados das fontes.

Para abrir as referências locais, mantenha a pasta **Slides** e **inventario-slides.json** na raiz, conforme o acervo já baixado. Esses arquivos, as extrações e os backups pessoais não são enviados ao Git. Sem o acervo, o site funciona e informa indisponibilidade ao abrir um PDF.

## Método do diagnóstico

Nota bruta: um ponto por acerto. Confiança não altera a nota. Em cada eixo, o modelo simplificado é Beta(1+acertos, 1+erros), com intervalo central de 90% e referência pedagógica de 70%.

- **Alta prioridade:** P(p<0,70) ≥ 0,80 e pelo menos três erros em contextos independentes.
- **Baixa prioridade:** P(p≥0,70) ≥ 0,80, ao menos oito respostas e acertos em pelo menos três competências.
- **Demais situações:** evidência intermediária/insuficiente, sem afirmar domínio ou deficiência.
- **Competências:** dois erros em contextos diferentes sugerem revisão direcionada; um erro acompanhado de dois acertos sugere possível deslize. Não se estimam correlações entre matérias a partir de uma pessoa. O distrator escolhido identifica a competência que o item testa, sem penalizar todos os temas citados.

Os parâmetros pedagógicos são decisões editoriais. Não há banco calibrado, TRI, correção por adivinhação ou validação psicométrica. Dependência entre respostas e diferenças de dificuldade limitam o modelo binomial; os intervalos descrevem a hipótese simplificada de desempenho neste banco.

## Agendamento

`ts-fsrs` 6.0.0, FSRS-7, retenção desejada 0,90 e parâmetros padrão, sem fuzz. O estado do cartão e o log retornados são persistidos juntos. Até a prova registra antecipações reais; consultar a resposta sem avaliar não altera o agendamento. As datas são mostradas em America/Sao_Paulo. O modo intensivo não é desativado automaticamente depois de 17/11/2026.

Referência da biblioteca: https://github.com/open-spaced-repetition/ts-fsrs

## Verificação e manutenção

```powershell
npm run validate
npm test
npm run build
```

A validação confere quantidade, distribuição, cobertura, unicidade, explicações e existência das páginas. Testes verificam inferência, casos contraditórios, filas FSRS, restauração e arquivos inválidos. O fluxo de interface é conferido no navegador com dados fictícios e limpo antes da entrega.

O site não chama serviços de IA ou analytics. Para atualizar questões após uso real, incremente a versão do banco e implemente migração explícita; backups de outra versão são rejeitados, evitando aplicar respostas antigas a alternativas modificadas.
