
// ==========================================
// ARQCOMP - TRÊS MINIGAMES
// ==========================================


// ==========================================
// MENU DE NAVEGAÇÃO
// ==========================================

const abas = document.querySelectorAll(".aba-jogo");
const telas = document.querySelectorAll(".tela-jogo");

abas.forEach(aba => {
    aba.addEventListener("click", () => {

        const jogo = aba.dataset.jogo;

        telas.forEach(tela => {
            tela.hidden = tela.id !== "jogo-" + jogo;
        });

        abas.forEach(botao => {
            botao.classList.toggle(
                "ativa",
                botao === aba
            );

            botao.setAttribute(
                "aria-pressed",
                botao === aba ? "true" : "false"
            );
        });

    });
});


// ==========================================
// JOGO 1 - CRUZADINHA
// ==========================================

// H = horizontal
// V = vertical
// As posições começam na linha e coluna zero.

const palavras = [
    {
        resposta: "MICROCONTROLADOR",
        linha: 9,
        coluna: 1,
        direcao: "H",
        pista: "Chip que reúne processamento, memória e interfaces para controlar dispositivos."
    },
    {
        resposta: "REGISTRADORES",
        linha: 0,
        coluna: 7,
        direcao: "V",
        pista: "Áreas muito rápidas dentro do processador que guardam valores temporários."
    },
    {
        resposta: "MEMORIADEMASSA",
        linha: 7,
        coluna: 1,
        direcao: "H",
        pista: "Categoria de armazenamento persistente usada para guardar arquivos e programas."
    },
    {
        resposta: "ADDRESSBUS",
        linha: 12,
        coluna: 2,
        direcao: "H",
        pista: "Conjunto de linhas que indica a posição de memória a ser acessada."
    },
    {
        resposta: "DATABUS",
        linha: 12,
        coluna: 3,
        direcao: "V",
        pista: "Conjunto de linhas que transporta informações entre componentes do computador."
    },
    {
        resposta: "DUALCORE",
        linha: 1,
        coluna: 0,
        direcao: "H",
        pista: "Processador que possui dois núcleos físicos de execução."
    },
    {
        resposta: "QUADCORE",
        linha: 15,
        coluna: 1,
        direcao: "H",
        pista: "Processador que possui quatro núcleos físicos de execução."
    },
    {
        resposta: "EEPROM",
        linha: 6,
        coluna: 16,
        direcao: "V",
        pista: "Tipo não volátil regravável eletricamente, usado para guardar pequenas configurações."
    },
    {
        resposta: "FLASH",
        linha: 4,
        coluna: 4,
        direcao: "H",
        pista: "Tecnologia não volátil utilizada para armazenar o programa do Arduino."
    },
    {
        resposta: "CACHE",
        linha: 15,
        coluna: 5,
        direcao: "V",
        pista: "Armazenamento rápido que reduz o tempo de acesso a informações frequentes."
    },
    {
        resposta: "CPU",
        linha: 17,
        coluna: 1,
        direcao: "H",
        pista: "Componente central que busca, interpreta e executa instruções."
    },
    {
        resposta: "ULA",
        linha: 12,
        coluna: 10,
        direcao: "V",
        pista: "Parte do processador responsável por cálculos e operações lógicas."
    },
    {
        resposta: "UC",
        linha: 1,
        coluna: 1,
        direcao: "V",
        pista: "Parte do processador que coordena a execução das instruções."
    },
    {
        resposta: "RAM",
        linha: 5,
        coluna: 3,
        direcao: "V",
        pista: "Memória volátil usada por programas que estão em execução."
    },
    {
        resposta: "ROM",
        linha: 11,
        coluna: 14,
        direcao: "H",
        pista: "Tipo de memória tradicionalmente associado a dados somente para leitura."
    },
    {
        resposta: "DMA",
        linha: 5,
        coluna: 14,
        direcao: "V",
        pista: "Mecanismo que transfere dados entre periféricos e memória com pouca intervenção do processador."
    }
];

const TOTAL_LINHAS = 20;
const TOTAL_COLUNAS = 17;

const tabuleiro = document.getElementById("tabuleiro");
const horizontais = document.getElementById("pistas-horizontais");
const verticais = document.getElementById("pistas-verticais");
const contador = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");

const casas = {};

let palavraAtiva = null;


// ==========================================
// IDENTIFICAR UMA CASA
// ==========================================

function chave(linha, coluna) {
    return linha + "-" + coluna;
}


