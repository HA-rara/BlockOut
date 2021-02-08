/*function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}*/
function setup() {
  //canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  let canvas = createCanvas(width*5, height*6);
  canvas.parent('canvas');
  noStroke();
  gameInit();
  colorMode(HSB,100,100,100);
}
///////////////////////////
let gseq;//画面遷移
let px,py,pw=40,ph=20;//パドル
let bx,by,spdx,spdy,br=10;//ボール
let blw,blh;//パドルの幅，高さ
let blf = [];//ブロックの配列
let lastx,lasty;//箱の跳ね返り
let bexist=0;
let score;
let mcnt;//点滅
let time=0;
//////////////////////////
function draw() {
  background(0);
  if(gseq==0){
    gameTitle();
  }else if(gseq==1){
    gamePlay();
  }else if(gseq==2){
    gameOver();
  }else{
    gameClear();
  }
}

function gameInit(){//初期化
  gseq=0;//gameTitle
  bx=width/2;by=250;spdx=0;spdy=2;//ボールの初期値
  phit=0;
  for(let m=0;m<25;m++){blf[m]=1;}//最初はブロックは1が入る
  bexist=0;
  score=0;
  mcnt=0;
  time=0;
}

function gameTitle(){
  playerMove();
  playerDisp();
  blockDisp();
  scoreDisp();
  timeDisp();

  mcnt++;
  textSize(20);
  fill(20,100,100);
  text("Click to start",width/2.6,360);
}

function gamePlay(){
  playerMove();
  playerDisp();
  ballMove();
  ballDisp();
  blockDisp();
  scoreDisp();
  timeDisp();
/*
  for(let l=0;l<25;l++){
    textSize(10);
    fill(255);
    text(blf[l], 100+20*(l%5),(l/5)*15+400);
  }*/
}

function gameClear(){
  background(30,60,100);
  timeDisp();
  textSize(25);
  fill(255);
  text("score: ",width/5,430);
  textSize(50);
  text(score,width/2,430);
  fill(95,100,100);
  text("GAME CLEAR",width/6,300);
  mcnt++;
  if(mcnt%60 <40){
    textSize(20);
    fill(15,100,100);
    text("Click to retry",width/2.6,360);
  }
}

function gameOver(){
  playerDisp();
  blockDisp();
  timeDisp();
  textSize(25);
  fill(255);
  text("score: ",width/5,430);
  textSize(50);
  text(score,width/2,430);
  fill(1,100,100);
  text("GAME OVER",width/5,300);
  mcnt++;
  if(mcnt%60 <40){
    textSize(20);
    fill(20,100,100);
    text("Click to retry",width/2.6,360);
  }
}

function playerDisp(){//パドル
  py=height-3*ph;
  fill(0,0,100);
  rect(px, py, pw, ph, 5);
}

function playerMove(){
  px=mouseX;//マウスで動かす
  if( (px+pw) > width){
    px=width-pw;
  }else if(px < 0){
    px=0;
  }
}

function ballDisp(){
  imageMode(CENTER);
  fill(0,0,100);
  ellipse(bx,by,br);
  imageMode(CORNER);
}

function ballMove(){
  lastx=bx;
  lasty=by;
  bx+=spdx;
  by+=spdy;

  ///////////////////////////////
  if(by>height){//たての反射
    //spdy=-spdy;
    gseq=2;
  }
  if(by<0){
    spdy=-spdy;
  }
  if((bx>width) || (bx<0)){//横の反射
    spdx=-spdx;
  }
  ///////////////////////////////
  if((phit==0) && (px < bx) && (px+pw >bx) && 
  (py < by) && (py+ph > by)){//パドルの接触判定
    ////////////////
    spdy=-spdy;

    if(spdx>3){
      spdx=2;
    }
    if(spdx<-3){
      spdx=-2;
    }
    if((spdx<3) && (spdx>-3)){
      dis=(px+pw/2)-bx;
      spdx+=-dis/10;
    }
    phit=1;
    /////////////////
    if(bexist==0){
      for(let i=0;i<25;i++){
        blf[i]=1;
      }
      score+=1;
    }
  }
  if(by<py-2*br){phit=0;}
}

function blockDisp(){
  blw=width/5;blh=30;
  let xx,yy;bexist=0;
  for(let i=0;i<25;i++){
    if(blf[i]==1){
      xx=(i%5)*(blw+1);
      yy=int((i/5))*(blh+1)+50;
      fill((i%5)*19,100,100);
      
      blockHitCheck(i,xx,yy);
    }
    if(blf[i]==1){
      rect(xx,yy,blw,blh,2);
      bexist=1;
    } 
  }
}

function blockHitCheck(ii,xx,yy){
  if( !( (xx<bx) && (xx+blw >bx)
  && (yy < by) && (yy+blh >by) ) ){
    return;
  }
  blf[ii]=0;
  score+=10;
  if(ii<10){
    score+=10;
  }

  if((xx < lastx) && (xx+blw > lastx)){//ブロック幅
    spdy=-spdy;
    return;
  }
  if((yy < lasty) && (yy+blh > lasty)){//ブロック高さ
    spdx=-spdx;
    return;
  }
  spdx=-spdx;
  spdy=-spdy;
}

function scoreDisp(){
  textSize(24);
  fill(0,0,100);
  text("score:"+score,10,25);
  
  if(score>=350){
    gseq=3;
  }
}

function timeDisp(){
  if(gseq==1){
    mcnt++;
    time=120-mcnt/120;
  }
  textSize(24);
  fill(0,0,100);
  text("time: "+int(time),width/4*3,30);
}

function mousePressed(){
  if(gseq==0){
    gseq=1;
  }
  if(gseq==2){
    gameInit();
  }
  if(gseq==3){
    gameInit();
  }
}
