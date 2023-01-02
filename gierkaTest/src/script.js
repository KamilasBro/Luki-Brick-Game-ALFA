let canvas=document.getElementById("gameScreen");
let ctx=canvas.getContext('2d');

const GAME_WIDTH=800;
const GAME_HEIGHT=600;
const GAMESTATE={
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    NEWLEVEL: 4
};
var speed=0;

function detectColision(gameObject)
{
    let bottomOfBall=game.ball.position.y+game.ball.size;
    let topOfBall=game.ball.position.y;

    let topOfObject=gameObject.position.y;
    let leftSideOfObject=gameObject.position.x;
    let rightSideOfObject=gameObject.position.x+gameObject.width;
    let bottomOfObject=gameObject.position.y+gameObject.height;

    if(bottomOfBall>=topOfObject&&
        topOfBall<=bottomOfObject
    &&game.ball.position.x>=leftSideOfObject
    &&game.ball.position.x+game.ball.size<=rightSideOfObject)
    {
        return true;
    }     
    else
    {
        return false;
    }   
}
class Paddle
{
    constructor(game)
    {
        this.width=150;
        this.height=20;
        this.gameWidth=game.gameWidth;

        this.position={
            x: game.gameWidth/2 -this.width/2,
            y: game.gameHeight-this.height-10,
        };
    }
    draw(ctx)
    {
        ctx.fillStyle='black';
        ctx.fillRect(this.position.x, this.position.y,  this.width, this.height);
    }
    update(deltaTime)
    {
        if(!deltaTime) return;
        this.position.x+=speed;
    }
    moveLeft()
    {
        if(this.position.x<=1)
        {
            this.position.x=0+1;
            stop();
        }
        else
        speed=-7;
    }
    moveRight()
    {
        if(this.position.x>=800-this.width-1)
        {
            this.position.x=800-this.width-1;
            stop();
        }
        else
        speed=7;
    }
    stop()
    {
        speed=0;
    }
}
class InputHandler
{
    constructor()
    {
        document.addEventListener('keydown', (event)=>{
            switch(event.keyCode)
            {
                case 37:
                    game.paddle.moveLeft();
                break;
                case 39:
                    game.paddle.moveRight();
                break;
                case 65:
                    game.paddle.moveLeft();
                break;
                case 68:
                    game.paddle.moveRight();
                break;
            }
        });
        document.addEventListener('keyup', (event)=>{
            switch(event.keyCode)
            {
                case 37:
                    if(speed<0)
                    game.paddle.stop();
                break;
                case 39:
                    if(speed>0)
                    game.paddle.stop();
                break;
                case 65:
                    if(speed<0)
                    game.paddle.stop();
                break;
                case 68:
                    if(speed>0)
                    game.paddle.stop();
                break;
                case 27:
                    game.togglePause();
                break;
                case 32:
                    game.start();
                break;
            }
        });
    }
}
class Ball
{
    constructor(game)
    {
        this.gameWidth=game.gameWidth;
        this.gameHeight=game.gameHeight;
        this.image=document.getElementById('img_ball');
        this.size=24;
        this.reset();
    }
    draw(ctx)
    {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
    }
    update(deltaTime)
    {
        this.position.x+=this.speed.x;
        this.position.y+=this.speed.y;
        if((this.position.x+this.size)>this.gameWidth||this.position.x<0)
        {
            this.speed.x= -this.speed.x;
        }
        if(this.position.y<0)
        {
            this.speed.y= -this.speed.y;
        }
        if((this.position.y+this.size)>this.gameHeight)
        {
            game.lives--;
            document.getElementById("lives").innerHTML=game.lives;
            this.reset();
        }
        if(detectColision(game.paddle))
        {
            this.speed.y=-this.speed.y;
            this.position.y=game.paddle.position.y-this.size;
        }
    }
    reset()
    {
        this.speed={x:4,y:2};
        this.position={x:10, y:400};
    }
}
class Brick
{
    constructor(game, position)
    {
        this.image=document.getElementById('img_brick');
        this.position=position;
        this.width=80;
        this.height=24;
        this.markedForDeletion=false;
    }
    update(deltaTime)
    {
        if(detectColision(this))
        {
            game.ball.speed.y=-game.ball.speed.y;
            this.markedForDeletion=true;
        }
    }
    draw(ctx)
    {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
}
const level1=[
    
    [1,0,1,1,1,1,1,1,0,1],
    [1,1,1,0,1,1,0,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]
];
const level2=[
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]
];
const level3=[
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]
];
const level4=[
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]
];
function buildLevel(game, level)
{
    let bricks=[];
    level.forEach((row, rowIndex)=>{
        row.forEach((brick, brickIndex)=>{
            if(brick===1){
                let position={
                    x: 80*brickIndex,
                    y: 40+24*rowIndex
                };
                bricks.push(new Brick(game,position));
            }
        });
    });
    return bricks;
}
class Game
{
    constructor(GAME_WIDTH, GAME_HEIGHT)
    {
        this.gameWidth=GAME_WIDTH;
        this.gameHeight=GAME_HEIGHT;
        this.gamestate=GAMESTATE.MENU;
        this.paddle= new Paddle(this);
        this.ball=new Ball(this);
        this.gameObjects=[];
        this.bricks=[];
        this.lives=5;
        this.levels=[level1, level2];
        this.currentLevel=0;
        this.inputHandler=new InputHandler(this);
        
    }
    start()
    {
        if( this.gamestate!==GAMESTATE.MENU&&
            this.gamestate!==GAMESTATE.NEWLEVEL)
        {
            return;
        }
        document.getElementById("lives").innerHTML=game.lives;
        document.getElementById("currentLvl").innerHTML=this.currentLevel+1;
        this.bricks=buildLevel(game, this.levels[this.currentLevel]);
        this.ball.reset();
        this.gameObjects=[this.ball, this.paddle];
        this.gamestate=GAMESTATE.RUNNING;
    }
    update(deltaTime)
    {
        if(this.lives===0)
        {
            this.gamestate=GAMESTATE.GAMEOVER;
        }
        if( this.gamestate===GAMESTATE.PAUSED||
            this.gamestate===GAMESTATE.MENU||
            this.gamestate===GAMESTATE.GAMEOVER
            )
        {
            return;
        }
        if(this.bricks.length===0)
        {
            this.currentLevel++;
            this.gamestate=GAMESTATE.NEWLEVEL;
            this.start();
        }
        [...this.gameObjects, ...this.bricks].forEach((Object)=>Object.update(deltaTime));
        this.bricks=this.bricks.filter(brick=>!brick.markedForDeletion);
    }
    draw(ctx)
    {
        [...this.gameObjects, ...this.bricks].forEach((Object)=>Object.draw(ctx));
        
        if(this.gamestate==GAMESTATE.PAUSED)
        {
        ctx.rect(0,0,this.gameWidth,this.gameHeight);
        ctx.fillStyle="rgba(0,0,0,0.5)";
        ctx.fill();

        ctx.font="30px Arial";
        ctx.fillStyle="white";
        ctx.textAlign="center";
        ctx.fillText("Paused",this.gameWidth/2, this.gameHeight/2)
        }
        if(this.gamestate==GAMESTATE.MENU)
        {
        ctx.rect(0,0,this.gameWidth,this.gameHeight);
        ctx.fillStyle="rgb(32,32,32)";
        ctx.fill();

        ctx.font="30px Arial";
        ctx.fillStyle="white";
        ctx.textAlign="center";
        ctx.fillText("Press SPACEBAR To Start",this.gameWidth/2, this.gameHeight/2)
        }
        if(this.gamestate==GAMESTATE.GAMEOVER)
        {
        ctx.rect(0,0,this.gameWidth,this.gameHeight);
        ctx.fillStyle="rgb(32,32,32)";
        ctx.fill();

        ctx.font="30px Arial";
        ctx.fillStyle="white";
        ctx.textAlign="center";
        ctx.fillText("GAME OVER",this.gameWidth/2, this.gameHeight/2)
        }
    }
    togglePause()
    {
        if(this.gamestate==GAMESTATE.PAUSED)
        {
            this.gamestate=GAMESTATE.RUNNING;
        }
        else
        {
            this.gamestate=GAMESTATE.PAUSED;
        }
    }
}
ctx.clearRect(0, 0, 800, 600);

var game=new Game(GAME_WIDTH, GAME_HEIGHT)
var lastTime=0;

function gameLoop(timeStamp)
{
    let deltaTime=timeStamp-lastTime;
    lastTime=timeStamp;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);
}
gameLoop();