// ==========================================
// CALCULAR POSIÇÕES DE UMA PALAVRA
// ==========================================

function posicoes(palavra) {

    const lista = [];

    for (let i = 0; i < palavra.resposta.length; i++) {

        lista.push({
            linha: palavra.linha +
                (palavra.direcao === "V" ? i : 0),

            coluna: palavra.coluna +
                (palavra.direcao === "H" ? i : 0)
        });

    }

    return lista;
}


// ==========================================
// MONTAR O TABULEIRO
// ==========================================

function montarJogo() {

    const ordenadas = [...palavras].sort(
        (a, b) => a.linha - b.linha ||
                  a.coluna - b.coluna
    );

    const numeros = {};

    let proximoNumero = 1;

    ordenadas.forEach(palavra => {

        const inicio = chave(
            palavra.linha,
            palavra.coluna
        );

        if (!numeros[inicio]) {
            numeros[inicio] = proximoNumero++;
        }

        palavra.numero = numeros[inicio];

        palavra.posicoes = posicoes(palavra);

    });

    const ocupadas = {};

    palavras.forEach(palavra => {

        palavra.posicoes.forEach((pos, indice) => {

            const id = chave(pos.linha, pos.coluna);

            if (!ocupadas[id]) {

                ocupadas[id] = {
                    letra: palavra.resposta[indice],
                    palavras: []
                };

            }

            if (
                ocupadas[id].letra !==
                palavra.resposta[indice]
            ) {

                throw new Error(
                    "Cruzamento incompatível na casa " + id
                );

            }

            ocupadas[id].palavras.push(palavra);

        });

    });

    for (let linha = 0; linha < TOTAL_LINHAS; linha++) {

        for (let coluna = 0; coluna < TOTAL_COLUNAS; coluna++) {

            const id = chave(linha, coluna);

            const casa = document.createElement("div");

            casa.className = "casa";

            if (!ocupadas[id]) {

                casa.classList.add("vazia");

            } else {

                if (numeros[id]) {

                    const numero = document.createElement("span");

                    numero.className = "numero";

                    numero.textContent = numeros[id];

                    casa.appendChild(numero);

                }

                const input = document.createElement("input");

                input.type = "text";
                input.maxLength = 1;
                input.autocomplete = "off";

                input.setAttribute(
                    "aria-label",
                    "Linha " + (linha + 1) +
                    ", coluna " + (coluna + 1)
                );

                input.addEventListener("focus", () => {
                    selecionarCasa(id, false);
                });

                input.addEventListener("click", () => {
                    selecionarCasa(id, true);
                });

                input.addEventListener("input", () => {
                    digitar(id);
                });

                input.addEventListener("keydown", evento => {
                    controlarTeclas(evento, id);
                });

                casa.appendChild(input);

                casas[id] = {
                    elemento: casa,
                    input: input,
                    palavras: ocupadas[id].palavras
                };

            }

            tabuleiro.appendChild(casa);

        }

    }

    palavras.forEach(palavra => {

        const item = document.createElement("li");

        item.textContent =
            palavra.numero + ". " +
            palavra.pista + " (" +
            palavra.resposta.length + " letras)";

        item.addEventListener("click", () => {
            selecionarPalavra(palavra);
        });

        palavra.item = item;

        if (palavra.direcao === "H") {
            horizontais.appendChild(item);
        } else {
            verticais.appendChild(item);
        }

    });

    selecionarPalavra(ordenadas[0], false);

}


// ==========================================
// SELECIONAR UMA PALAVRA
// ==========================================

function selecionarPalavra(palavra, focar = true) {

    palavraAtiva = palavra;

    Object.values(casas).forEach(casa => {
        casa.elemento.classList.remove("selecionada");
    });

    palavras.forEach(p => {
        p.item.classList.remove("ativa");
    });

    palavra.posicoes.forEach(pos => {

        const id = chave(pos.linha, pos.coluna);

        casas[id].elemento.classList.add("selecionada");

    });

    palavra.item.classList.add("ativa");

    if (focar) {

        const id = chave(palavra.linha, palavra.coluna);

        casas[id].input.focus();

    }

}


// ==========================================
// SELECIONAR UMA CASA
// ==========================================

function selecionarCasa(id, alternar) {

    const candidatas = casas[id].palavras;

    if (!candidatas.includes(palavraAtiva)) {

        selecionarPalavra(candidatas[0], false);

    } else if (alternar && candidatas.length > 1) {

        const outra = candidatas.find(
            p => p !== palavraAtiva
        );

        selecionarPalavra(outra, false);

    }

}


