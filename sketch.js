/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("cenario.png");
  coinImage = loadImage("assets/coin.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale  = 2;
  jungle.x = width /2;

  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background("#FBD071");
  
  kangaroo.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3
    

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(kangaroo.y)
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    kangaroo.collide(invisibleGround);
    //escreva uma condição para que o estado do jogo mude para end (fim).
    if(kangaroo.collide(obstaclesGroup)){
      collidedSound.play();
      gameState = END;
    }
    //escreva uma condição para a pontuação aumentar
    if(kangaroo.collide(coinsGroup)){
      score = score + 1;
      coinsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);

    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Pontuação: "+ score, camera.position.x,50);
  
  
}

function spawnShrubs() {
 
  if (frameCount % 150 === 0) {

    var coin = createSprite(camera.position.x+500,330,40,10);

    coin.velocityX = -(6 + 3*score/100)
    coin.scale = 0.1;

    coin.addImage(coinImage);
    
       
    
    coin.lifetime = 400;
    
    coin.setCollider("rectangle",0,0,coin.width/2,coin.height/2)
    coinsGroup.add(coin);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  //mude a animação canguru
  kangaroo.changeAnimation("running",kangaroo_running);
  //destrua os arbustos e o grupo de obstáculos
  coinsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  
  score = 0;
}