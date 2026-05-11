// ============================================================
// Web Component: <site-header>
// Reutiliza o cabeçalho em todas as páginas.
// Suporta o atributo "subtitulo" para personalizar o texto.
// ============================================================
class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const subtitulo = this.getAttribute('subtitulo') || 'Portfólio de trabalhos desenvolvidos ao longo do semestre';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .cabecalho-site {
          background: #2f5d91;
          color: #ffffff;
          border-bottom: 2px solid #1f3f63;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }
        .titulo-site {
          margin: 0;
          font-size: 2rem;
          font-family: Arial, Helvetica, sans-serif;
        }
        .subtitulo-site {
          margin: 0.5rem 0 0;
          font-size: 1rem;
          font-family: Arial, Helvetica, sans-serif;
        }
      </style>
      <header class="cabecalho-site">
        <div class="container">
          <h1 class="titulo-site">Disciplina de Interface Web</h1>
          <p class="subtitulo-site">${subtitulo}</p>
        </div>
      </header>
    `;
  }
}
customElements.define('site-header', SiteHeader);


// ============================================================
// Web Component: <site-nav>
// Reutiliza a navegação em todas as páginas.
// Suporta o atributo "ativo" para destacar a página atual.
// Valores válidos: "inicio", "trabalho1", "trabalho2", "trabalho3"
// ============================================================
class SiteNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const ativo = this.getAttribute('ativo') || '';

    const links = [
      { id: 'inicio',    href: 'index.html',     label: 'Apresentação' },
      { id: 'trabalho1', href: 'trabalho1.html',  label: 'Trabalho 1'   },
      { id: 'trabalho2', href: 'trabalho2.html',  label: 'Trabalho 2'   },
      { id: 'trabalho3', href: 'trabalho3.html',  label: 'Trabalho 3'   },
    ];

    const itens = links.map(l => {
      const classe = l.id === ativo ? ' class="ativo"' : '';
      return `<li><a${classe} href="${l.href}">${l.label}</a></li>`;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        nav { background-color: #274a73; }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        ul {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          margin: 0;
          padding: 0.5rem 0;
          gap: 0.5rem;
        }
        a {
          display: inline-block;
          padding: 0.45rem 0.75rem;
          text-decoration: none;
          color: #ffffff;
          border: 1px solid transparent;
          font-weight: 700;
          font-family: Arial, Helvetica, sans-serif;
        }
        a:hover, a:focus-visible {
          background-color: #1f3f63;
          border-color: #d7e6f5;
          outline: none;
        }
        a.ativo {
          background-color: #d75f22;
          border-color: #ffffff;
        }
      </style>
      <nav aria-label="Menu principal">
        <div class="container">
          <ul>${itens}</ul>
        </div>
      </nav>
    `;
  }
}
customElements.define('site-nav', SiteNav);


// ============================================================
// Web Component: <site-footer>
// Reutiliza o rodapé em todas as páginas.
// Usa <slot> para que o conteúdo seja definido em cada página.
// ============================================================
class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        footer {
          background-color: #2f5d91;
          color: #ffffff;
          text-align: center;
          font-family: Arial, Helvetica, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
        p { margin: 0; }
      </style>
      <footer>
        <div class="container">
          <p><slot>Interface Web - 3º semestre</slot></p>
        </div>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);