// ==========================================
// MOVER O CURSOR
// ==========================================

function focarIndice(indice) {

    if (!palavraAtiva) return;

    if (
        indice < 0 ||
        indice >= palavraAtiva.posicoes.length
    ) {
        return;
    }

    const pos = palavraAtiva.posicoes[indice];

    casas[chave(pos.linha, pos.coluna)].input.focus();

}


// ==========================================
// DIGITAR UMA LETRA
// ==========================================

function digitar(id) {

    const casa = casas[id];

    casa.input.value = casa.input.value
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 1);

    limparMarcacoes();

    if (!palavraAtiva) return;

    const indice = palavraAtiva.posicoes.findIndex(
        pos => chave(pos.linha, pos.coluna) === id
    );

    if (casa.input.value && indice !== -1) {
        focarIndice(indice + 1);
    }

}


// ==========================================
// CONTROLAR O TECLADO
// ==========================================

function controlarTeclas(evento, id) {

    if (!palavraAtiva) return;

    const indice = palavraAtiva.posicoes.findIndex(
        pos => chave(pos.linha, pos.coluna) === id
    );

    if (
        evento.key === "Backspace" &&
        !casas[id].input.value
    ) {

        evento.preventDefault();
        focarIndice(indice - 1);

    }

    if (
        evento.key === "ArrowRight" ||
        evento.key === "ArrowDown"
    ) {

        evento.preventDefault();
        focarIndice(indice + 1);

    }

    if (
        evento.key === "ArrowLeft" ||
        evento.key === "ArrowUp"
    ) {

        evento.preventDefault();
        focarIndice(indice - 1);

    }

}


// ==========================================
// LIMPAR MARCAÇÕES
// ==========================================

function limparMarcacoes() {

    Object.values(casas).forEach(casa => {

        casa.elemento.classList.remove(
            "correta",
            "incorreta"
        );

    });

    palavras.forEach(p => {

        p.item.classList.remove(
            "acertou",
            "errou"
        );

    });

    contador.textContent =
        "0 de " + palavras.length + " palavras corretas";

    mensagem.textContent =
        "Você alterou o tabuleiro. Clique em Conferir.";

}


// ==========================================
// CONFERIR A CRUZADINHA
// ==========================================

function conferir() {

    let acertos = 0;

    const certas = new Set();
    const erradas = new Set();

    palavras.forEach(palavra => {

        const digitada = palavra.posicoes.map(pos => {

            return casas[
                chave(pos.linha, pos.coluna)
            ].input.value;

        }).join("");

        const acertou = digitada === palavra.resposta;

        if (acertou) {
            acertos++;
        }

        palavra.item.classList.toggle(
            "acertou",
            acertou
        );

        palavra.item.classList.toggle(
            "errou",
            !acertou
        );

        palavra.posicoes.forEach(pos => {

            const id = chave(pos.linha, pos.coluna);

            if (acertou) {
                certas.add(id);
            } else {
                erradas.add(id);
            }

        });

    });

    Object.entries(casas).forEach(([id, casa]) => {

        casa.elemento.classList.toggle(
            "correta",
            certas.has(id)
        );

        casa.elemento.classList.toggle(
            "incorreta",
            erradas.has(id) && !certas.has(id)
        );

    });

    contador.textContent =
        acertos + " de " +
        palavras.length + " palavras corretas";

    if (acertos === palavras.length) {

        mensagem.textContent =
            "Parabéns! Você completou a cruzadinha!";

    } else {

        mensagem.textContent =
            "Verde: correta. Vermelho: incorreta ou incompleta.";

    }

}


// ==========================================
// REINICIAR A CRUZADINHA
// ==========================================

function reiniciar() {

    Object.values(casas).forEach(casa => {
        casa.input.value = "";
    });

    limparMarcacoes();

    mensagem.textContent =
        "Tabuleiro reiniciado. Boa revisão!";

    selecionarPalavra(palavras[0]);

}

document.getElementById("botao-conferir")
    .addEventListener("click", conferir);

document.getElementById("botao-reiniciar")
    .addEventListener("click", reiniciar);

montarJogo();


// ==========================================
// JOGO 2 - LABORATÓRIO LÓGICO
// ==========================================

// Cada fase possui uma operação lógica.
// O jogador altera os valores de A, B e C.

