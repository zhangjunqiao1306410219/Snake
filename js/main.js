function Snake(m, n){
    this.x = m;
    this.y = n;
}

function Food(m, n){
    this.x = m;
    this.y = n;
    this.setX = function(a) {
        this.x = a;
    }
    this.setY = function(b) {
        this.y = b;
    }
}
//定义移动方向值
var up = new Snake(0, -1);
var down = new Snake(0, 1);
var left = new Snake(-1, 0);
var right = new Snake(1, 0);


var forwardDirection = right;
var snake;
var food;
var time;

// 存储得分
var score = 0;
var gridCell;


// DOM就绪后执行newGame函数
$(document).ready(function(){
    newGame();
});

//先开始一个游戏
function newGame() {
    //初始化地图
    initMap();
    startGame();
}

function startGame() {
    //开始游戏，初始化一条蛇
    initSnake();
    //创建一个食物
    createFood();
    gamePlay();
}

function gamePlay() {
    time = setInterval(snakeMove, 100);
}

//初始化一条蛇
function initSnake(){
    snake = [];
    for (var i=0; i<5; i++){
        snake[i] = new Snake(10-i, 10);
        gridCell = $('#grid-cell-'+snake[i].x+"-"+snake[i].y);
        gridCell.css("background-color","black");
    }
}

//创建一个食物
function createFood(){
    var createSuccess = true;
    food = new Food();
    do {
        food.setX(Math.floor(Math.random() * 24));
        food.setY(Math.floor(Math.random() * 24));
        for (var i=0; i<snake.length; i++){
            if (snake[i].x == food.x && snake[i].y == food.y){
                createSuccess = false;
            }
        }
    }while(!createSuccess);
    gridCell = $('#grid-cell-'+food.x+"-"+food.y);
    gridCell.css("background-color","red");
}

// 初始化地图
function initMap(){
    var i, j;
    for( i = 0; i < 24; i ++){
        for( j = 0; j < 24; j ++){
            gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop(i) );
            gridCell.css('left', getPosLeft(j) );
            gridCell.css('background-color', "#CCC0B3");
        }
    }
    $("#score").text("0");
    $("#oa").hide();
}

// 计算相对底部容器顶部间距
function getPosTop(i){
    return 20 + i*20;
}

// 计算相对底部容器左边间距
function getPosLeft(j){
    return 20 + j *20;
}

//判断是否咬到自己
function biteSelf(){
    for (var i=1; i<snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            return true;
        }
    }
    return false;
}

//判断是否撞墙
function collisionWall(){
    if (snake[0].x < 0 || snake[0].x > 23 || snake[0].y < 0 || snake[0].y > 23) {
        return true;
    }
    return false;
}

// 判断游戏是否结束
function isGameOver() {
    if (biteSelf() || collisionWall()){
        return true;
    }
    return false;
}

// 游戏结束操作
function gameover(){
    if (isGameOver()){
        window.clearInterval(time);
        time = null;
        snake = null;
        food = null;
        forwardDirection = right;
        score = 0;
        showGameoverAnimate();
    }
}


function snakeMove() {

    var nextStep = new Snake();
    nextStep.x = snake[0].x + forwardDirection.x;
    nextStep.y = snake[0].y + forwardDirection.y;
    snake.unshift(nextStep);

    gridCell = $('#grid-cell-'+snake[0].x+"-"+snake[0].y);
    gridCell.css("background-color","black");

    if (nextStep.x == food.x && nextStep.y == food.y) {
        showScoreAnimate(10);
        createFood();
    } else {
        var disapper = snake.pop();
        gridCell = $('#grid-cell-'+disapper.x+"-"+disapper.y);
        gridCell.css("background-color","#CCC0B3");
    }
    gameover();
} 

// 监听左上右下光标键，按键后执行相应操作
$(document).keydown(function(event){
    if (event.keyCode == 38 && forwardDirection != right){
        forwardDirection = left;
    } else if (event.keyCode == 37 && forwardDirection != down){
        forwardDirection = up;
    } else if (event.keyCode == 40 && forwardDirection != left){
        forwardDirection = right;
    } else if (event.keyCode == 39 && forwardDirection != up){
        forwardDirection = down;
    }
});

//显示分数的动画效果
function showScoreAnimate(score){
    
    var oscoreDom=$("#score");
    var ascoreDom=$("#oa");
    oscoreNum=parseInt(oscoreDom.text())+score;

    ascoreDom.text("+"+score);
    ascoreDom.fadeIn(300).fadeOut(300);
    oscoreDom.text(oscoreNum);
}

// 游戏结束时的动画效果
function showGameoverAnimate(){
    var ascoreDom=$("#oa");
    ascoreDom.text("Game Over!");
    ascoreDom.fadeIn(1000).fadeOut(3000);
}
