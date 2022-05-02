function start(){
	$("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador'></div>");
	$("#fundoGame").append("<div id='inimigo1'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo'></div>");
	
	//sons do jogo
	let somExplosao = document.querySelector("#som-explosao");
	let somGameover = document.querySelector("#som-gameover");
		somGameover.volume = .5;
	let somMusica = document.querySelector("#som-musica");
	let somTiro = document.querySelector("#som-tiro");
	let somPerdido = document.querySelector("#som-perdido");
	let somResgate = document.querySelector("#som-resgate");
		somResgate.volume = .2;
	
	somMusica.loop = true;
	somMusica.currentTime = 0;
	//somMusica.volume = .2;
	somMusica.play();
	//somMusica.addEventListener('ended', function(){
	//	somMusica.currentTime = 0;
	//	somMusica.play();
	//}, false);
	
	const jogo = {};
	const TECLAS = {
		W: 87,
		S: 83,
		D: 68
	};
	
	let fimDeJogo = false;
	let podeAtirar = true;
	let tempoDisparo;
	
	let pontos = 0;
	let amigosSalvos = 0;
	let amigosPerdidos = 0;
	let energiaAtual = 3;
	
	jogo.teclaPressionada = [];
	
	$(document).keydown(function(e){
		jogo.teclaPressionada[e.which] = true;
	});
	
	$(document).keyup(function(e){
		jogo.teclaPressionada[e.which] = false;
	});
	let dificuldade = 5;
	let velocidadeDoInimigo = Math.floor((Math.random() * 5)) + dificuldade;
	let posicaoDoInimigo = Math.random() * 330;
	
	placar();
	energia();
	
	jogo.timer = setInterval(loop, 30);
	
	function loop(){
		if(!fimDeJogo){
			moveFundo();
			moveJogador();
			moveInimigo1();
			moveInimigo2();
			moveAmigo();
			colisao();
		}
	}
	
	function moveFundo(){
		let esquerda = parseInt($("#fundo-game").css("background-position"));
		$("#fundo-game").css("background-position", esquerda-2);
	}
	
	function moveJogador(){
		if(jogo.teclaPressionada[TECLAS.W]){
			let posicao = Math.max(parseInt($("#jogador").css("top")), 15);
			$("#jogador").css("top", posicao-10);
		}
		
		if(jogo.teclaPressionada[TECLAS.S]){
			let posicao = Math.min(parseInt($("#jogador").css("top")), 420);
			$("#jogador").css("top", posicao+10);
		}
		
		if(jogo.teclaPressionada[TECLAS.D]){
			if(podeAtirar){
				disparo();
			}
		}
	}
	
	function moveInimigo1(){
		let posicaoX = parseInt($("#inimigo1").css("left"));
		$("#inimigo1").css("left", posicaoX - velocidadeDoInimigo);
		$("#inimigo1").css("top", posicaoDoInimigo);
		
		if(posicaoX <= -300){
			criaInimigo1();
		}
	}
	
	function moveInimigo2(){
		let posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left", posicaoX - 4);

		if(posicaoX <= -300){
			criaInimigo2(false);
		}
	}
	
	function moveAmigo(){
		let posicaoX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left", posicaoX + 2);

		if(posicaoX >= 950){
			criaAmigo();
		}
	}
	
	function criaAmigo(){
		$("#amigo").remove();
		let tempoAmigo = (Math.floor(Math.random() * 6) + 5) * 1000;
		
		setTimeout(function(){
			$("#fundo-game").append("<div id='amigo' class='anima3'></div>");
			$("#amigo").css("left", -50);
		},tempoAmigo)
		
	}
	
	function disparo(){
		somTiro.play();
		podeAtirar = false;
		
		let posicaoX = parseInt($("#jogador").css("left")) + 190;
		let posicaoY = parseInt($("#jogador").css("top")) + 37;
		
		$("#fundo-game").append("<div id='tiro'></div>");
		$("#tiro").css("top", posicaoY);
		$("#tiro").css("left", posicaoX);
		
		tempoDisparo = window.setInterval(moveTiro, 30);
	}
	
	function moveTiro(){
		let posicaoX = parseInt($("#tiro").css("left"));
		$("#tiro").css("left", posicaoX + 15);

		if(posicaoX >= 950){
			limpaTiro();
		}
	}
	
	function limpaTiro(){
		window.clearInterval(tempoDisparo);
		tempoDisparo = null;
		$("#tiro").remove();
		podeAtirar = true;
	}
	
	function colisao(){
		let colisao1 = ($("#jogador").collision($("#inimigo1"))); 
		let colisao2 = ($("#jogador").collision($("#inimigo2"))); 
		let colisao3 = ($("#tiro").collision($("#inimigo1"))); 
		let colisao4 = ($("#tiro").collision($("#inimigo2"))); 
		let colisao5 = ($("#jogador").collision($("#amigo"))); 
		let colisao6 = ($("#inimigo2").collision($("#amigo"))); 
		
		//Colisão com inimigo1
		if(colisao1.length > 0 || colisao3.length > 0){
			if(colisao3.length > 0){
				pontos += 100;
				placar();
				dificuldade = Math.min(dificuldade + .3,10);
				limpaTiro();
			} else {
				energiaAtual--;
				energia();
			}
		
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			
			explosao(inimigo1X, inimigo1Y);
			criaInimigo1();
		}
		
		//Colisão com inimigo2
		if(colisao2.length > 0 || colisao4.length > 0){
			if(colisao4.length > 0){
				pontos += 50;
				placar();
				limpaTiro();
			} else {
				energiaAtual--;
				energia();
			}
		
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			
			explosao(inimigo2X, inimigo2Y);
			$("#inimigo2").remove();
			setTimeout(criaInimigo2, 3000, true);
		}
		
		//Colisão jogador com amigo
		if(colisao5.length > 0){
			somResgate.play();
			amigosSalvos++;
			placar();
			criaAmigo();
		}
		
		//Colisão inimig2 com amigo
		if(colisao6.length > 0){
			somPerdido.play();
			amigosPerdidos++;
			placar();
		
			let x = parseInt($("#amigo").css("left"));
			let y = parseInt($("#amigo").css("top"));
			
			explosão3(x,y);
			
			criaAmigo();
		}
	}
	
	function explosao(x,y){
		somExplosao.play();
		
		$("#fundo-game").append("<div id='explosao'></div>");
		$("#explosao").css("background-image","url(./imgs/explosao.png)");
		
		let div = $("#explosao");
		div.css("top",y);
		div.css("left",x);
		div.animate({width:200, opacity:0},"slow");
		
		let tempoExplosao = window.setInterval(removeExplosao,1000);
		
		function removeExplosao(){
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao = null;
		}
	}
	
	function explosão3(x,y){
		$("#fundo-game").append("<div id='explosao3' class='anima4'></div>");
		$("#explosao3").css("left",x);
		$("#explosao3").css("top",y);
		
		setTimeout(function(){
			$("#explosao3").remove();
		},1000);
	}
	
	function criaInimigo1(){
		velocidadeDoInimigo = Math.floor((Math.random() * 5)) + dificuldade;;
		posicaoDoInimigo = Math.random() * 330;
		$("#inimigo1").css("top", posicaoDoInimigo);
		$("#inimigo1").css("left", 900);
	}
	
	function criaInimigo2(novoInimigo){
		if(novoInimigo){
			$("#fundo-game").append("<div id='inimigo2'></div>");
		}
		$("#inimigo2").css("left", 1060);
	}
	
	function placar(){
		$("#placar").html(`<h2>Pontos: ${pontos} Salvos: ${amigosSalvos} Perdidos: ${amigosPerdidos}</h2>`);
	}
	
	function energia(){
		switch(energiaAtual){
			case 3:
				$("#energia").css("background-image","url(./imgs/energia3.png)");
				break;
			case 2:
				$("#energia").css("background-image","url(./imgs/energia2.png)");
				break;
			case 1:
				$("#energia").css("background-image","url(./imgs/energia1.png)");
				break;
			case 0:
				$("#energia").css("background-image","url(./imgs/energia0.png)");
				gameOver();
				break;
			default: console.log("ERRO no valor da energia")
		}
	}
	
	function gameOver(){
		fimDeJogo = true;
		somMusica.pause();
		somGameover.play();
		window.clearInterval(jogo.timer);
		jogo.timer = null;
		
		$("#jogador").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#amigo").remove();
		
		$("#fundo-game").append("<div id='fim'></div>");
		
		$("#fim").html(`<h1>GAME OVER</h1><p>Sua pontuação foi: ${pontos}</p><div id="reinicia" onclick=reiniciaJogo()><h3>Jogar Novamente</h3></div>`);
	}
}

function reiniciaJogo(){
	document.querySelector("#som-gameover").pause();
	$("#fim").remove();
	start();
}