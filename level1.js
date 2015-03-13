var player;
var cursors;
var water;
var water1;
var inWater=false;
var onLadder=false;
var killobjglobal = true;
var playerCollisionGroup;
var isJumpCollisionGroup;
var killCollisionGroup;
var beltCollisionGroup;
var counter = 0;

//-------------OBJECTS---------------
var index;
var star;
var moveKillObj;
var boxArray = new Array();
var beltRight;
var beltLeft;
var beltLeft2;
var rightBeltBoxArray = new Array();
var leftBeltBoxArray = new Array();
var stool;
var ladder;
var pPlate;
var pPlate2;
var plateBox;
var plateBox2;
var door;
var door2;
var pPlate3;
var door3;
var door4;
var pPlate4;
var pPlate5;

//-------------Boxes------------------
var checkCreated = 0;
var checkCreated2 = 0;
var Box;
var boxX;
var boxY;
var box2X;
var box2Y;
var onGround = true;
var playerbox = true;
//----------Player Control Variables---
var facing = 'left';
var jumpButton;
var ifCanJump = false;
var trigger = false;
var beltRightBool = false;
var beltLeftBool = false;
var touchdown = false;
var plateDown = false;
var plateDown2 = false;
var bothDown = false;
var plateDown3 = false;
var plateDown4 = false;
var bothDown2 = false;
var plateDown5 = false;

//------------TESTING PURPOSES
var isDebug = true;
var godmode = 0;

//----------Pause Control-----------
var paused;
var pausePanel;
var mehSpeed;

//----------fire-------------
var sprite;
var emitter;
var emitter2;

//---------------CUTSCENE-------------
var blacker;
var cutsceneFlag;
var gameStart = true;
var gameEnd = false;
var inCutsceneDoor1 = false;
var intro;
var starcut;

Game.level1 = function (game){
	this.music = null;
};

