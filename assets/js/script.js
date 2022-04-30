function start() {

	$("#inicio").hide();

	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2' ></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
	$("#fundo-game").append("<div id='placar'></div>");
	$("#fundo-game").append("<div id='energia'></div>");


	var podeAtirar = true;
	var jogo = {};
	var velocidade = 5;
	var posicaoY = parseInt(Math.random() * 334);
	var TECLA = {
		W: 87,
		S: 83,
		D: 68
	}

	jogo.pressionou = [];

	$(document).keydown(function (e) {
		jogo.pressionou[e.which] = true;
	});


	$(document).keyup(function (e) {
		jogo.pressionou[e.which] = false;
	});

	//game loop

	jogo.timer = setInterval(loop, 30);

	function loop() {

		movefundo();
		movejogador();
		moveinimigo1();
		moveinimigo2();
		moveamigo();
		colisao();


	}

	function movefundo() {

		esquerda = parseInt($("#fundoGame").css("background-position"));
		$("#fundoGame").css("background-position", esquerda - 1);

	}

	function movejogador() {

		if (jogo.pressionou[TECLA.W]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top", topo - 10);


			if (topo <= 0) {

				$("#jogador").css("top", topo + 10);
			}


		}

		if (jogo.pressionou[TECLA.S]) {

			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top", topo + 10);

			if (topo >= 434) {
				$("#jogador").css("top", topo - 10);

			}
		}

		if (jogo.pressionou[TECLA.D]) {

			//Chama função Disparo	
			disparo();
		}

	}
	function moveinimigo1() {

		posicaoX = parseInt($("#inimigo1").css("left"));
		$("#inimigo1").css("left", posicaoX - velocidade);
		$("#inimigo1").css("top", posicaoY);

		if (posicaoX <= 0) {
			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left", 694);
			$("#inimigo1").css("top", posicaoY);

		}
	}

	function moveinimigo2() {
		posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left", posicaoX - 3);

		if (posicaoX <= 0) {

			$("#inimigo2").css("left", 775);

		}
	}
	function moveamigo() {

		posicaoX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left", posicaoX + 1);

		if (posicaoX > 906) {

			$("#amigo").css("left", 0);

		}

	}

	function disparo() {

		if (podeAtirar == true) {

			podeAtirar = false;

			topo = parseInt($("#jogador").css("top"))
			posicaoX = parseInt($("#jogador").css("left"))
			tiroX = posicaoX + 190;
			topoTiro = topo + 37;
			$("#fundoGame").append("<div id='disparo'></div");
			$("#disparo").css("top", topoTiro);
			$("#disparo").css("left", tiroX);

			var tempoDisparo = window.setInterval(executaDisparo, 30);

		} //Fecha podeAtirar

		function executaDisparo() {
			posicaoX = parseInt($("#disparo").css("left"));
			$("#disparo").css("left", posicaoX + 15);

			if (posicaoX > 900) {

				window.clearInterval(tempoDisparo);
				tempoDisparo = null;
				$("#disparo").remove();
				podeAtirar = true;

			}
		}
	}

	function colisao() {
		let colisao1 = ($("#jogador").collision($("#inimigo1")));
		let colisao2 = ($("#jogador").collision($("#inimigo2")));
		let colisao3 = ($("#disparo").collision($("#inimigo1")));
        let colisao4 = ($("#disparo").collision($("#inimigo2")));
		let colisao5 = ($("#jogador").collision($("#amigo")));
		let colisao6 = ($("#inimigo2").collision($("#amigo")));

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













}




