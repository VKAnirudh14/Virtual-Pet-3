var Dog;
var HappyDog;
var database;
var foods;
var foodStock;
var DogImg;
var HappyDogImg;
var db;
var FeedFood,AddFood;
var fedTime,lastFed;
var foodObj;
var Bedroom,Washroom,Garden;
var changingGameState,readingGameState,gameState;
var SadDog;

function preload()
{
  DogImg = loadImage("virtual pet images/Dog.png");
  HappyDogImg = loadImage("virtual pet images/happy dog.png");
  Bedroom = loadImage("virtual pet images/Bed Room.png");
  Washroom = loadImage("virtual pet images/Wash Room.png");
  Garden = loadImage("virtual pet images/Garden.png");
  SadDog = loadImage("virtual pet images/deadDog.png")
}

function setup() {
  createCanvas(500, 500);

  database = firebase.database();

  readingGameState = database.ref('gameState');
  readingGameState.on("value",function(data){
    gameState=data.val();
  })

  FeedFood = createButton("Feed the Dog");
  FeedFood.position(700,95);
  FeedFood.mousePressed(feedDog);

  AddFood=createButton("Add Food");
  AddFood.position(800,95);
  AddFood.mousePressed(AddFood)

  foodObj = new Food();
  
  
  Dog=createSprite(250,250);
  Dog.scale=0.1;
  Dog.addImage(DogImg)

  foodStock=database.ref("Food")
    foodStock.on("value",readStock)


}


function draw() {  

  background("green");


  if(gameState!="Hungry"){
    FeedFood.hide();
    AddFood.hide();
    
  }else{
    FeedFood.show();
    AddFood.show();
    Dog.addImage(SadDog);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.BedRoom();
  }else{
    update("Hungry")
    foodObj.display();
  }

    foodObj.display();

    fedTime =  database.ref('FeedTime')
    fedTime.on("value",function(data){
    lastFed=data.val();
});
  

  drawSprites();
  textSize(15);
 

  if(lastFed>=12){
    text("Last Feed :"+lastFed%12 + "PM",250,30);
  }
  else if(lastFed==0){
    text("Last Feed :12 AM",250,30);
  }else{
    text("Last Feed : "+lastFed + 'AM',250,30);

    }
  }



  function readStock(data){
    foods=data.val();
  }

  

  function AddFood(){



    foods++;
    database.ref('/').update({
      Food:foods,
     

    })


  }
  function feedDog(){

  Dog.addImage(HappyDogImg)

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      fedTime:hour()
      
    })

  }

  function update(state){
    database.ref('/').update({
      gameState:state
    });
  }