const fases = [
    {
        nome: "Porta AND",
        descricao: "A saída é 1 somente se A e B forem 1.",
        entradas: 2,
        alvo: 1,
        explicacao: "AND: as duas entradas precisam ser 1.",
        calcular: (a, b) => a & b
    },
    {
        nome: "Porta OR",
        descricao: "A saída é 1 se pelo menos uma entrada for 1.",
        entradas: 2,
        alvo: 1,
        explicacao: "OR: basta uma das entradas ser 1.",
        calcular: (a, b) => a | b
    },
    {
        nome: "Porta NOT",
        descricao: "Esta porta inverte o valor de A.",
        entradas: 1,
        alvo: 1,
        explicacao: "NOT: transforma 0 em 1 e 1 em 0.",
        calcular: a => 1 - a
    },
    {
        nome: "Porta NAND",
        descricao: "É o resultado da AND invertido.",
        entradas: 2,
        alvo: 0,
        explicacao: "NAND: só retorna 0 quando A e B são 1.",
        calcular: (a, b) => 1 - (a & b)
    },
    {
        nome: "Porta NOR",
        descricao: "É o resultado da OR invertido.",
        entradas: 2,
        alvo: 1,
        explicacao: "NOR: só retorna 1 quando A e B são 0.",
        calcular: (a, b) => 1 - (a | b)
    },
    {
        nome: "Porta XOR",
        descricao: "A saída é 1 quando as entradas são diferentes.",
        entradas: 2,
        alvo: 1,
        explicacao: "XOR: retorna 1 para 01 ou 10.",
        calcular: (a, b) => a ^ b
    },
    {
        nome: "AND + OR",
        descricao: "Primeiro A AND B; depois o resultado OR C.",
        entradas: 3,
        alvo: 1,
        explicacao: "Expressão: (A AND B) OR C.",
        calcular: (a, b, c) => (a & b) | c
    },
    {
        nome: "OR + NOT",
        descricao: "Primeiro A OR B; depois inverta o resultado.",
        entradas: 2,
        alvo: 1,
        explicacao: "Expressão: NOT (A OR B).",
        calcular: (a, b) => 1 - (a | b)
    },
    {
        nome: "XOR + AND",
        descricao: "Primeiro A XOR B; depois o resultado AND C.",
        entradas: 3,
        alvo: 1,
        explicacao: "Expressão: (A XOR B) AND C.",
        calcular: (a, b, c) => (a ^ b) & c
    }
];

let faseAtual = 0;
let pontosLab = 0;
let entradasLab = [0, 0, 0];
let faseConcluida = false;

const labFase = document.getElementById("lab-fase");
const labPontos = document.getElementById("lab-pontos");
const labDescricao = document.getElementById("lab-descricao");
const labAlvo = document.getElementById("lab-alvo");
const labPorta = document.getElementById("lab-porta");
const labSaida = document.getElementById("lab-saida");
const labLed = document.getElementById("lab-led");
const labControles = document.getElementById("lab-controles");
const labEntradas = document.getElementById("lab-entradas-visuais");
const labFeedback = document.getElementById("lab-feedback");
const labProxima = document.getElementById("lab-proxima");


// ==========================================
// CALCULAR A SAÍDA DO CIRCUITO
// ==========================================

function calcularSaida() {

    const fase = fases[faseAtual];

    return fase.calcular(
        entradasLab[0],
        entradasLab[1],
        entradasLab[2]
    );

}


// ==========================================
// ATUALIZAR O CIRCUITO
// ==========================================

function atualizarCircuito() {

    const fase = fases[faseAtual];
    const saida = calcularSaida();

    labSaida.textContent = saida;

    labLed.classList.toggle(
        "ligado",
        saida === 1
    );

    labEntradas.innerHTML = "";
    labControles.innerHTML = "";

    for (let i = 0; i < fase.entradas; i++) {

        const letra = String.fromCharCode(65 + i);

        const indicador = document.createElement("span");

        indicador.textContent =
            letra + " = " + entradasLab[i];

        labEntradas.appendChild(indicador);

        const controle = document.createElement("div");

        controle.className = "controle-entrada";

        const texto = document.createElement("strong");

        texto.textContent = "Entrada " + letra;

        const botao = document.createElement("button");

        botao.type = "button";

        botao.textContent =
            entradasLab[i] === 1
                ? "Ligado (1)"
                : "Desligado (0)";

        botao.classList.toggle(
            "ligado",
            entradasLab[i] === 1
        );

        botao.disabled = faseConcluida;

        botao.addEventListener("click", () => {

            entradasLab[i] = 1 - entradasLab[i];

            labFeedback.textContent =
                "Entradas alteradas. Clique em Testar.";

            atualizarCircuito();

        });

        controle.appendChild(texto);
        controle.appendChild(botao);

        labControles.appendChild(controle);

    }

}


