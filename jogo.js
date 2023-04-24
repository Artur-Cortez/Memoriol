document.addEventListener('DOMContentLoaded', function() {

const form = document.getElementById('form-nome');
const tabela = document.getElementById('tabela-placares');
const spanElement = document.querySelector('#pontuacao-form span');

//detecção de qualquer mudança no valor do input
input_usuario.addEventListener('input', function() {
  if (input_usuario.value === '') {
    spanElement.classList.remove('transformado');
    input_usuario.style.border = '2px solid rgba(255, 255, 255, 0.25)';     
  } else {
    spanElement.classList.add('transformado');
    input_usuario.style.border = '2px solid #4CAF50';
  }
});

const imagens = [];
let numLinhas = 3;
let numColunas = 4;

for (let i = 1; i <= ((numColunas*numLinhas)/2); i++) {
  imagens.push(`assets/imagens/imagem${i}.jpg`);
}

var diferentes = new Audio('assets/sounds/iguais.wav')
var win = new Audio('assets/sounds/win.wav')
var correto = new Audio('assets/sounds/correto.wav')

var paresCorretos = 0;

var jogadas = 0;

var pontuacao = 0;

const tabuleiro = document.getElementById('tabuleiro');
tabuleiro.style.gridTemplateColumns = `repeat(${numColunas}, 1fr)`;
tabuleiro.style.gridTemplateRows = `repeat(${numLinhas}, 1fr)`;

const overlay = document.getElementById('overlay')

const pares = imagens.concat(imagens);

//embaralha
for (let i = pares.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [pares[i], pares[j]] = [pares[j], pares[i]];
}

//cria cartas   
for (let i = 0; i < pares.length; i++) {
  const carta = document.createElement('div');
  carta.classList.add('container', 'carta');
  carta.dataset.valor = pares[i];
  
  const frente = document.createElement('div');
  frente.classList.add('frente');
  carta.appendChild(frente);
  
  const verso = document.createElement('div');
  verso.classList.add('verso');
  verso.style.backgroundImage = `url(${pares[i]})`;
  carta.appendChild(verso);
  
  tabuleiro.appendChild(carta);
}

let cartas = document.querySelectorAll('.carta')

let primeiraCarta, segundaCarta;
let bloquearTabuleiro = false;


function virarCarta() {
  if (bloquearTabuleiro) return;
  if (this === primeiraCarta) return;
  
  this.classList.add('virada');
  
  if (!primeiraCarta) {
      primeiraCarta = this;
      return;
  }
  
  segundaCarta = this;
  jogadas++;
  document.getElementById("pontuacao-placar").innerHTML = pontuacao; 
  document.getElementById("jogadas").innerHTML = jogadas;
  checarPar();
}

function checarPar() {
  if (primeiraCarta.dataset.valor === segundaCarta.dataset.valor) {
      paresCorretos += 1;
      pontuacao += 70000;
      desabilitarCartas();
      
      setTimeout(() => {
          correto.play()
      }, 900);

      if (paresCorretos === cartas.length / 2) {

          setTimeout(() => {
              pontuacao = Math.floor(pontuacao/jogadas);
        document.getElementById("pontuacao").value = pontuacao;
              overlay.style.display = 'block';
              document.getElementById("pontuacao-placar").innerHTML = pontuacao; 
              win.play();
          }, 1000);
      }

      return;
  }
  
  bloquearTabuleiro = true;
  
  setTimeout(() => {
      primeiraCarta.classList.remove('virada');
      segundaCarta.classList.remove('virada');
      
      diferentes.play()
      resetarTabuleiro();
  }, 1300);
}

function desabilitarCartas() {
  primeiraCarta.removeEventListener('click', virarCarta);
  segundaCarta.removeEventListener('click', virarCarta);
  
  
  resetarTabuleiro();
}

function resetarTabuleiro() {
  [primeiraCarta, segundaCarta] = [null, null];
  bloquearTabuleiro = false;
}

function embaralharCartas() {
cartas.forEach(carta => {
  let posicaoAleatoria = Math.floor(Math.random() * 12);
  carta.style.order = posicaoAleatoria;
  carta.classList.add('escondido');});
  setTimeout(() => {
      cartas.forEach(carta => {
          carta.classList.remove('escondido')
      });
  }, 1000);
};
cartas.forEach(carta => {
  carta.addEventListener('click', virarCarta);
});

const botaoReiniciar = document.getElementById('reiniciar')
botaoReiniciar.addEventListener('click', reiniciarJogo);

function reiniciarJogo() {
  
  embaralharCartas();

  gameOver.style.display = 'none';
  
  paresCorretos = 0;
  primeiraCarta = null;
  segundaCarta = null;
  
  cartas.forEach(carta => {
      carta.classList.remove('virada');
  });
  
  cartas.forEach(carta => {
      carta.addEventListener('click', virarCarta);
  });
}

// Função para fazer a requisição GET e atualizar a tabela
function atualizarTabela() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'php/buscar.php', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const registros = JSON.parse(xhr.responseText);
      tabela.innerHTML = '';
      registros.forEach((registro) => {
        const linha = document.createElement("tr");
        const colunaId = document.createElement("td");
        const colunaNome = document.createElement("td");
        const colunaPontuacao = document.createElement("td");

        colunaId.innerText = registro.id;
        colunaNome.innerText = registro.nome;
        colunaPontuacao.innerText = registro.pontuacao;

        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaPontuacao);

        tabela.appendChild(linha);
      });
    }
  };
  xhr.send();
}


// Função para enviar o formulário e atualizar a tabela
function enviarFormulario() {
  // Obtém o valor do campo "nome" do formulário
  const nome = document.getElementById('input_usuario').value;
  const pontuacao = parseInt(document.getElementById('pontuacao').value);

  // Cria uma nova solicitação assíncrona ao servidor
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'php/inserir.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      atualizarTabela();
    }
  };


  // Envia os dados do formulário para o script PHP no servidor
  xhr.send(`nome=${nome}&pontuacao=${pontuacao}`);
}

// Adiciona os ouvintes de evento
form.addEventListener('submit', (event) => {
  // Impede o comportamento padrão do formulário de recarregar a página
  event.preventDefault();
  enviarFormulario();
});

window.onload = atualizarTabela;

});