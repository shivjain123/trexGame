var trex, trexRunning, trexCollided
var ground, invisibleGround, groundImage
var CloudsGroup, cloudImage
var ObstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6

var score = 0

var PLAY = 1
var END = 0
var gameState = PLAY

var gameOver, gameOverImage
var restart, restartImage

function preload() {
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 430);

  //create a trex sprite
  trex = createSprite(50, 390, 20, 50);
  trex.addAnimation("running", trexRunning);

  //scale the trex
  trex.scale = 0.5

  //set collision radius for the trex
  trex.setCollider("rectangle",0,0,50, trex.height);
  trex.debug = true;
  
  //create a ground sprite
  ground = createSprite(200, 400, 20, 50);
  ground.addImage("ground", groundImage);

  //invisible Ground to support trex
  invisibleGround = createSprite(200, 410, 400, 10);
  invisibleGround.visible = false;

  ObstaclesGroup = new Group();
  CloudsGroup = new Group();

  //place gameOver and restart icon on the screen
  gameOver = createSprite(300,200);
    gameOver.addImage("gameover", gameOverImage);
    gameOver.scale = 0.5;
  
  restart = createSprite(300,250);
    restart.addImage("restart", restartImage);
    restart.scale = 0.5;

    gameOver.visible = false;
    restart.visible = false;
  
  //set text
  textSize(24);
  textFont("Georgia");
  fill("blue");
  //textStyle(BOLD);
}

function draw() {

  //set background to white
  background("white");

  if(gameState === PLAY){
    
  //update the score
  score = score + Math.round(getFrameRate() / 60);

  //display score
  text("Score : " + score, 250, 80);
    
  //move the ground
  ground.velocityX = -6;

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  //jump when the space key is pressed
  if (keyDown("space") && trex.y >= 380) {
    trex.velocityY = -12;
  }

  //add gravity
  trex.velocityY = trex.velocityY + 0.8;

  //spawn the clouds
  spawnClouds();

  //spawn obstacles
  spawnObstacles();
    
  //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  else if(gameState === END) {
    
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.addAnimation("collided", trexCollided);
    
    //set lifetime of the game objects so that they are never           destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    //shift the score text further up
      text("Score : " + score , 250, 50);
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
    
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.addAnimation("running", trexRunning);
  
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(590, 395, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 250;
    
    //obstacle.debug = true;
    
    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //add each obstacle to the group
    obstacle.addToGroup(ObstaclesGroup);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(590, 300, 40, 10);
    cloud.y = Math.round(random(300, 250));
    cloud.addImage("cloud", cloudImage);
    cloud.scale = 0.6;
    cloud.velocityX = -3;
    // cloud.debug = true;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloud.addToGroup(CloudsGroup);
  }

}