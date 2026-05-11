document.addEventListener("DOMContentLoaded", () => {
	// Busca o formulário principal do editor.
	const formulario = document.getElementById("editor-form");
	// Se o formulário não existir nesta página, o script é encerrado.
	if (!formulario) {
		return;
	}

	// Reúne referências dos campos de entrada e dos elementos da pré-visualização.
	const elementos = {
		ocasiao: document.getElementById("ocasiao"),
		textoTitulo: document.getElementById("textoTitulo"),
		textoMensagem: document.getElementById("textoMensagem"),
		textoAssinatura: document.getElementById("textoAssinatura"),
		corFundo: document.getElementById("corFundo"),
		corDestaque: document.getElementById("corDestaque"),
		imagemArquivo: document.getElementById("imagemArquivo"),
		previaCartao: document.getElementById("previaCartao"),
		imagemCartao: document.getElementById("imagemCartao"),
		ocasiaoCartao: document.getElementById("ocasiaoCartao"),
		tituloCartao: document.getElementById("tituloCartao"),
		mensagemCartao: document.getElementById("mensagemCartao"),
		assinaturaCartao: document.getElementById("assinaturaCartao")
	};

	let urlImagemAtual = "";

	// Remove espaços extras e aplica um texto padrão quando o campo estiver vazio.
	const sanitizarTexto = (valor, textoPadrao) => valor.trim() || textoPadrao;

	// Atualiza o cartão de pré-visualização com os valores atuais do formulário.
	const atualizarCartao = () => {
		// Define medidas fixas do cartão simplificado.
		elementos.previaCartao.style.width = "360px";
		elementos.previaCartao.style.minHeight = "260px";
		// Aplica as cores escolhidas no formulário.
		elementos.previaCartao.style.backgroundColor = elementos.corFundo.value;
		elementos.previaCartao.style.borderColor = elementos.corDestaque.value;
		elementos.previaCartao.style.color = "#222222";

		// Atualiza os textos do cartão com fallback para evitar conteúdo vazio.
		elementos.ocasiaoCartao.textContent = sanitizarTexto(elementos.ocasiao.value, "Ocasião");
		elementos.tituloCartao.textContent = sanitizarTexto(elementos.textoTitulo.value, "Seu título");
		elementos.tituloCartao.style.color = elementos.corDestaque.value;
		elementos.mensagemCartao.textContent = sanitizarTexto(elementos.textoMensagem.value, "Sua mensagem aparecerá aqui.");
		elementos.assinaturaCartao.textContent = sanitizarTexto(elementos.textoAssinatura.value, "Assinatura");
	};

	const atualizarImagemCartao = () => {
		const arquivo = elementos.imagemArquivo.files?.[0];

		if (!arquivo?.type.startsWith("image/")) {
			elementos.imagemCartao.hidden = true;
			elementos.imagemCartao.removeAttribute("src");
			if (urlImagemAtual) {
				URL.revokeObjectURL(urlImagemAtual);
				urlImagemAtual = "";
			}
			return;
		}

		if (urlImagemAtual) URL.revokeObjectURL(urlImagemAtual);

		urlImagemAtual = URL.createObjectURL(arquivo);
		elementos.imagemCartao.src = urlImagemAtual;
		elementos.imagemCartao.hidden = false;
	};

	// Sempre que houver alteração no formulário, o cartão é renderizado novamente.
	formulario.addEventListener("input", atualizarCartao);
	elementos.imagemArquivo.addEventListener("change", atualizarImagemCartao);
	// Renderização inicial quando a página termina de carregar.
	atualizarCartao();
});
