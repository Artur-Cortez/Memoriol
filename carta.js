document.addEventListener('DOMContentLoaded', function() {
    const imagens = [];

    for (let i = 1; i <= 14; i++) {
        imagens.push(`assets/imagens/imagem${i}.jpg`);
      }
    
    var diferentes = new Audio('assets/sounds/iguais.wav')
    var win = new Audio('assets/sounds/win.wav')
    var correto = new Audio('assets/sounds/correto.wav')

    var paresCorretos = 0;

    var jogadas = 0;

    var pontuacao = 0;

    const tabuleiro = document.getElementById('tabuleiro');

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
        pontuacao += 300;
        document.getElementById("pontuacao-placar").innerHTML = pontuacao; 
        document.getElementById("jogadas").innerHTML = jogadas;
        checarPar();
    }
    
    function checarPar() {
        if (primeiraCarta.dataset.valor === segundaCarta.dataset.valor) {
            paresCorretos += 1;
            desabilitarCartas();
            
            setTimeout(() => {
                correto.play()
            }, 900);

            if (paresCorretos === cartas.length / 2) {

                setTimeout(() => {
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
    document.addEventListener('keydown', function(event) {
        // Verifica se a tecla 'v' foi pressionada
        if (event.keyCode === 86) {
            // Simula a vitória
            const cartas = document.querySelectorAll('.carta');
            cartas.forEach(carta => {
                carta.classList.add('virada');
            });

            setTimeout(() => {
                document.getElementById("pontuacao-placar").innerHTML = pontuacao; 
                document.getElementById("pontuacao").value = pontuacao;
                overlay.style.display = 'block';
                const win = new Audio('assets/sounds/win.wav')
                win.play();

            }, 1000);
        }
    });
    xhr = new XMLHttpRequest();
    xhr.open("POST", "enviar_pontuacao.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("pontuacao=" + pontuacao);
    
});