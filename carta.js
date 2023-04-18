document.addEventListener('DOMContentLoaded', function() {

    //elementos da tag form
    const input_usuario = document.querySelector('#input_usuario');
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
    let numColunas = 2;
    let numLinhas = 2;

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
    document.addEventListener('keydown', function(event) {
        // Verifica se a tecla 'v' foi pressionada
        if (event.keyCode === 86) {
            // Simula a vitória
            const cartas = document.querySelectorAll('.carta');
            cartas.forEach(carta => {
                carta.classList.add('virada');
            });

            setTimeout(() => {
                pontuacao = Math.floor(pontuacao/jogadas);
                document.getElementById("pontuacao-placar").innerHTML = pontuacao; 
                document.getElementById("pontuacao").value = pontuacao;
                overlay.style.display = 'block';
                const win = new Audio('assets/sounds/win.wav')
                win.play();

            }, 1000);
        }
    });

    $.ajax({
        url: "exibir_tabela.php",
        method: "GET",
        success: function(data) {
            $('#tabelaResultados').html(data);
            console.log(data);
        },
        error: function() {
            // Caso ocorra algum erro na requisição, essa função será executada
            alert("Erro ao carregar os dados.");
        }
    });
    
    $('#pontuacao-form').submit(function(event) {
        event.preventDefault(); // impede que o formulário seja enviado da maneira convencional

        var form = $(this); // obtém o objeto do formulário
        var formData = form.serialize(); // serializa os dados do formulário em uma string

        $.ajax({
            type: 'POST',
            url: 'enviar_pontuacao.php', // substitua pelo nome do seu script PHP
            data: formData,
            success: function(response) {
                // trata a resposta do servidor
                console.log(response);
            },
            error: function(xhr, status, error) {
                // trata erros de requisição
                console.log(error);
            }
        });
    });
});