// ==========================================
// CARREGAR UMA FASE DO LABORATÓRIO
// ==========================================

function carregarFase() {

    const fase = fases[faseAtual];

    entradasLab = [0, 0, 0];
    faseConcluida = false;

    labFase.textContent =
        "Fase " + (faseAtual + 1) +
        " de " + fases.length;

    labPontos.textContent =
        pontosLab + " acertos";

    labDescricao.textContent = fase.descricao;

    labAlvo.textContent = fase.alvo;

    labPorta.textContent = fase.nome;

    labFeedback.textContent =
        "Configure as entradas e clique em Testar.";

    labProxima.disabled = true;

    document.getElementById("lab-testar").disabled = false;

    atualizarCircuito();

}


// ==========================================
// TESTAR O CIRCUITO
// ==========================================

function testarCircuito() {

    if (faseConcluida) return;

    const fase = fases[faseAtual];
    const saida = calcularSaida();

    if (saida === fase.alvo) {

        faseConcluida = true;
        pontosLab++;

        labPontos.textContent =
            pontosLab + " acertos";

        labFeedback.textContent =
            "Correto! " + fase.explicacao;

        document.getElementById("lab-testar").disabled = true;

        if (faseAtual < fases.length - 1) {

            labProxima.disabled = false;

        } else {

            labFeedback.textContent =
                "Parabéns! Você concluiu as 9 fases! " +
                fase.explicacao;

        }

        atualizarCircuito();

    } else {

        labFeedback.textContent =
            "Ainda não! A saída foi " + saida +
            ". Tente outra combinação.";

    }

}


// ==========================================
// PRÓXIMA FASE DO LABORATÓRIO
// ==========================================

function proximaFase() {

    if (!faseConcluida) return;

    if (faseAtual < fases.length - 1) {

        faseAtual++;
        carregarFase();

    }

}


// ==========================================
// REINICIAR LABORATÓRIO
// ==========================================

function reiniciarLaboratorio() {

    faseAtual = 0;
    pontosLab = 0;

    carregarFase();

}

document.getElementById("lab-testar")
    .addEventListener("click", testarCircuito);

document.getElementById("lab-proxima")
    .addEventListener("click", proximaFase);

document.getElementById("lab-reiniciar")
    .addEventListener("click", reiniciarLaboratorio);

carregarFase();


// ==========================================
// JOGO 3 - DESAFIO BINÁRIO
// ==========================================

// Números decimais das 10 fases.

const desafiosBinarios = [
    13, 5, 18, 37, 64,
    99, 127, 150, 201, 255
];

// Pesos de um número binário de 8 bits.

const pesosBinarios = [
    128, 64, 32, 16, 8, 4, 2, 1
];

let faseBinaria = 0;
let pontosBinarios = 0;
let tentativasBinarias = 0;

let bitsBinarios = [0, 0, 0, 0, 0, 0, 0, 0];

let faseBinariaResolvida = false;


// ==========================================
// CALCULAR O VALOR DECIMAL
// ==========================================

function valorBinario() {

    let soma = 0;

    for (let i = 0; i < bitsBinarios.length; i++) {

        soma += bitsBinarios[i] * pesosBinarios[i];

    }

    return soma;

}


// ==========================================
// ATUALIZAR OS BITS NA TELA
// ==========================================

function atualizarBinario() {

    const painel = document.getElementById("bin-bits");

    painel.innerHTML = "";

    for (let i = 0; i < bitsBinarios.length; i++) {

        const grupo = document.createElement("div");

        grupo.className = "bin-bit";

        const peso = document.createElement("span");

        peso.textContent = pesosBinarios[i];

        const botao = document.createElement("button");

        botao.type = "button";

        botao.textContent = bitsBinarios[i];

        botao.classList.toggle(
            "ativo",
            bitsBinarios[i] === 1
        );

        botao.disabled = faseBinariaResolvida;

        botao.addEventListener("click", () => {

            bitsBinarios[i] = 1 - bitsBinarios[i];

            document.getElementById("bin-feedback").textContent =
                "Confira a soma e teste sua combinação.";

            atualizarBinario();

        });

        grupo.appendChild(peso);
        grupo.appendChild(botao);

        painel.appendChild(grupo);

    }

    document.getElementById("bin-formado").textContent =
        bitsBinarios.join("");

    let parcelas = [];

    for (let i = 0; i < bitsBinarios.length; i++) {

        if (bitsBinarios[i] === 1) {
            parcelas.push(pesosBinarios[i]);
        }

    }

    if (parcelas.length > 0) {

        document.getElementById("bin-soma").textContent =
            parcelas.join(" + ") +
            " = " + valorBinario();

    } else {

        document.getElementById("bin-soma").textContent = "0";

    }

}


