var trex,trexCorrendo;
var solo,soloImagem,soloInvisivel;
var nuvem, nuvemImagem;
var obstaculo, cacto1,cacto2,cacto3,cacto4,cacto5,cacto6;
var pontuacao = 0;
var PLAY = 1;
var END = 0;
var estadoJogo = PLAY;
var grupoNuvens, grupoObstaculos;
var gameOverImg, restartImg, gameOver,restart;
var trexColisao;
var checkpointSound, dieSound, jumpSound;

function preload(){
  trexCorrendo = loadAnimation("trex1.png","trex3.png","trex4.png");
  soloImagem = loadAnimation("ground2.png");
  nuvemImagem = loadAnimation("cloud.png");
  cacto1 = loadAnimation("obstacle1.png");
  cacto2 = loadAnimation("obstacle2.png");
  cacto3 = loadAnimation("obstacle3.png");
  cacto4 = loadAnimation("obstacle4.png");
  cacto5 = loadAnimation("obstacle5.png");
  cacto6 = loadAnimation("obstacle6.png");
  gameOverImg = loadAnimation("gameOver.png");
  restartImg = loadAnimation("restart.png");
  trexColisao = loadImage("trex_collided.png");
  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //crie um sprite de trex
  trex = createSprite(50,height-70,50,50);
  trex.addAnimation("correndo",trexCorrendo);
  trex.addAnimation("colisao",trexColisao);
 
  trex.scale = 0.5;

  //criar o solo
  solo = createSprite(width/2,height-20,width,20);
  solo.addAnimation("solo",soloImagem);
  

  //criar solo invisivel
  soloInvisivel = createSprite(width/2,height-10,width,10);
  soloInvisivel.visible = false;

  grupoNuvens = new Group();
  grupoObstaculos = new Group();

  //Sprite Game Over
  gameOver = createSprite(width/2,height/2 + 100);
  gameOver.addAnimation("gameover",gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  //Sprite Restart
  restart = createSprite(width/2,height/2);
  restart.addAnimation("restart",restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  //trex.debug = true;
  trex.setCollider("circle",0,0,40);

  //var numero = Math.round(random(1,100));
  //console.log(numero);

  
  
  
}

function draw(){
  background("white");
 
  textSize(16);
  text("Pontuação " + pontuacao,400,50);

  if(estadoJogo == PLAY){
    //velocidade do solo
    solo.velocityX = -(2 + 3* pontuacao/1000);

    //fazer o solo se repetir infinitamente
    if(solo.x < 0){
      solo.x = solo.width/2;
    }

    //atualiza a pontuação
    pontuacao = pontuacao + Math.round(frameCount/60);

     //trex pula quando pressionar a tecla espaço
    if((touches.length > 0 || keyDown("space")) && trex.y >= 100){
      jumpSound.play();
      trex.velocityY = -10;
      touches=[];
    }
    //faz o trex descer, seria a gravidade
    trex.velocityY = trex.velocityY + 0.5;

    //função para gerar as nuvens
    gerarNuvens();

    //função para gerar obstaculos
    gerarCactos();

    if(pontuacao > 0 && pontuacao % 1000 == 0){
      checkpointSound.play();
    }

    if(grupoObstaculos.isTouching(trex)){
      //trex.velocityY = -10;
      dieSound.play();
      estadoJogo = END;
    }
  }// fim do if PLAY
  else if(estadoJogo == END){
    solo.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("colisao");
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setLifetimeEach(-1);
    grupoObstaculos.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)){
      reset();
    }

  }
  
  trex.collide(soloInvisivel);
  
  drawSprites();
}

function gerarNuvens(){
  
  if(frameCount%60 == 0){
    nuvem = createSprite(width,100,40,10);
    nuvem.addAnimation("nuvem",nuvemImagem);
    nuvem.y = Math.round(random(10,60));
    nuvem.scale = 0.4;
    nuvem.velocityX = -2;

    //console.log("TREX " + trex.depth);
    //console.log("NUVEM " + nuvem.depth);

    //ajustar as camadas
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    nuvem.lifetime = width;
    grupoNuvens.add(nuvem);
  }
}

function gerarCactos(){
  if(frameCount%100 == 0){
    obstaculo = createSprite(width,height-30,10,40);
    obstaculo.velocityX = -(2 + pontuacao/10000);

    var numero = Math.round(random(1,6));
      //console.log(numero);
    switch(numero){
      case 1: obstaculo.addAnimation("cacto1",cacto1);
      break;
      case 2: obstaculo.addAnimation("cacto2",cacto2);
      break;
      case 3: obstaculo.addAnimation("cacto3",cacto3);
      break;
      case 4: obstaculo.addAnimation("cacto4",cacto4);
      break;
      case 5: obstaculo.addAnimation("cacto5",cacto5);
      break;
      case 6: obstaculo.addAnimation("cacto6",cacto6);
      break;
      default:break;
    }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width;
    grupoObstaculos.add(obstaculo);
  }
}

function reset(){
  estadoJogo = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  grupoNuvens.destroyEach();
  grupoObstaculos.destroyEach();
  trex.changeAnimation("correndo");
  pontuacao = 0;
}
