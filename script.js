// As posições começam em zero: linha, coluna e direção (H = horizontal, V = vertical).
// Todas as 16 palavras do PDF possuem ao menos um cruzamento válido.
const palavras = [
  { resposta: 'MICROCONTROLADOR', linha: 9, coluna: 1, direcao: 'H', pista: 'Chip que reúne processamento, memória e interfaces para controlar dispositivos.' },
  { resposta: 'REGISTRADORES', linha: 0, coluna: 7, direcao: 'V', pista: 'Áreas muito rápidas dentro do processador que guardam valores temporários.' },
  { resposta: 'MEMORIADEMASSA', linha: 7, coluna: 1, direcao: 'H', pista: 'Categoria de armazenamento persistente usada para guardar arquivos e programas.' },
  { resposta: 'ADDRESSBUS', linha: 12, coluna: 2, direcao: 'H', pista: 'Conjunto de linhas que indica a posição de memória a ser acessada.' },
  { resposta: 'DATABUS', linha: 12, coluna: 3, direcao: 'V', pista: 'Conjunto de linhas que transporta informações entre componentes do computador.' },
  { resposta: 'DUALCORE', linha: 1, coluna: 0, direcao: 'H', pista: 'Processador que possui dois núcleos físicos de execução.' },
  { resposta: 'QUADCORE', linha: 15, coluna: 1, direcao: 'H', pista: 'Processador que possui quatro núcleos físicos de execução.' },
  { resposta: 'EEPROM', linha: 6, coluna: 16, direcao: 'V', pista: 'Tipo não volátil regravável eletricamente, usado para guardar pequenas configurações.' },
  { resposta: 'FLASH', linha: 4, coluna: 4, direcao: 'H', pista: 'Tecnologia não volátil utilizada para armazenar o programa do Arduino.' },
  { resposta: 'CACHE', linha: 15, coluna: 5, direcao: 'V', pista: 'Armazenamento rápido que reduz o tempo de acesso a informações frequentes.' },
  { resposta: 'CPU', linha: 17, coluna: 1, direcao: 'H', pista: 'Componente central que busca, interpreta e executa instruções.' },
  { resposta: 'ULA', linha: 12, coluna: 10, direcao: 'V', pista: 'Parte do processador responsável por cálculos e operações lógicas.' },
  { resposta: 'UC', linha: 1, coluna: 1, direcao: 'V', pista: 'Parte do processador que coordena a execução das instruções.' },
  { resposta: 'RAM', linha: 5, coluna: 3, direcao: 'V', pista: 'Memória volátil usada por programas que estão em execução.' },
  { resposta: 'ROM', linha: 11, coluna: 14, direcao: 'H', pista: 'Tipo de memória tradicionalmente associado a dados somente para leitura.' },
  { resposta: 'DMA', linha: 5, coluna: 14, direcao: 'V', pista: 'Mecanismo que transfere dados entre periféricos e memória com pouca intervenção do processador.' }
];

const TOTAL_LINHAS = 20;
const TOTAL_COLUNAS = 17;
const tabuleiro = document.getElementById('tabuleiro');
const horizontais = document.getElementById('pistas-horizontais');
const verticais = document.getElementById('pistas-verticais');
const contador = document.getElementById('contador');
const mensagem = document.getElementById('mensagem');
const casas = {};
let palavraAtiva = null;

function chave(linha, coluna) {
  return `${linha}-${coluna}`;
}

function posicoes(palavra) {
  const lista = [];
  for (let i = 0; i < palavra.resposta.length; i++) {
    lista.push({
      linha: palavra.linha + (palavra.direcao === 'V' ? i : 0),
      coluna: palavra.coluna + (palavra.direcao === 'H' ? i : 0)
    });
  }
  return lista;
}

function montarJogo() {
  // A numeração segue a ordem de leitura: de cima para baixo, da esquerda para a direita.
  const ordenadas = [...palavras].sort((a, b) => a.linha - b.linha || a.coluna - b.coluna);
  const numeros = {};
  let proximoNumero = 1;
  ordenadas.forEach(palavra => {
    const inicio = chave(palavra.linha, palavra.coluna);
    if (!numeros[inicio]) numeros[inicio] = proximoNumero++;
    palavra.numero = numeros[inicio];
    palavra.posicoes = posicoes(palavra);
  });

  const ocupadas = {};
  palavras.forEach(palavra => {
    palavra.posicoes.forEach((pos, indice) => {
      const id = chave(pos.linha, pos.coluna);
      if (!ocupadas[id]) ocupadas[id] = { letra: palavra.resposta[indice], palavras: [] };
      if (ocupadas[id].letra !== palavra.resposta[indice]) {
        throw new Error(`Cruzamento incompatível na casa ${id}`);
      }
      ocupadas[id].palavras.push(palavra);
    });
  });

  for (let linha = 0; linha < TOTAL_LINHAS; linha++) {
    for (let coluna = 0; coluna < TOTAL_COLUNAS; coluna++) {
      const id = chave(linha, coluna);
      const casa = document.createElement('div');
      casa.className = 'casa';
      if (!ocupadas[id]) {
        casa.classList.add('vazia');
      } else {
        if (numeros[id]) {
          const numero = document.createElement('span');
          numero.className = 'numero';
          numero.textContent = numeros[id];
          casa.appendChild(numero);
        }
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.autocomplete = 'off';
        input.setAttribute('aria-label', `Linha ${linha + 1}, coluna ${coluna + 1}`);
        input.addEventListener('focus', () => selecionarCasa(id, false));
        input.addEventListener('click', () => selecionarCasa(id, true));
        input.addEventListener('input', () => digitar(id));
        input.addEventListener('keydown', evento => controlarTeclas(evento, id));
        casa.appendChild(input);
        casas[id] = { elemento: casa, input, palavras: ocupadas[id].palavras };
      }
      tabuleiro.appendChild(casa);
    }
  }

  palavras.forEach(palavra => {
    const item = document.createElement('li');
    item.textContent = `${palavra.numero}. ${palavra.pista} (${palavra.resposta.length} letras)`;
    item.addEventListener('click', () => selecionarPalavra(palavra));
    palavra.item = item;
    (palavra.direcao === 'H' ? horizontais : verticais).appendChild(item);
  });
  selecionarPalavra(ordenadas[0], false);
}