// ==========================================
// CARREGAR UMA FASE BINÁRIA
// ==========================================

function carregarDesafioBinario() {

    bitsBinarios = [0, 0, 0, 0, 0, 0, 0, 0];

    faseBinariaResolvida = false;

    document.getElementById("bin-fase").textContent =
        "Fase " + (faseBinaria + 1) +
        " de " + desafiosBinarios.length;

    document.getElementById("bin-pontos").textContent =
        pontosBinarios + " fases concluídas";

    document.getElementById("bin-tentativas").textContent =
        tentativasBinarias + " tentativas";

    document.getElementById("bin-alvo").textContent =
        desafiosBinarios[faseBinaria];

    document.getElementById("bin-feedback").textContent =
        "Clique nos bits para ligá-los ou desligá-los.";

    document.getElementById("bin-testar").disabled = false;

    document.getElementById("bin-proxima").disabled = true;

    if (faseBinaria === desafiosBinarios.length - 1) {

        document.getElementById("bin-proxima").textContent =
            "Jogar novamente";

    } else {

        document.getElementById("bin-proxima").textContent =
            "Próxima fase";

    }

    atualizarBinario();

}


// ==========================================
// CONFERIR O NÚMERO BINÁRIO
// ==========================================

function testarDesafioBinario() {

    if (faseBinariaResolvida) return;

    tentativasBinarias++;

    document.getElementById("bin-tentativas").textContent =
        tentativasBinarias + " tentativas";

    const resultado = valorBinario();

    const alvo = desafiosBinarios[faseBinaria];

    if (resultado === alvo) {

        faseBinariaResolvida = true;

        pontosBinarios++;

        document.getElementById("bin-pontos").textContent =
            pontosBinarios + " fases concluídas";

        document.getElementById("bin-testar").disabled = true;

        document.getElementById("bin-proxima").disabled = false;

        if (faseBinaria === desafiosBinarios.length - 1) {

            document.getElementById("bin-feedback").textContent =
                "Parabéns! Você concluiu todas as 10 fases!";

        } else {

            document.getElementById("bin-feedback").textContent =
                "Correto! O binário " +
                bitsBinarios.join("") +
                " representa o decimal " + alvo + ".";

        }

        atualizarBinario();

    } else {

        document.getElementById("bin-feedback").textContent =
            "Você montou " + resultado +
            ", mas precisa formar " + alvo +
            ". Ajuste os bits e tente novamente.";

    }

}


// ==========================================
// ZERAR OS BITS
// ==========================================

function limparBits() {

    if (faseBinariaResolvida) return;

    bitsBinarios = [0, 0, 0, 0, 0, 0, 0, 0];

    atualizarBinario();

    document.getElementById("bin-feedback").textContent =
        "Bits zerados. Monte outra combinação.";

}


// ==========================================
// PRÓXIMA FASE BINÁRIA
// ==========================================

function proximaFaseBinaria() {

    if (!faseBinariaResolvida) return;

    if (faseBinaria === desafiosBinarios.length - 1) {

        faseBinaria = 0;
        pontosBinarios = 0;
        tentativasBinarias = 0;

    } else {

        faseBinaria++;

    }

    carregarDesafioBinario();

}


// ==========================================
// REINICIAR DESAFIO BINÁRIO
// ==========================================

function reiniciarDesafioBinario() {

    faseBinaria = 0;
    pontosBinarios = 0;
    tentativasBinarias = 0;

    carregarDesafioBinario();

}


// ==========================================
// BOTÕES DO DESAFIO BINÁRIO
// ==========================================

document.getElementById("bin-testar")
    .addEventListener("click", testarDesafioBinario);

document.getElementById("bin-proxima")
    .addEventListener("click", proximaFaseBinaria);

document.getElementById("bin-limpar")
    .addEventListener("click", limparBits);

document.getElementById("bin-reiniciar")
    .addEventListener("click", reiniciarDesafioBinario);

carregarDesafioBinario();