Game.level1.prototype = {

    createBox: function(x, y, index, playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup){
        boxX = x;
        boxY = y;
        plateBox = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(plateBox);
        plateBox.body.static = false;
        plateBox.body.fixedRotation = true;
        plateBox.body.setCollisionGroup(BoxCollisionGroup);
        plateBox.body.collides(isJumpCollisionGroup,function (){onGround = true;},this);
        plateBox.body.collides([playerCollisionGroup]);

    },

    createBox2: function(x, y, index, playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup ){
        box2X = x;
        box2Y = y;
        plateBox2 = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(plateBox2);
        plateBox2.body.gravity = 0;
        plateBox2.body.static = false;
        plateBox2.body.fixedRotation = true;
        plateBox2.body.setCollisionGroup(BoxCollisionGroup);
        plateBox2.body.collides(isJumpCollisionGroup,function (){onGround = true;},this);
        plateBox2.body.collides([playerCollisionGroup]);

    },

    terraincreator: function(image,x,y,playerCollisionGroup,isJumpCollisionGroup, BoxCollisionGroup, realTerrain){
        var terrain = this.add.sprite(x, y,image); //creates the sprite
        this.physics.p2.enableBody(terrain,isDebug);    //enables physics on it
        terrain.body.clearShapes();
        if(realTerrain){
            terrain.body.clearShapes();
            terrain.body.loadPolygon('physicsdatafactory','fact1');
            //1.Tells the ground to be part of the jumpable collision group
            //2.This effectively tells it that it collides with these collision groups.
            terrain.body.setCollisionGroup(isJumpCollisionGroup);
            terrain.body.collides([isJumpCollisionGroup, playerCollisionGroup, winCollisionGroup, BoxCollisionGroup, killCollisionGroup,beltCollisionGroup]);
        }
        terrain.body.static = true;                  //disables gravity for itself...
        terrain.body.fixedRotation = true;           //fixes rotation?
    },

    moveKill: function(temp,start,end,travel,time,angler){
        //handles animations of the sprite
        if (temp.x <= start){
            this.add.tween(temp).to( { x: '+'+travel }, time, Phaser.Easing.Linear.None, true);
        }
        else if (temp.x >= end){
            this.add.tween(temp).to( { x: '-'+travel }, time, Phaser.Easing.Linear.None, true);
        }
        //Handpicked roation value, after careful  trial and error and such...
        this.add.tween(temp).to({angle: angler}, 1, Phaser.Easing.Linear.None, true, 100);

        //Check the collision bounds....
        if((player.body.x >= temp.x-50 && player.body.x <= temp.x+100-50 && player.body.y >= temp.y-50 && player.body.y <= temp.y+100-50)){
            //console.log('DEAD');
            this.endGame();   
        }
    },

    floatingBox: function(image,x,y,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,i){
        boxArray[i] = this.add.sprite(x,y,image);
        this.physics.p2.enableBody(boxArray[i],isDebug);
        boxArray[i].body.setCollisionGroup(isJumpCollisionGroup);
        boxArray[i].body.collides([isJumpCollisionGroup,playerCollisionGroup,BoxCollisionGroup]);
        boxArray[i].body.data.gravityScale=0;
    },
    ladderUpdater: function(ladd){
        if((player.body.x >= ladd.x && player.body.x <= ladd.x+20 && player.body.y >= ladd.y && player.body.y <= ladd.y+150))
            return true;
        else
            return false;
    },

    create: function() {
        //adds music
        this.music = this.add.audio('tutorialmusic');
        this.music.play();

        gameStart = true;
        gameEnd = false;
        inCutsceneDoor1 = false;

        //changes bounds of the world and add a background for the world
        this.world.setBounds(0,0,15600,2800);
        this.stage.backgroundColor = '#d0f4f7';

        //  We're going to be using physics, so enable the P2 Physics system
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = -500;
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.restitution = 0.0;

        //COLLISION GROUPS -- VERY IMPORTANT (Helps keep track of which platforms the player can jump on...)
        playerCollisionGroup = this.physics.p2.createCollisionGroup();
        isJumpCollisionGroup = this.physics.p2.createCollisionGroup();
        killCollisionGroup = this.physics.p2.createCollisionGroup();
        winCollisionGroup = this.physics.p2.createCollisionGroup();
        BoxCollisionGroup = this.physics.p2.createCollisionGroup();
        beltCollisionGroup = this.physics.p2.createCollisionGroup();


        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.physics.p2.updateBoundsCollisionGroup();

        //Create a moveKill object
        //moveKillObj = this.add.sprite(500, 1678, 'boulder');
        moveKillObj = new Array();
        moveKillObj[0] = this.add.sprite(5250,1795,'sawblade');
        moveKillObj[0].anchor.setTo(0.5,0.5);
        moveKillObj[1] = this.add.sprite(6250, 1613, 'sawblade');
        moveKillObj[1].anchor.setTo(0.5,0.5);
        moveKillObj[2] = this.add.sprite(2430,1610,'sawblade');
        moveKillObj[2].anchor.setTo(0.5,0.5);
        moveKillObj[3] = this.add.sprite(4700,1790,'sawblade');
        moveKillObj[3].anchor.setTo(0.5,0.5);
        moveKillObj[4] = this.add.sprite(4870,1683,'sawblade');
        moveKillObj[4].anchor.setTo(0.5,0.5);
        moveKillObj[5] = this.add.sprite(15300,550, 'sawblade');
        //moveKillObj[5] = this.add.sprite(15630,550, 'sawblade');
        moveKillObj[5].anchor.setTo(0.5,0.5);
        moveKillObj[6] = this.add.sprite(14850,550, 'sawblade');
        moveKillObj[6].anchor.setTo(0.5,0.5);


        //if the player collides with the star next level starts
        star = this.add.sprite(15500,500,'letter');
        starcut = this.add.sprite(92,1680,'letter');
        this.physics.p2.enableBody(star, isDebug);
        star.body.setCollisionGroup(winCollisionGroup);
        star.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        this.createBox(5870, 1593.0963, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
        this.createBox2(10930, 1118.1166, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);

        //door sprite
        door = this.add.sprite(7440,1524, 'box');
        door.scale.setTo(1,3);
        door2 = this.add.sprite(7620,1050, 'box')
        door2.scale.setTo(1,3);
        door3 = this.add.sprite(11700,1375, 'box');
        door3.scale.setTo(1,3);
        door4 = this.add.sprite(13215,575, 'box');
        door4.scale.setTo(1,3);
        pPlate = this.add.sprite(7000,1580, 'box');
        pPlate2 = this.add.sprite(7470, 1500, 'box');
        pPlate3 = this.add.sprite(11245,1105, 'box');
        pPlate4 = this.add.sprite(12940,1105,'box');

        pPlate5 = this.add.sprite(15550,530, 'box');
        /*
		plateBox2 = this.add.sprite(10900,1105,'box');
        this.physics.p2.enableBody(plateBox2, isDebug);
        plateBox2.body.setCollisionGroup(isJumpCollisionGroup);
        plateBox2.body.collides([playerCollisionGroup,isJumpCollisionGroup, BoxCollisionGroup,beltCollisionGroup]);
        plateBox2.body.fixedRotation=true;
		*/
        var ledge = this.add.sprite(14970,390, 'ground');
        ledge.scale.setTo(0.5,1);
        this.physics.p2.enableBody(ledge);
        ledge.body.setCollisionGroup(isJumpCollisionGroup);
        ledge.body.collides([playerCollisionGroup,isJumpCollisionGroup,winCollisionGroup]);
        ledge.body.static = true;
        var letter = this.add.sprite(14990,300, 'letter');
        this.physics.p2.enableBody(letter);
        letter.body.setCollisionGroup(winCollisionGroup);
        letter.body.collides([playerCollisionGroup,isJumpCollisionGroup,winCollisionGroup]);
        ladder = new Array();
        ladder[0] = this.add.sprite(15075, 280,'ladder2');


        //boxes for pressure plates;

        // The player aanimations and position
        player = this.add.sprite(32, 1680, 'courier');
        //player = this.add.sprite(10920, 1000, 'courier');
        //player = this.add.sprite(5831, 1000, 'courier');
        //player = this.add.sprite(50, 1600 - 200, 'courier');
        //player = this.add.sprite(32, 1600 - 150, 'courier');
        //player = this.add.sprite(7603, 0, 'courier');
        player.animations.add('left', [3,4,5,11], 10, true);
        player.animations.add('right', [10,9,8,2], 10, true);
        player.animations.add('left_idle', [14], 10, true);
        player.animations.add('right_idle', [13], 10, true);
        player.animations.add('left_idle_letter', [6], 10, true);
        player.animations.add('right_idle_letter', [12], 10, true);
        player.animations.add('left_jump', [5], 10, true);
        player.animations.add('right_jump', [2], 10, true);
        player.animations.add('climb', [0,1], 5, true);

        this.physics.p2.enable(player);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;

        //Again we need to set the player to use the player collision group.
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides(isJumpCollisionGroup,function (){ifCanJump = true;},this);
        player.body.collides(killCollisionGroup, this.endGame, this);
        player.body.collides(winCollisionGroup, this.nextLevel,this);
        player.body.collides(BoxCollisionGroup,function(){playerbox = true; ifCanJump = true;},this);
        player.body.collides(beltCollisionGroup, function (){ifCanJump = true; touchdown=true;},this);
        
       
        //boxes on right belt
        rightBeltBoxArray[0] = this.add.sprite(2250, 1639, 'box');
        this.physics.p2.enableBody(rightBeltBoxArray[0], isDebug);
        rightBeltBoxArray[0].body.setCollisionGroup(beltCollisionGroup);
        rightBeltBoxArray[0].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        rightBeltBoxArray[0].body.fixedRotation=true;
       // rightBeltBoxArray[0].body.static=true;
        rightBeltBoxArray[1] = this.add.sprite(2370, 1639, 'box');
        this.physics.p2.enableBody(rightBeltBoxArray[1], isDebug);
        rightBeltBoxArray[1].body.setCollisionGroup(beltCollisionGroup);
        rightBeltBoxArray[1].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        rightBeltBoxArray[1].body.fixedRotation=true;
		rightBeltBoxArray[2] = this.add.sprite(2390, 1639, 'box');
        this.physics.p2.enableBody(rightBeltBoxArray[2], isDebug);
        rightBeltBoxArray[2].body.setCollisionGroup(beltCollisionGroup);
        rightBeltBoxArray[2].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        rightBeltBoxArray[2].body.fixedRotation=true;
       // rightBeltBoxArray[1].body.static=true;
       /* rightBeltBoxArray[2] = this.add.sprite(2370, 1639, 'box');
        this.physics.p2.enableBody(rightBeltBoxArray[2], isDebug);
        rightBeltBoxArray[2].body.setCollisionGroup(beltCollisionGroup);
        rightBeltBoxArray[2].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        rightBeltBoxArray[2].body.fixedRotation=true;*/
      //  rightBeltBoxArray[2].body.static=true;

        //boxes on left belt
        leftBeltBoxArray[0] = this.add.sprite(4870, 1669, 'box');
        leftBeltBoxArray[0].scale.setTo(1.3,1.3);
        this.physics.p2.enableBody(leftBeltBoxArray[0], isDebug);
        leftBeltBoxArray[0].body.setCollisionGroup(beltCollisionGroup);
        leftBeltBoxArray[0].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        leftBeltBoxArray[0].body.fixedRotation=true;

     /*   leftBeltBoxArray[1] = this.add.sprite(5000, 1669, 'box');
        leftBeltBoxArray[1].scale.setTo(2,2);
        this.physics.p2.enableBody(leftBeltBoxArray[1], isDebug);
        leftBeltBoxArray[1].body.setCollisionGroup(beltCollisionGroup);
        leftBeltBoxArray[1].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        leftBeltBoxArray[1].body.fixedRotation=true;
*/
        leftBeltBoxArray[1] = this.add.sprite(5120, 1669, 'box');
        leftBeltBoxArray[1].scale.setTo(1.3,1.3);
        this.physics.p2.enableBody(leftBeltBoxArray[1], isDebug);
        leftBeltBoxArray[1].body.setCollisionGroup(beltCollisionGroup);
        leftBeltBoxArray[1].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        leftBeltBoxArray[1].body.fixedRotation=true;

        leftBeltBoxArray[2] = this.add.sprite(5250, 1669, 'box');
        leftBeltBoxArray[2].scale.setTo(1.3,1.3);
        this.physics.p2.enableBody(leftBeltBoxArray[2], isDebug);
        leftBeltBoxArray[2].body.setCollisionGroup(beltCollisionGroup);
        leftBeltBoxArray[2].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        leftBeltBoxArray[2].body.fixedRotation=true;

        leftBeltBoxArray[3] = this.add.sprite(5380, 1669, 'box');
        leftBeltBoxArray[3].scale.setTo(1.3,1.3);
        this.physics.p2.enableBody(leftBeltBoxArray[3], isDebug);
        leftBeltBoxArray[3].body.setCollisionGroup(beltCollisionGroup);
        leftBeltBoxArray[3].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        leftBeltBoxArray[3].body.fixedRotation=true;

  /*      leftBeltBoxArray[5] = this.add.sprite(5500, 1669, 'box');
        leftBeltBoxArray[5].scale.setTo(2,2);
        this.physics.p2.enableBody(leftBeltBoxArray[5], isDebug);
        leftBeltBoxArray[5].body.setCollisionGroup(beltCollisionGroup);
        leftBeltBoxArray[5].body.collides([playerCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        leftBeltBoxArray[5].body.fixedRotation=true;
*/ 
        //sets camera to follow
        this.camera.follow(player);
        //Add water after adding the player so that way, water is layered ontop of the player
        water = this.add.sprite(10030,1205,'water1-1'); //Note this has no interactions with the inWater function
        this.add.tween(water).to({alpha:0.95}, 1, Phaser.Easing.Linear.NONE, true);//Transparency
        water.scale.setTo(2,1);//change size of water
        water1 = this.add.sprite(11400, 1205, 'water1-1');

         //ADD TERRAIN HERE
        this.terraincreator('fact1',200,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',200,2100,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',835,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',835,2100,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',1470,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',1470,2100,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',2105,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',2105,2100,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',2740,1505,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',3375,1505,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',3375,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',2820,2005,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr-null',3285,2005,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr-null',3375,2100,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',4010,1695,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',4010,2195,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',4645,1695,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',4645,2195,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',5280,1695,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',5280,2195,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',5915,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',5915,1505,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',5995,2005,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',6550,1505,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',6550,2005,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',7185,1505,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',7185,2005,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',7820,1410,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',7820,1315,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',7820,1220,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',7820,1125,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',7820,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',7905,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr-null',7905,1830,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',8455,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',8455,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',9090,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',9090,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',9725,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',9645,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',11100,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        //needs a smaller piece of null terrain
        //this.terraincreator('terr-null',11100,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',12105,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
       // this.terraincreator('terr-null',12185,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',12740,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',12740,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',13375,1030,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',13375,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',13375,935,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',13375,840,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',13375,745,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',13375,650,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',13375,555,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',14010,555,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',13465,1055,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',14645,555,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',14000,1055,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr-null',14645,1055,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',15280,555,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',15250,1055,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('fact1',11600,1355,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',12185,1530,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        
        //boxes floating in water
        this.floatingBox('box',10100,1210,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,0);
        this.floatingBox('box',10250,1210,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,1);
        this.floatingBox('box',10400,1210,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,2);
        this.floatingBox('box',10550,1210,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,3);
        this.floatingBox('box',10700,1210,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,4);
        this.floatingBox('box',11500,1210,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,5);
        this.floatingBox('box',11650,1210,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,6);
        //right direction belt
        beltRight = this.add.sprite(2245,1677,'continue');
        beltRight.scale.setTo(3.5,1);
        this.physics.p2.enableBody(beltRight, isDebug);
        beltRight.body.setCollisionGroup(beltCollisionGroup);
        beltRight.body.collides([playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        beltRight.body.static = true;
        //  beltRight.body.onEndContact.add(function(){touchdown=false;},this);
        //left direction belt
        beltLeft = this.add.sprite(5195,1748,'continue');
        beltLeft.scale.setTo(8,2);
        this.physics.p2.enableBody(beltLeft, isDebug);
        beltLeft.body.setCollisionGroup(beltCollisionGroup);
        beltLeft.body.collides([isJumpCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        //beltLeft.body.collides(playerCollisionGroup, function(){tounchdown=true; isJumpCollisionGroup=true;},this);
        beltLeft.body.collides(playerCollisionGroup, function(){ifCanJump=true;},this);
        beltLeft.body.static = true;
     //   beltLeft.body.onEndContact.add(function(){tounchdown = false;},this);
        //stepping stool box
        // last left belt
        beltLeft2 = this.add.sprite(15200, 607, 'continue');
        beltLeft2.scale.setTo(8,2);
        this.physics.p2.enableBody(beltLeft2, isDebug);
        beltLeft2.body.setCollisionGroup(beltCollisionGroup);
        beltLeft2.body.collides([isJumpCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        beltLeft2.body.collides(playerCollisionGroup, function(){tounchdown=true; isJumpCollisionGroup=true;});

        stool = this.add.sprite(4779,1783,'box');
        this.physics.p2.enableBody(stool, isDebug);
        stool.body.setCollisionGroup(isJumpCollisionGroup);
        stool.body.collides([playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,beltCollisionGroup]);
        stool.body.static=true;
        //Sets the jump button to up
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.UP);

        pushButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Our controls.(left/up/down/right)
        cursors = this.input.keyboard.createCursorKeys();
        
        //pause menu
        this.btnPause = this.game.add.button(675,20,'pause',this.pauseGame,this);

        //Build the Pause Panel
        this.pausePanel = new PausePanel(this.game);
        this.game.add.existing(this.pausePanel);

        //Enter Play Mode
        mehSpeed = new Array();

        //Create cutscenen stuff here
        blacker = this.add.sprite(0,1378,'black');
        this.game.add.tween(blacker).to({alpha:0.9}, 1, Phaser.Easing.Linear.NONE, true);
        intro = this.add.sprite(0,1378+600,'introfactory');
        cutsceneFlag = this.add.sprite(0,0,'star');

        this.playGame();
    },

    pauseGame: function(){
        if(!paused){
            paused = true;
            this.pausePanel.show();
            this.physics.p2.gravity.y = 0;
            this.camera.unfollow();
            
            //add any object that is affected by gravity here.
            //mehSpeed.push(checkmark.body.velocity.x);
            //mehSpeed.push(checkmark.body.velocity.y);
            
            //Set the vbelocities to zero to make sure they dont move anymore.
            //checkmark.body.velocity.x = 0;
            //checkmark.body.velocity.y = 0;
            
            //fix the objects from rotating and make them static
            //checkmark.body.fixedRotation = true;
        }
    },

    playGame: function(){
        if(paused){
            paused = false;
            this.pausePanel.hide();
            this.physics.p2.gravity.y = 500;
            this.camera.follow(player,this.camera.FOLLOW_PLATFORMER);
            
            //Push out velocties affected by gravity for objects here.
            //checkmark.body.velocity.y = mehSpeed.pop();
            //checkmark.body.velocity.x = mehSpeed.pop();
            
            //allow for totations and disable static.
            //checkmark.body.fixedRotation = false;
        }
    },


    update: function() {
        //console.log("x:"+this.camera.x);
        //console.log("y:"+this.camera.y);
        console.log("x: ",player.body.x);
        console.log("y: ",player.body.y);
        console.log("xleft:", beltLeft2.body.x);
        console.log("yleft:", beltLeft2.body.y);

     //   console.log("platedown:", plateDown);
       // console.log("stool x:", stool.body.x);
        //console.log("stool y:", stool.body.y);
       // console.log("touchdown:", touchdown);
        //console.log("1x:", leftBeltBoxArray[0].body.x);
        //console.log("2x:", leftBeltBoxArray[1].body.x);
        //console.log("3x:", leftBeltBoxArray[2].body.x);
        //console.log("1y:", leftBeltBoxArray[0].body.y);
        //console.log("2y:", leftBeltBoxArray[1].body.y);
      //  console.log("3y:", leftBeltBoxArray[2].body.y);
        //  To move the UI along with the camera 
        this.btnPause.x = this.camera.x+675;
        this.btnPause.y = this.camera.y+20;
        this.pausePanel.x = this.camera.x+655;
        //make sure cutscene element follow player;
        this.game.add.tween(blacker).to({x:this.game.camera.x}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(blacker).to({y:this.game.camera.y}, 1, Phaser.Easing.Linear.NONE, true);
        
		if( (player.body.x >= 7483 && player.body.x <= 7483+50 && player.body.y >= 1108 && player.body.y <= 1583) ||
			(player.body.x >= 3710 && player.body.x <= 3710+50  && player.body.y >= 1583 && player.body.y <= 1773) ||
			(player.body.x >= 13039 && player.body.x <= 13050 && player.body.y >= 633 && player.body.y <= 1108))
            ifCanJump=false;
			
		
		//move right belt boxes right
        for(var i=0;i<rightBeltBoxArray.length;i++){
          // rightBeltBoxArray[i].body.moveRight(400);
          rightBeltBoxArray[i].body.x+=1;
        }
        //move left belt boxes left
        for(var i=0;i<leftBeltBoxArray.length;i++){
            leftBeltBoxArray[i].body.x-=1;
        }
        //replace boxes that fall off right belt
        for(var i=0;i<rightBeltBoxArray.length;i++){
            if(rightBeltBoxArray[i].body.x>=2440 || rightBeltBoxArray[i].body.y>=2400){
                rightBeltBoxArray[i].body.x=2100;
                rightBeltBoxArray[i].body.y=1639;
            }
        }
        //replace boxes that fall off left belt
        for(var i=0;i<leftBeltBoxArray.length;i++){
            if(leftBeltBoxArray[i].body.y>=2000){
                leftBeltBoxArray[i].body.x=5600;
                leftBeltBoxArray[i].body.y=1683;
            }
        }
        //pressure plate boolean change
        if((plateBox.body.x>=pPlate.x&&plateBox.body.x<=pPlate.x+32&&plateBox.body.y>=pPlate.y&&plateBox.body.y<=pPlate.y+28) ||
            (player.body.x>=pPlate.x&&player.body.x<=pPlate.x+32&&player.body.y>=pPlate.y&&player.body.y<=pPlate.y+28)){
            plateDown=true;
        }else{
            plateDown=false;
        }

        if(player.body.x>=pPlate2.x&&player.body.x<=pPlate2.x+32&&player.body.y>=pPlate2.y&&player.body.y<=pPlate2.y+28){
            plateDown2=true;
        }else{
            plateDown2=false;
        }

        if(plateDown&&plateDown2){
            bothDown=true;
        }
        //second pressure plate area stuff
        if(plateBox2.body.x>=pPlate3.x&&plateBox2.body.x<=pPlate3.x+32&&plateBox2.body.y>=pPlate3.y&&plateBox2.body.y<=pPlate3.y+28){
            plateDown3=true;
        }else{
            plateDown3=false;
        }

        if(player.body.x>=pPlate4.x&&player.body.x<=pPlate4.x+32&&player.body.y>=pPlate4.y&&player.body.y<=pPlate4.y+28){
            plateDown4=true;
        }else{
            plateDown4=false;
        }

        if(plateDown3&&plateDown4){
            bothDown2=true;
        }

        if(player.body.x>=pPlate5.x&&player.body.x<=pPlate5.x+32&&player.body.y>=pPlate5.y&&player.body.y<=pPlate5.y+28){
            plateDown5=true;
        }

        if(plateDown5){
            this.add.tween(ladder[0]).to({ y:280+50},200, Phaser.Easing.Linear.None, true);
        }

        //lower water tweening
        if(bothDown2){
            this.add.tween(water1).to( { y:1205+260 }, 1000, Phaser.Easing.Linear.None, true);
            //boxArray[5].body.y=water1.y;
            //boxArray[6].body.y=water1.y;
            boxArray[5].body.y=20000;
            boxArray[6].body.y=20000;

        }else{
            this.add.tween(water1).to( { y:1405-260 }, 1000, Phaser.Easing.Linear.None, true);
            boxArray[5].body.y=water1.y;
            boxArray[6].body.y=water1.y;
        }

        //door teleport thing
        if(bothDown&&(player.body.x>=door.x&&player.body.x<=door.x+32&&player.body.y>=door.y&&player.body.y<=door.y+84)){
            inCutsceneDoor1 = true;
        }
        //second door teleport thing
        if(bothDown2&&(player.body.x>=door3.x&&player.body.x<=door3.x+32&&player.body.y>=door3.y&&player.body.y<=door3.y+84)){
            player.body.x=door4.x;
            player.body.y=door4.y;
        }

        if(!paused){
            this.pausePanel.y = this.camera.y-100;
            this.pausePanel.update();    

            this.moveKill(moveKillObj[0],5250,5650,'400',4000,'+57');
            this.moveKill(moveKillObj[1],6250,7250,'1000',4000,'+57');
            this.moveKill(moveKillObj[4],4870,5500, '630',3000,'+57');
            this.moveKill(moveKillObj[5],15300,15730,'430',3000,'+57');
            this.moveKill(moveKillObj[6],14850,15300,'450',3000,'+57');
            //this.moveKill(moveKillObj[5],15630,15300,'-330',3000,'+57');
            
            //stationary move kill rotation tween;           
            this.add.tween(moveKillObj[2]).to({angle: '+57'}, 1, Phaser.Easing.Linear.None, true, 100);
            this.add.tween(moveKillObj[3]).to({angle: '+57'}, 1, Phaser.Easing.Linear.None, true, 100);
        //Check the collision bounds for stationary sawblade
            if((player.body.x >= moveKillObj[2].x-50 && player.body.x <= moveKillObj[2].x+100-50 && player.body.y >= moveKillObj[2].y-50 && player.body.y <= moveKillObj[2].y+100-50) || 
                (player.body.x >= moveKillObj[3].x-50 && player.body.x <= moveKillObj[3].x+100-50 && player.body.y >= moveKillObj[3].y-50 && player.body.y <= moveKillObj[3].y+100-50)){
                //console.log('DEAD');
                this.endGame();   
            }
        }
        //check if in bounds of ladder
        if(pushButton.isDown && (this.ladderUpdater(ladder[0])))
        {
            callStand = true;
            ifCanJump=false;
            console.log("on ladder");
            player.body.data.gravityScale=0.05;
            onLadder=true;
        }
        else{
            if (callStand){
                if (cursors.left.isDown){
                    player.animations.play('left');
                }else{
                    player.animations.play('right');
                }
                callStand = false;
            }
            
            player.body.data.gravityScale=1;
            onLadder=false;
        }

        //check if on rightBelt
        if(player.body.x >=2060 && player.body.x<=2404 && player.body.y>=1600 && player.body.y<=1670){
            beltRightBool = true;
        }else if((player.body.x >=4780 && player.body.x<=5600 && player.body.y>=1500 && player.body.y<=1700)||
            (player.body.x>=15200-415 && player.body.x<=15200+405 && player.body.y>=607-180 && player.body.y<=607-48)){
            beltLeftBool = true;
        }
        else{
            beltRightBool = false;
            beltLeftBool = false;
            touchdown = false;
        }

        //CHECK IF IN WATER -- This must be modified is water's position is modified...
        if((player.body.x >= water.x && player.body.x <= water.x+400 && player.body.y >= water.y && player.body.y <= water.y+1000) ||
            (player.body.x >= water1.x && player.body.x <= water1.x+400 && player.body.y >= water1.y && player.body.y <= water1.y+1000)){
          //  console.log("inwater");
            inWater = true;
           // this.physics.p2.gravity.y = 200;
          player.body.data.gravityScale=20;
          ifCanJump=false;
            /*if(counter == 0){
                player.body.velocity.y = 0;
                player.body.velocity.y = 0;
            }
            counter++;
            if(counter%100 == 0)
                this.physics.p2.gravity.y*=-1;*/
        }
        else{
           // player.body.data.gravityScale=1;
            //console.log("notinwater");
            inWater = false;
            this.physics.p2.gravity.y = 500;
            counter = 0;
        }
      
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if(paused || inWater)
            player.body.velocity.y = 0;

        //Control Player Movement;
        if (!paused && !inWater && !inCutsceneDoor1 && !gameStart){
            if (cursors.left.isDown)
            {
                player.body.moveLeft(200+godmode);

                if (facing != 'left')
                {
                    player.animations.play('left');
                    facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.moveRight(200+godmode);

                if (facing != 'right')
                {
                    player.animations.play('right');
                    facing = 'right';
                }
            }
            else if(ifCanJump)
            {
                player.body.velocity.x = 0;

                if (facing != 'idle')
                {
                    player.animations.stop();

                    if (facing == 'left')
                    {
                        player.frame = 14;
                    }
                    else
                    {
                        player.frame = 13;
                    }

                    facing = 'idle';
                }
            }
            else if(ifCanJump){
                if (facing == 'left')
                {
                    player.frame = 14;
                }
                else
                {
                    player.frame = 13;
                }
            }

            if (jumpButton.isDown && ifCanJump){
                player.body.moveUp(300+godmode);
                ifCanJump = false;
            }

            // moving a Box-----------------------------
            if (pushButton.isDown && cursors.right.isDown) {
                //onGround = false;
                if (checkCreated < 1){
                    //onGround = false;
                    plateBox.body.destroy();
                    plateBox.kill();
                    this.createBox( boxX, boxY, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
                    checkCreated++;
                }
                while (pushButton.isUp || cursors.right.isUp){
                    plateBox.body.static = true;
                    boxX = plateBox.body.x;
                    boxY = plateBox.body.y;
                    checkCreated =0;
                    //playerbox =false;                   
                }
            }else{
                plateBox.body.static = true;
                boxX = plateBox.body.x;
                boxY = plateBox.body.y;
                checkCreated =0;
                //playerbox =false;
                
            }

            if (pushButton.isDown && cursors.left.isDown) {
                //onGround = false;
                if (checkCreated < 1){
                    //onGround = false;
                    plateBox.body.destroy();
                    plateBox.kill();
                    this.createBox( boxX, boxY, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
                    checkCreated++;
                }
                while (pushButton.isUp || cursors.left.isUp){
                    plateBox.body.static = true;
                    boxX = plateBox.body.x;
                    boxY = plateBox.body.y;
                    checkCreated =0;
                    //playerbox =false;                   
                }
            }

            // moving a Box2-----------------------------
            if (pushButton.isDown && cursors.right.isDown) {
                //onGround = false;
                if (checkCreated2 < 1){
                    //onGround = false;
                    plateBox2.body.destroy();
                    plateBox2.kill();
                    this.createBox2( box2X, box2Y, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
                    checkCreated2++;
                }
                while (pushButton.isUp || cursors.right.isUp){
                    plateBox2.body.static = true;
                    box2X = plateBox2.body.x;
                    box2Y = plateBox2.body.y;
                    checkCreated2 =0;
                    //playerbox =false;                   
                }
            }else{
                plateBox2.body.static = true;
                box2X = plateBox2.body.x;
                box2Y = plateBox2.body.y;
                checkCreated2 =0;
                //playerbox =false;
                
            }

            if (pushButton.isDown && cursors.left.isDown) {
                onGround = false;
                if (checkCreated2 < 1){
                    onGround = false;
                    plateBox2.body.destroy();
                    plateBox2.kill();
                    this.createBox2( box2X, box2Y, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
                    checkCreated2++;
                }
                while (pushButton.isUp || cursors.left.isUp){
                    plateBox2.body.static = true;
                    box2X = plateBox2.body.x;
                    box2Y = plateBox2.body.y;
                    checkCreated2 =0;
                    //playerbox =false;                   
                }
            }
            //end moving Boxes-----------------------------------------
        }

        if (!paused && inWater){
            player.animations.play('climb');
            if (cursors.left.isDown)
            {
                player.body.moveLeft(200+godmode);
                if (facing != 'left')
                {
                    player.animations.play('left');
                    facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.moveRight(200+godmode);
                if (facing != 'right')
                {
                    player.animations.play('right');
                    facing = 'right';
                }
            }
            if (cursors.up.isDown && !inWater)
            {
                player.body.moveUp(200+godmode);
            }
            else if (cursors.down.isDown)
            {
                player.body.moveDown(200+godmode);
            }
        }
        //if on rightBelt
        if (!paused && touchdown && beltRightBool){
            if (cursors.left.isDown)
            {
                player.body.moveLeft(50+godmode);

                if (facing != 'left')
                {
                    player.animations.play('left');
                    facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.moveRight(400+godmode);

                if (facing != 'right')
                {
                    player.animations.play('right');
                    facing = 'right';
                }
            }
            else if(ifCanJump)
            {
                player.body.velocity.x = 62;

                if (facing != 'idle')
                {
                    player.animations.stop();

                    if (facing == 'left')
                    {
                        player.frame = 14;
                    }
                    else
                    {
                        player.frame = 13;
                    }

                    facing = 'idle';
                }
            }
            else if(ifCanJump){
                if (facing == 'left')
                {
                    player.frame = 14;
                }
                else
                {
                    player.frame = 13;
                }
            }

            if (jumpButton.isDown && ifCanJump){
                player.body.moveUp(300+godmode);
                ifCanJump = false;
            }
        }
                //if on leftBelt
       if (!paused && touchdown && beltLeftBool){
            if (cursors.left.isDown)
            {
                player.body.moveLeft(400+godmode);

                if (facing != 'left')
                {
                    player.animations.play('left');
                    facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.moveRight(50+godmode);

                if (facing != 'right')
                {
                    player.animations.play('right');
                    facing = 'right';
                }
            }
            else if(ifCanJump)
            {
                player.body.velocity.x = -68.5;

                if (facing != 'idle')
                {
                    player.animations.stop();

                    if (facing == 'left')
                    {
                        player.frame = 14;
                    }
                    else
                    {
                        player.frame = 13;
                    }

                    facing = 'idle';
                }
            }
            else if(!ifCanJump){
                if (facing == 'left')
                {
                    player.frame = 14;
                }
                else
                {
                    player.frame = 13;
                }
            }

            if (jumpButton.isDown && ifCanJump){
                player.body.moveUp(300+godmode);
                ifCanJump = false;
            }

        }

        if (!paused && touchdown && beltLeftBool && onLadder){
            if(cursors.up.isDown){
                player.animations.play('climb');
                player.body.moveUp(80);
            }
            else if(cursors.down.isDown){
                player.animations.play('climb');
                player.body.moveDown(80);
            }
            else
                player.animations.stop();
        }

        if(!paused && !inWater && onLadder && !gameEnd && !gameStart){
            if(cursors.up.isDown){
                player.animations.play('climb');
                player.body.moveUp(80);
            }
            else if(cursors.down.isDown){
                player.animations.play('climb');
                player.body.moveDown(80);
            }
            else
                player.animations.stop();
        }
        //-----------------------player moveKill
        //if (player.body.x >= 226){
        //}


        //-----------------------player Kill zone
        if (player.body.y >= 1850+200){
            this.endGame();
        }

        //-------------------cutscnees
        if(inCutsceneDoor1){
            if(cutsceneFlag.x == 0){    
                this.add.tween(cutsceneFlag).to( { x: 100 }, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(blacker).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            }
            if(cutsceneFlag.x == 100){
                player.body.x = door2.x;
                player.body.y = door2.y;
                this.add.tween(cutsceneFlag).to( { x: 200 }, 1000, Phaser.Easing.Linear.None, true);
            }
            if(cutsceneFlag.x == 200){
                inCutsceneDoor1 = false;
                this.add.tween(cutsceneFlag).to( { x: 0 }, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(blacker).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
            }
        }
        if(gameStart){
            if(cutsceneFlag.x == 0){
                player.animations.play('right_idle');
                this.add.tween(cutsceneFlag).to( { x: '+50' }, 3000, Phaser.Easing.Linear.None, true);
                this.add.tween(intro).to( { y: '-500' }, 1000, Phaser.Easing.Linear.None, true);
            }
            if(cutsceneFlag.x == 50){
                this.add.tween(cutsceneFlag).to( { x: '+50' }, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(blacker).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(intro).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            }
            if(cutsceneFlag.x == 100){
                player.animations.play('right_idle');
                this.add.tween(cutsceneFlag).to( { x: '+100' }, 400, Phaser.Easing.Linear.None, true);
            }
            if(cutsceneFlag.x>= 150 && cutsceneFlag.x<200){
                player.animations.play('right');
                player.body.moveRight(100);
            }
            if(cutsceneFlag.x == 200){
                player.animations.play('right_idle');
                this.add.tween(cutsceneFlag).to( { x: '+100' }, 2000, Phaser.Easing.Linear.None, true);
                this.add.tween(starcut).to( { x: 675*2 }, 4000, Phaser.Easing.Linear.None, true);
                this.add.tween(starcut).to( { y: 1389/2 }, 4000, Phaser.Easing.Linear.None, true);
                this.add.tween(starcut).to( { angle: '+1500' }, 4000, Phaser.Easing.Linear.None, true);
            }
            if(cutsceneFlag.x == 300){
                starcut.x = 0;
                starcut.y = 0;
                gameStart = false;
                this.add.tween(cutsceneFlag).to({ x: 0 }, 1, Phaser.Easing.Linear.None, true);
            }
        }

    },


// correct the endGame function
    endGame: function(){
        this.music.stop();
        plateDown5=false;
        bothDown2=false;
        bothDown=false;
        this.state.start('level1gg');
    },
    nextLevel: function(){
        this.music.stop();
        this.state.start('level2');
    },
    restartLevel: function(){
        this.music.stop();
        this.state.start('level1');
    },
    mainMenu: function(){
        this.music.stop();
        this.state.start('mainmenu');
    }
};
var PausePanel = function(game, parent){
    //Super call to Phaser.group
    Phaser.Group.call(this, game, parent);

    this.btnPlay = this.game.add.button(20,20,'continue',function(){
        this.game.state.getCurrentState().playGame()
    },this);
    this.add(this.btnPlay);

    //place it out of bounds
    this.x = 655;
    this.y = -100;
    
    btnRestart = this.game.add.button(350,-225,'restart',function(){
        //this.game.state.restart(true,true);
        this.game.state.start('level1');
    },this);

    btnHelpScreen = this.game.add.button(150,-500,'helpscn',function(){
        this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y-600}, 200, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnRestart).to({y:this.game.camera.y+175}, 500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(btnHelp).to({y:this.game.camera.y+250}, 500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(btnQuit).to({y:this.game.camera.y+325}, 500, Phaser.Easing.Bounce.Out, true);
    },this);

    btnHelp = this.game.add.button(350,-150,'help',function(){
        this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y+50}, 500, Phaser.Easing.Bounce.Out, true);
        this.game.add.tween(btnRestart).to({y:this.game.camera.y-225}, 200, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelp).to({y:this.game.camera.y-150}, 200, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnQuit).to({y:this.game.camera.y-75}, 200, Phaser.Easing.Linear.NONE, true);
    },this);

    btnQuit = this.game.add.button(350,-75,'quit',function(){
        this.game.state.start('mainmenu');
    },this);
};

PausePanel.prototype = Object.create(Phaser.Group.prototype);
PausePanel.constructor = PausePanel;

PausePanel.prototype.show = function(){
    this.game.add.tween(this).to({y:this.game.camera.y+0}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnRestart).to({y:this.game.camera.y+175}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnHelp).to({y:this.game.camera.y+250}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnQuit).to({y:this.game.camera.y+325}, 500, Phaser.Easing.Bounce.Out, true);
    
    this.game.add.tween(this).to({alpha:1}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnRestart).to({alpha:1}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelp).to({alpha:1}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnQuit).to({alpha:1}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelpScreen).to({alpha:1}, 1, Phaser.Easing.Linear.NONE, true);
};
PausePanel.prototype.update = function(){
    if(!paused){
        this.game.add.tween(btnRestart).to({x:this.game.camera.x+350}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelp).to({x:this.game.camera.x+350}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnQuit).to({x:this.game.camera.x+350}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelpScreen).to({x:this.game.camera.x+150}, 1, Phaser.Easing.Linear.NONE, true);
        //for Y-axis
        this.game.add.tween(btnRestart).to({y:this.game.camera.y-225}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelp).to({y:this.game.camera.y-150}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnQuit).to({y:this.game.camera.y-75}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y-600}, 1, Phaser.Easing.Linear.NONE, true);
        //for transpaceny        
        this.game.add.tween(btnHelpScreen).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(this).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnRestart).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnHelp).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(btnQuit).to({alpha:0.50}, 1, Phaser.Easing.Linear.NONE, true);
    }
}

PausePanel.prototype.hide = function(){
    this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y-500}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(this).to({y:this.game.camera.y-100}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnRestart).to({y:this.game.camera.y-225}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelp).to({y:this.game.camera.y-150}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnQuit).to({y:this.game.camera.y-75}, 200, Phaser.Easing.Linear.NONE, true);
    
    this.game.add.tween(btnHelpScreen).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(this).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnRestart).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelp).to({alpha:0}, 1, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnQuit).to({alpha:0.50}, 1, Phaser.Easing.Linear.NONE, true);
};