function selecionarPalavra(palavra, focar = true) {
  palavraAtiva = palavra;
  Object.values(casas).forEach(casa => casa.elemento.classList.remove('selecionada'));
  palavras.forEach(p => p.item.classList.remove('ativa'));
  palavra.posicoes.forEach(pos => casas[chave(pos.linha, pos.coluna)].elemento.classList.add('selecionada'));
  palavra.item.classList.add('ativa');
  if (focar) casas[chave(palavra.linha, palavra.coluna)].input.focus();
}

function selecionarCasa(id, alternar) {
  const candidatas = casas[id].palavras;
  if (!candidatas.includes(palavraAtiva)) {
    selecionarPalavra(candidatas[0], false);
  } else if (alternar && candidatas.length > 1) {
    selecionarPalavra(candidatas.find(p => p !== palavraAtiva), false);
  }
}

function focarIndice(indice) {
  if (!palavraAtiva || indice < 0 || indice >= palavraAtiva.posicoes.length) return;
  const pos = palavraAtiva.posicoes[indice];
  casas[chave(pos.linha, pos.coluna)].input.focus();
}

function digitar(id) {
  const casa = casas[id];
  casa.input.value = casa.input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
  limparMarcacoes();
  if (!palavraAtiva) return;
  const indice = palavraAtiva.posicoes.findIndex(pos => chave(pos.linha, pos.coluna) === id);
  if (casa.input.value && indice !== -1) focarIndice(indice + 1);
}

function controlarTeclas(evento, id) {
  if (!palavraAtiva) return;
  const indice = palavraAtiva.posicoes.findIndex(pos => chave(pos.linha, pos.coluna) === id);
  if (evento.key === 'Backspace' && !casas[id].input.value) {
    evento.preventDefault();
    focarIndice(indice - 1);
  }
  if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
    evento.preventDefault();
    focarIndice(indice + 1);
  }
  if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
    evento.preventDefault();
    focarIndice(indice - 1);
  }
}

function limparMarcacoes() {
  Object.values(casas).forEach(casa => casa.elemento.classList.remove('correta', 'incorreta'));
  palavras.forEach(p => p.item.classList.remove('acertou', 'errou'));
  contador.textContent = `0 de ${palavras.length} palavras corretas`;
  mensagem.textContent = 'Você alterou o tabuleiro. Clique em Conferir para atualizar os acertos.';
}

function conferir() {
  let acertos = 0;
  const certas = new Set();
  const erradas = new Set();
  palavras.forEach(palavra => {
    const digitada = palavra.posicoes.map(pos => casas[chave(pos.linha, pos.coluna)].input.value).join('');
    const acertou = digitada === palavra.resposta;
    if (acertou) acertos++;
    palavra.item.classList.toggle('acertou', acertou);
    palavra.item.classList.toggle('errou', !acertou);
    palavra.posicoes.forEach(pos => (acertou ? certas : erradas).add(chave(pos.linha, pos.coluna)));
  });
  // Nos cruzamentos, a cor verde tem prioridade quando a casa pertence a uma palavra correta.
  Object.entries(casas).forEach(([id, casa]) => {
    casa.elemento.classList.toggle('correta', certas.has(id));
    casa.elemento.classList.toggle('incorreta', erradas.has(id) && !certas.has(id));
  });
  contador.textContent = `${acertos} de ${palavras.length} palavras corretas`;
  mensagem.textContent = acertos === palavras.length
    ? 'Parabéns! Você completou toda a cruzadinha!'
    : 'Verde: correta. Vermelho: incorreta ou incompleta. Continue tentando!';
}

function reiniciar() {
  Object.values(casas).forEach(casa => { casa.input.value = ''; });
  limparMarcacoes();
  mensagem.textContent = 'Tabuleiro reiniciado. Boa revisão!';
  selecionarPalavra(palavras[0]);
}

document.getElementById('botao-conferir').addEventListener('click', conferir);
document.getElementById('botao-reiniciar').addEventListener('click', reiniciar);
montarJogo();
