// ============================================================
// Web Component: <minha-prova>
// Prova online de múltipla escolha encapsulada em Shadow DOM.
// Para adicionar questões: insira um novo objeto no array
// "questoes" abaixo. A prova exibirá e corrigirá automaticamente.
// ============================================================

class MinhaProva extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // --------------------------------------------------------
    // DADOS DA PROVA
    // Cada objeto tem: enunciado, alternativas[] e correta (índice 0-based).
    // Para adicionar uma nova questão, basta inserir mais um objeto aqui.
    // --------------------------------------------------------
    this._questoes = [
      {
        enunciado: 'O que significa a sigla HTML?',
        alternativas: [
          'HyperText Markup Language',
          'HighText Machine Language',
          'HyperText and links Markup Language'
        ],
        correta: 0
      },
      {
        enunciado: 'Qual propriedade CSS é usada para alterar a cor do texto?',
        alternativas: [
          'background-color',
          'text-color',
          'color'
        ],
        correta: 2
      },
      {
        enunciado: 'O que é o Shadow DOM?',
        alternativas: [
          'Uma API que permite encapsular HTML, CSS e JS em um componente isolado',
          'Um banco de dados para guardar elementos HTML',
          'Um método JavaScript para manipular arrays'
        ],
        correta: 0
      },
      {
        enunciado: 'Qual método JavaScript seleciona um elemento pelo seu id?',
        alternativas: [
          'document.querySelector()',
          'document.getElementById()',
          'document.getElement()'
        ],
        correta: 1
      },
      {
        enunciado: 'O que faz a propriedade CSS "display: flex"?',
        alternativas: [
          'Torna o elemento invisível',
          'Ativa o modelo de caixa flexível para o elemento',
          'Adiciona uma borda ao redor do elemento'
        ],
        correta: 1
      }
    ];

    this._renderizarProva();
  }

  // Monta toda a estrutura HTML + CSS da prova dentro do Shadow DOM
  _renderizarProva() {
    const questoesHTML = this._questoes.map((q, qi) => `
      <fieldset class="questao" id="questao-${qi}">
        <legend class="enunciado">${qi + 1}. ${q.enunciado}</legend>
        <div class="alternativas">
          ${q.alternativas.map((alt, ai) => `
            <label class="alternativa" id="label-${qi}-${ai}">
              <input
                type="radio"
                name="questao-${qi}"
                value="${ai}"
                id="q${qi}a${ai}"
                required
              >
              <span class="texto-alternativa">${alt}</span>
            </label>
          `).join('')}
        </div>
        <p class="feedback" id="feedback-${qi}" aria-live="polite"></p>
      </fieldset>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>
        *, *::before, *::after { box-sizing: border-box; }

        :host {
          display: block;
          font-family: Arial, Helvetica, sans-serif;
          color: #222;
        }

        .prova-container {
          background: #fff;
          border: 2px solid #c7c7c7;
          border-radius: 6px;
          padding: 1.5rem;
          max-width: 780px;
          margin: 0 auto;
        }

        .prova-titulo {
          font-size: 1.4rem;
          margin: 0 0 0.3rem;
          color: #2f5d91;
        }

        .prova-descricao {
          font-size: 0.9rem;
          color: #555;
          margin: 0 0 1.5rem;
        }

        /* Cada questão */
        .questao {
          border: 1px dashed #8b8b8b;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1.2rem;
        }

        .enunciado {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.6rem;
          line-height: 1.4;
        }

        .alternativas {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        /* Cada alternativa é um label clicável */
        .alternativa {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.8rem;
          border: 2px solid #d0d0d0;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .alternativa:hover {
          background: #eef4ff;
          border-color: #2f5d91;
        }

        /* Quando o radio está marcado */
        .alternativa:has(input:checked) {
          background: #ddeaff;
          border-color: #2f5d91;
        }

        input[type="radio"] {
          accent-color: #2f5d91;
          width: 1.1rem;
          height: 1.1rem;
          flex-shrink: 0;
        }

        .texto-alternativa { font-size: 0.95rem; line-height: 1.4; }

        /* Feedback por questão após correção */
        .feedback {
          margin: 0.6rem 0 0;
          font-size: 0.9rem;
          font-weight: 700;
          min-height: 1.2rem;
        }

        /* Estados de feedback */
        .alternativa.correta-selecionada {
          background: #d4edda;
          border-color: #28a745;
        }
        .alternativa.errada-selecionada {
          background: #f8d7da;
          border-color: #dc3545;
        }
        .alternativa.correta-indicar {
          background: #d4edda;
          border-color: #28a745;
        }
        .feedback.acerto { color: #1a6b32; }
        .feedback.erro   { color: #8b0000; }

        /* Área de botões */
        .botoes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        button {
          padding: 0.6rem 1.4rem;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-corrigir {
          background: #2b8f54;
          color: #fff;
          border: 1px solid #1d663c;
        }
        .btn-corrigir:hover { background: #237445; }

        .btn-reiniciar {
          background: #d75f22;
          color: #fff;
          border: 1px solid #a84516;
        }
        .btn-reiniciar:hover  { background: #b84f1a; }
        .btn-reiniciar:hidden { display: none; }

        /* Resultado global */
        .resultado {
          background: #eef4ff;
          border: 2px solid #2f5d91;
          border-radius: 4px;
          padding: 1rem;
          margin-top: 1.2rem;
          font-size: 1rem;
          display: none;
        }
        .resultado.visivel { display: block; }
        .resultado strong  { color: #2f5d91; font-size: 1.2rem; }

        /* Mensagem de alerta (nem todas respondidas) */
        .aviso {
          color: #8b0000;
          font-size: 0.9rem;
          font-weight: 700;
          min-height: 1.2rem;
          margin-top: 0.5rem;
        }

        /* Responsivo */
        @media (max-width: 600px) {
          .prova-container { padding: 1rem; }
          .prova-titulo    { font-size: 1.1rem; }
          button           { width: 100%; }
        }
      </style>

      <div class="prova-container" role="form" aria-label="Prova online">
        <h2 class="prova-titulo">📝 Prova Online — Interface Web</h2>
        <p class="prova-descricao">Responda todas as questões e clique em <strong>Corrigir</strong>.</p>

        <div class="questoes">${questoesHTML}</div>

        <div class="botoes">
          <button class="btn-corrigir" id="btn-corrigir" type="button">Corrigir</button>
          <button class="btn-reiniciar" id="btn-reiniciar" type="button" hidden>Responder novamente</button>
        </div>
        <p class="aviso" id="aviso" aria-live="assertive"></p>
        <div class="resultado" id="resultado" role="status"></div>
      </div>
    `;

    // Eventos
    this.shadowRoot.getElementById('btn-corrigir').addEventListener('click', () => this._corrigir());
    this.shadowRoot.getElementById('btn-reiniciar').addEventListener('click', () => this._reiniciar());
  }

  // Corrige as respostas e mostra o resultado
  _corrigir() {
    const total = this._questoes.length;
    let acertos = 0;
    let todasRespondidas = true;
    const aviso = this.shadowRoot.getElementById('aviso');
    aviso.textContent = '';

    // Verifica se todas foram respondidas
    for (let qi = 0; qi < total; qi++) {
      const selecionado = this.shadowRoot.querySelector(`input[name="questao-${qi}"]:checked`);
      if (!selecionado) {
        todasRespondidas = false;
        // Destaca a questão não respondida
        this.shadowRoot.getElementById(`questao-${qi}`).style.borderColor = '#dc3545';
      } else {
        this.shadowRoot.getElementById(`questao-${qi}`).style.borderColor = '';
      }
    }

    if (!todasRespondidas) {
      aviso.textContent = '⚠️ Responda todas as questões antes de corrigir.';
      return;
    }

    // Aplica feedback questão a questão
    for (let qi = 0; qi < total; qi++) {
      const q = this._questoes[qi];
      const selecionado = this.shadowRoot.querySelector(`input[name="questao-${qi}"]:checked`);
      const respostaIndex = parseInt(selecionado.value, 10);
      const feedback = this.shadowRoot.getElementById(`feedback-${qi}`);

      // Bloqueia os inputs
      const inputs = this.shadowRoot.querySelectorAll(`input[name="questao-${qi}"]`);
      inputs.forEach(i => { i.disabled = true; });

      // Pinta as alternativas
      q.alternativas.forEach((_, ai) => {
        const label = this.shadowRoot.getElementById(`label-${qi}-${ai}`);
        label.classList.remove('correta-selecionada', 'errada-selecionada', 'correta-indicar');
        if (ai === q.correta && ai === respostaIndex) {
          label.classList.add('correta-selecionada'); // acertou
        } else if (ai === respostaIndex && ai !== q.correta) {
          label.classList.add('errada-selecionada');  // errou
        } else if (ai === q.correta) {
          label.classList.add('correta-indicar');     // indica a correta
        }
      });

      // Texto de feedback
      if (respostaIndex === q.correta) {
        acertos++;
        feedback.textContent = '✅ Correto!';
        feedback.className = 'feedback acerto';
      } else {
        const nomeCorreta = q.alternativas[q.correta];
        feedback.textContent = `❌ Errado. Resposta correta: "${nomeCorreta}"`;
        feedback.className = 'feedback erro';
      }
    }

    // Resultado global
    const nota = ((acertos / total) * 10).toFixed(1);
    const resultado = this.shadowRoot.getElementById('resultado');
    resultado.innerHTML = `
      <strong>Resultado: ${acertos}/${total} — Nota: ${nota}</strong><br>
      ${acertos === total
        ? '🏆 Parabéns, você acertou tudo!'
        : acertos === 0
          ? '😕 Nenhum acerto. Tente novamente!'
          : `Você acertou ${acertos} de ${total} questões. Continue estudando!`
      }
    `;
    resultado.classList.add('visivel');

    // Mostra botão de reiniciar e esconde corrigir
    this.shadowRoot.getElementById('btn-corrigir').hidden = true;
    this.shadowRoot.getElementById('btn-reiniciar').hidden = false;
  }

  // Reseta a prova completamente
  _reiniciar() {
    this._renderizarProva();
  }
}

customElements.define('minha-prova', MinhaProva);
