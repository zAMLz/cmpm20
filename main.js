// Phaser this File
//var this = new Phaser.this(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//-----------Game Variables---------
var player;
var cursors;
var water;
var inWater=false;
var onLadder=false;
var playerCollisionGroup;
var BoxCollisionGroup;
var isJumpCollisionGroup;
var killCollisionGroup;
var counter = 0;
var callStand = false;
var gameEnd=false;
var gameStart=true;

//-------------OBJECTS---------------
var boulder;
var killObj;
var badboulder;
var BBnotcreated = true;
var index;
var star;
var ladder;
var cutsceneFlag;
var emitter = new Array();
var blacker;
var redder;
var starcut;
var intro;

//-------------Boxes------------------
var checkCreated = 0;
var Box;
var boxX;
var boxY;
var onGround = true;
var playerbox = true;
//----------Player Control Variables---
var facing = 'right';
var jumpButton;
var ifCanJump = false;
var num1;
var num2;
var num3;
var num4;
var num5;
//------------TESTING PURPOSES
var isDebug = false;
var godmode = 0;

//----------Pause Control-----------
var paused;
var pausePanel;
var mehSpeed;

Game.main = function(game){
    this.music=null;
}
Game.main.prototype={

    terraincreator: function(image,x,y,playerCollisionGroup,isJumpCollisionGroup, BoxCollisionGroup, realTerrain){
        isDebug = false;
        var terrain = this.add.sprite(x, y,image); //creates the sprite
        this.physics.p2.enableBody(terrain,isDebug);    //enables physics on it
        if(realTerrain){
            terrain.body.clearShapes();
            terrain.body.loadPolygon('physicsdataforest',image);
        }
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        terrain.body.setCollisionGroup(isJumpCollisionGroup);
        terrain.body.collides([isJumpCollisionGroup, playerCollisionGroup, killCollisionGroup, winCollisionGroup, BoxCollisionGroup]);
        terrain.body.static = true;                  //disables gravity for itself...
        terrain.body.fixedRotation = true;           //fixes rotation?
    },

    createKillObj: function(x, y, index, playerCollisionGroup, killCollisionGroup){
        killObj = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(killObj,isDebug);
        killObj.body.static = true;
        killObj.body.fixedRotation = true;
        killObj.body.setCollisionGroup(killCollisionGroup);
        killObj.body.collides([playerCollisionGroup]);
    },

    ladderUpdater: function(ladd){
        if((player.body.x >= ladd.x && player.body.x <= ladd.x+20 && player.body.y >= ladd.y && player.body.y <= ladd.y+150))
            return true;
        else
            return false;
    },

    groundcreator: function(x,y,xs,ys){
        var ground = this.add.sprite(x, y, 'ground');
        ground.scale.setTo(xs,ys);//set the scale
        this.physics.p2.enableBody(ground,isDebug);    //enables physics on it
        ground.body.static = true;                  //disables gravity for itself...
        ground.body.fixedRotation = true;           //fixes rotation?
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        ground.body.setCollisionGroup(isJumpCollisionGroup);
        ground.body.collides([isJumpCollisionGroup, playerCollisionGroup,winCollisionGroup]);
    },

    createfire: function(tempFire,speedX, speedY, fireX, fireY){
        var px = speedX;
        var py = speedY;



        px *= -1;
        py *= -1;

        tempFire.minParticleSpeed.set(px, py);
        tempFire.maxParticleSpeed.set(px, py);

        tempFire.emitX = fireX;
        tempFire.emitY = fireY;
    },

    createEmitter: function(i){
        emitter[i] = this.add.emitter(this.world.centerX, this.world.centerY, 300);
        emitter[i].makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
        emitter[i].gravity = -50;
        emitter[i].setAlpha(1, 0, 3000);
        emitter[i].setScale(0.3, 0, 0.3, 0.3, 5000);
        emitter[i].start(false, 5000, 1);
    },

    create: function() {
        gameStart=true;
        //adds music
        this.music = this.add.audio('tutorialmusic');
        this.music.play();

        //changes bounds of the world and add a background for the world
        this.world.setBounds(0,0,5790,2800);
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

        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.physics.p2.updateBoundsCollisionGroup();

       

        this.terraincreator('terr1-1',400,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',400,2200,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-2',1200,1300,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',1200,1900,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-3',2000,1527,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',2000,2057,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-4',2800,1595,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',2800,2195,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-b',3196,2195,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        //water pool happens then more terrain
        this.groundcreator(4665,1198,0.15,12);// Look at comments in Maze section
        this.terraincreator('terr1-5',3950,1527,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',4000,2127,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-b2',3605,2127,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-6',4750,1350,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',4750,1950,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-7',5550,1470,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',5550,2070,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);

        //Add a forsure kill player object
        this.createKillObj(2298, 1582, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2333, 1582, 'blank', playerCollisionGroup, killCollisionGroup);

        this.createKillObj(2530, 1657, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2555, 1685, 'blank', playerCollisionGroup, killCollisionGroup);


        this.createKillObj(2638, 1770, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2658, 1790, 'blank', playerCollisionGroup, killCollisionGroup);
		
		this.createKillObj(2750,1824, 'blank', playerCollisionGroup, killCollisionGroup);
		this.createKillObj(2775,1824, 'blank', playerCollisionGroup, killCollisionGroup);

        this.createKillObj(2883, 1840, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2913, 1840, 'blank', playerCollisionGroup, killCollisionGroup);

        //Safe Boulder, used for jumping off the ground.
        boulder = this.add.sprite(1300,128,'boulder');
        this.physics.p2.enableBody(boulder,isDebug);
        boulder.body.clearShapes();
        boulder.body.setCircle(50);
        boulder.body.data.gravityScale=4;
        boulder.body.setCollisionGroup(isJumpCollisionGroup);
        boulder.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        //if the player collides with the star next level starts
        star = this.add.sprite(5720,1018,'letter');
        starcut = this.add.sprite(92,1680,'letter');
        this.physics.p2.enableBody(star, isDebug);
        star.body.setCollisionGroup(winCollisionGroup);
        star.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        cutsceneFlag = this.add.sprite(0,0,'star');

        //climbable tree
        ladder = new Array();
        ladder[0] = this.add.sprite(560, 1520,'ladder');
        ladder[1] = this.add.sprite(500, 1400, 'ladder');
        ladder[2] = this.add.sprite(580, 1300, 'ladder');
        ladder[3] = this.add.sprite(3250, 1600, 'ladder');
        ladder[4] = this.add.sprite(3325, 1525, 'ladder');
        ladder[5] = this.add.sprite(3400, 1450, 'ladder');
        ladder[6] = this.add.sprite(3565, 1430, 'ladder');
        ladder[7] = this.add.sprite(3575, 1300, 'ladder');
        ladder[8] = this.add.sprite(3450, 1310, 'ladder');
        ladder[9] = this.add.sprite(3200, 1465, 'ladder');
        ladder[10] = this.add.sprite(3125, 1375, 'ladder');
        ladder[11] = this.add.sprite(1100, 1170, 'ladder');
        ladder[12] = this.add.sprite(2030, 1420, 'ladder');
        ladder[13] = this.add.sprite(2030, 1270, 'ladder');
        //MAZE LADDERS and GROUNDS
        ladder[14] = this.add.sprite(3850 ,1334-300 ,'ladder');
        ladder[15] = this.add.sprite(3950 ,1334-225 ,'ladder');
        ladder[16] = this.add.sprite(4050 ,1334-150 ,'ladder');
        ladder[17] = this.add.sprite(3950 ,1109-175 ,'ladder');
        ladder[18] = this.add.sprite(3950 ,1109-175-150 ,'ladder');
        ladder[19] = this.add.sprite(4150 ,1334-225 ,'ladder');

        this.groundcreator(4100,1109-10,1,0.5);
        this.groundcreator(4200,1000,0.15,6);
        this.groundcreator(4300,900,1.5,1);
        this.groundcreator(4300,1200,0.5,0.5);

        
        ladder[20] = this.add.sprite(4310 ,1000 ,'ladder');
        ladder[21] = this.add.sprite(4410 ,1100 ,'ladder');
        ladder[22] = this.add.sprite(4400 , 900 ,'ladder');
        ladder[23] = this.add.sprite(4475 ,950,'ladder');
        ladder[24] = this.add.sprite(4475 ,950-125 ,'ladder');

        this.groundcreator(4605,948,0.05,4);
        this.groundcreator(4665,998,0.35,1);
        //this.groundcreator(4665,1198,0.15,12); this ground is actually printed out before the terrain so the terrain has priority layering
        this.groundcreator(0,0,0,0);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135-32, 1347, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5135, 1347, 'blank', playerCollisionGroup, killCollisionGroup);

        ladder[25] = this.add.sprite(4575 , 950 ,'ladder');
        ladder[26] = this.add.sprite(4885 , 958 ,'ladder');

        this.groundcreator(5200,1058,0.75,1);
        this.createKillObj(5331-32-32-32-32-32-32-32-32-10, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32-32-32-32-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32-32-32-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32-32-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5331, 1030, 'blank', playerCollisionGroup, killCollisionGroup);

        ladder[27] = this.add.sprite(4950 ,1075 ,'ladder');
        ladder[28] = this.add.sprite(5050 ,1175 ,'ladder');
        ladder[29] = this.add.sprite(5150 ,1075 ,'ladder');
        ladder[30] = this.add.sprite(5250 ,1175 ,'ladder');
        ladder[31] = this.add.sprite(5350 ,1025 ,'ladder');
        
        this.groundcreator(5600,1058,0.75,1)
        this.createKillObj(5664-32-32-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5664-32-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5664-32-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5664-32-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(5664-32-32, 1030, 'blank', playerCollisionGroup, killCollisionGroup);

        ladder[32] = this.add.sprite(4975 ,850 ,'ladder');
        ladder[33] = this.add.sprite(5075 ,750 ,'ladder');
        ladder[34] = this.add.sprite(5175 ,850 ,'ladder');
        ladder[35] = this.add.sprite(5275 ,750 ,'ladder');
        ladder[36] = this.add.sprite(5375 ,850 ,'ladder');
        ladder[37] = this.add.sprite(5475 ,750 ,'ladder');
        

        num1 = this.input.keyboard.addKey(Phaser.Keyboard.ONE);
        num2 = this.input.keyboard.addKey(Phaser.Keyboard.TWO);
        num3 = this.input.keyboard.addKey(Phaser.Keyboard.THREE);
        num4 = this.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        num5 = this.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        // The player aanimations and position
        player = this.add.sprite(32, 1680, 'courier');
        //player = this.add.sprite(4625, 949, 'courier');
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
        player.body.collides(winCollisionGroup, function(){gameEnd=true;},this);
        player.body.collides(BoxCollisionGroup,function(){playerbox = true; ifCanJump = true;},this)

        boulder = this.add.sprite(0,0,'boulder');
        water = this.add.sprite(3200,1850,'water1-1'); //Note this has no interactions with the inWater function
        this.add.tween(water).to({alpha:0.95}, 1, Phaser.Easing.Linear.NONE, true);//Transparency

        //sets camera to follow
        this.camera.follow(player,this.camera.FOLLOW_PLATFORMER);

        //Add water after adding the player so that way, water is layered ontop of the player

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
        this.playGame();

        //fire
        //this.physics.startSystem(Phaser.Physics.ARCADE);
        //this.createEmitter(1);
        //fire 2
        emitter[2] = this.add.emitter(this.world.centerX, this.world.centerY, 300);
        emitter[2].makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
        emitter[2].gravity = -500;
        emitter[2].setAlpha(1, 0, 2000);
        emitter[2].setScale(0.3, 0.3, 0.3, 0, 5000);
        emitter[2].start(false, 3000, 5);

        //fire3
        /*this.createEmitter(3);
        //fire4
        this.createEmitter(4);
        //fire5
        this.createEmitter(5);

        //after the "1" fire
        //this.createEmitter(6);
        this.createEmitter(7);
        //this.createEmitter(8);
        this.createEmitter(9);
        //this.createEmitter(10);
        this.createEmitter(11);
        //this.createEmitter(12);
        this.createEmitter(13);
        //this.createEmitter(14);
        this.createEmitter(15);
        //after fire"3"
        //this.createEmitter(16);
        this.createEmitter(17);
        //this.createEmitter(18);
        this.createEmitter(19);
        //this.createEmitter(20);
        //after fire"4"
        //this.createEmitter(21);
        this.createEmitter(22);
        //this.createEmitter(23);
        this.createEmitter(24);
        //after fire "5"
        //this.createEmitter(25);
        this.createEmitter(26);
        //this.createEmitter(27);
        this.createEmitter(28);
        //this.createEmitter(29);
        this.createEmitter(30);
        //this.createEmitter(31);
        this.createEmitter(32);
        */

        redder = this.add.sprite(this.camera.x-50,this.camera.y-50,'red');
        blacker = this.add.sprite(0,1378,'black');
        intro = this.add.sprite(0,1378+600,'introforest');
        this.game.add.tween(redder).to({alpha:0.50}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(blacker).to({alpha:0.9}, 1, Phaser.Easing.Linear.NONE, true)
    },

    badbouldercreate: function(){
        if(BBnotcreated){
            BBnotcreated=false;
            this.physics.p2.enableBody(boulder,isDebug);
            boulder.body.x = 2064;
            boulder.body.y = 1400;
            boulder.body.clearShapes();
            boulder.body.setCircle(50);
            boulder.body.setCollisionGroup(killCollisionGroup);
            boulder.body.collides([isJumpCollisionGroup, playerCollisionGroup]);
            boulder.body.moveRight(200);
            //Need to create water after this event, so that way the boulder happens to be behind the layer.
        }
    },

    pauseGame: function(){
        if(!paused){
            paused = true;
            this.pausePanel.show();
            this.camera.unfollow();
            this.physics.p2.gravity.y = 0;
            player.body.data.gravityScale=0.05;
            player.body.velocity.x=0;
            player.body.velocity.y=0;
        }
    },

    playGame: function(){
        if(paused){
            paused = false;
            this.pausePanel.hide();
            this.camera.follow(player,this.camera.FOLLOW_PLATFORMER);
            this.physics.p2.gravity.y = 500;
            player.body.data.gravityScale=1;
        }
    },


    update: function() {
        console.log(gameStart);
        //console.log("x:"+this.camera.x);
        //console.log("y:"+this.camera.y);
        console.log("x:"+player.body.x);
        console.log("y:"+player.body.y);

        if (num1.isDown){
            player.body.x = 1230;
            player.body.y = 1200;
        }
        if (num2.isDown){
            player.body.x = 2205;
            player.body.y = 1575;
        }
        if (num3.isDown){
            player.body.x = 3790;
            player.body.y = 1330;
        }
        if (num4.isDown){
            player.body.x = 4653;
            player.body.y = 950;
        }
        if (num5.isDown){
            player.body.x = 5653;
            player.body.y = 1010;
        }

        //  To move the UI along with the camera
        this.btnPause.x = this.camera.x+675;
        this.btnPause.y = this.camera.y+20;
        this.pausePanel.x = this.camera.x+655;
        //this.game.add.tween(blacker).to({x:this.game.camera.x}, 1, Phaser.Easing.Linear.NONE, true);
        //this.game.add.tween(blacker).to({y:this.game.camera.y}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(redder).to({x:this.game.camera.x-50}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(redder).to({y:this.game.camera.y-50}, 1, Phaser.Easing.Linear.NONE, true);
        this.game.add.tween(redder).to({alpha:0.4*(player.body.x/5790)}, 1, Phaser.Easing.Linear.NONE, true);
        if(!paused){
                this.pausePanel.y = this.camera.y-100;
                this.pausePanel.update();
        }

        //check if in bounds of ladder
        if(pushButton.isDown && (this.ladderUpdater(ladder[0]) || this.ladderUpdater(ladder[1])|| this.ladderUpdater(ladder[2])|| this.ladderUpdater(ladder[3])|| 
        this.ladderUpdater(ladder[4])|| this.ladderUpdater(ladder[5])|| this.ladderUpdater(ladder[6])|| this.ladderUpdater(ladder[7])|| this.ladderUpdater(ladder[8])|| 
        this.ladderUpdater(ladder[9])|| this.ladderUpdater(ladder[10])|| this.ladderUpdater(ladder[11])|| this.ladderUpdater(ladder[12])|| this.ladderUpdater(ladder[13])|| 
        this.ladderUpdater(ladder[14])|| this.ladderUpdater(ladder[15])|| this.ladderUpdater(ladder[16])|| this.ladderUpdater(ladder[17])|| this.ladderUpdater(ladder[18])|| 
        this.ladderUpdater(ladder[19])|| this.ladderUpdater(ladder[20])|| this.ladderUpdater(ladder[21])|| this.ladderUpdater(ladder[22])|| this.ladderUpdater(ladder[23])|| 
        this.ladderUpdater(ladder[24])|| this.ladderUpdater(ladder[25])|| this.ladderUpdater(ladder[26])|| this.ladderUpdater(ladder[27])|| this.ladderUpdater(ladder[28])|| 
        this.ladderUpdater(ladder[29])|| this.ladderUpdater(ladder[30])|| this.ladderUpdater(ladder[31])|| this.ladderUpdater(ladder[32])|| this.ladderUpdater(ladder[33])|| 
        this.ladderUpdater(ladder[34])|| this.ladderUpdater(ladder[35])|| this.ladderUpdater(ladder[36])|| this.ladderUpdater(ladder[37])))
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

        //PREVENT WALL JUMPERS
        if((player.body.x >= 590 && player.body.x <= 590+50 && player.body.y >= 1400 && player.body.y <= 1640) ||
           (player.body.x >= 1140 && player.body.x <= 1140+50 && player.body.y >= 1235 && player.body.y <= 1370) ||
           (player.body.x >= 2070 && player.body.x <= 2070+50 && player.body.y >= 1574 && player.body.y <= 1676) ||
           (player.body.x >= 3585 && player.body.x <= 3585+50 && player.body.y >= 1349 && player.body.y <= 1849))
            ifCanJump=false;

        //CHECK OTHER ING GAME EVENTS HERE
        //1. DEATH BOULDER
        if(player.body.x>2429)
            this.badbouldercreate();
        //CHECK IF IN WATER -- This must be modified is water's position is modified...
        if(player.body.x >= 3200 && player.body.x <= 3200+400 && player.body.y >= 1850 && player.body.y <= 1850+1000){
            console.log("inwater");
            inWater = true;
           // this.physics.p2.gravity.y = 200;
          //player.body.data.gravityScale=20;
          ifCanJump=false;
            if(counter == 0){
                this.physics.p2.gravity.y = 150;
            }
            counter++;
            if(counter%10 == 0)
                this.physics.p2.gravity.y*=1.2;
        }
        else{
           // player.body.data.gravityScale=1;
           // console.log("notinwater");
            inWater = false;
            this.physics.p2.gravity.y = 500;
            counter = 0;
        }


        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if(paused || inWater)
            player.body.velocity.y = 0;

        //PLAYER CONTROL MOVEMENT
        if (!paused && !inWater && !onLadder && !gameEnd && !gameStart){
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

        }

        if (!paused && inWater && !onLadder && !gameEnd && !gameStart){
            player.animations.play('climb');
            if (cursors.left.isDown)
            {
                player.body.moveLeft(200+godmode);
            }
            else if (cursors.right.isDown)
            {
                player.body.moveRight(200+godmode);
            }
            if (cursors.up.isDown&&!inWater)
            {
                player.body.moveUp(200+godmode);
            }
            else if (cursors.down.isDown)
            {
                player.body.moveDown(200+godmode);
            }
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
        //----------------------CUTSCENEs IMAGINED...
        
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

        if(gameEnd){
            if(cutsceneFlag.x == 0 ){
                //star.body.destroy();
                star.kill();
                this.camera.unfollow();
                this.add.tween(cutsceneFlag).to( { x: '+100' }, 2500, Phaser.Easing.Linear.None, true);
                if(facing =='right')
                    player.animations.play('right_idle_letter');
                else
                    player.animations.play('left_idle_letter');
            }
            if(cutsceneFlag.x == 100){
                this.add.tween(cutsceneFlag).to( { x: '+100' }, 400, Phaser.Easing.Linear.None, true);
                player.animations.play('right');
                player.body.moveRight(200);
            }
            if(cutsceneFlag.x >100)
                player.body.moveRight(200);
            if(cutsceneFlag.x == 150)
                player.body.moveUp(300);
            if(cutsceneFlag.x == 200){
                this.nextLevel();
            }

        }

        //-----------------------player Kill zone
        if (player.body.y >= 1850+200){
            this.endGame();
        }

        //------------------ Fire EMitter
       // this.createfire(emitter[1], 0, 0, 4110, 1370);
        this.createfire(emitter[2], 0, 0, 2130, 1570);
        //this.createfire(emitter[3], 0, 0, 5070, 1055);
        //this.createfire(emitter[4], 0, 0, 5470, 1055);
        //this.createfire(emitter[5], 0, 0, 4730, 1370);
        //fire after "1"
        //this.createfire(emitter[6], 0, 0, 4110+50, 1370);
        /*this.createfire(emitter[7], 0, 0, 4110+50+50, 1370);
        //this.createfire(emitter[8], 0, 0, 4110+50+50+50, 1370);
        this.createfire(emitter[9], 0, 0, 4110+50+50+50+50, 1370);
        //this.createfire(emitter[10], 0, 0, 4110+50+50+50+50+50, 1370);
        this.createfire(emitter[11], 0, 0, 4110+50+50+50+50+50+50, 1370);
        //this.createfire(emitter[12], 0, 0, 4110+50+50+50+50+50+50+50, 1370);
        this.createfire(emitter[13], 0, 0, 4110+50+50+50+50+50+50+50+50, 1370);
        //this.createfire(emitter[14], 0, 0, 4110+50+50+50+50+50+50+50+50+50, 1370);
        this.createfire(emitter[15], 0, 0, 4110+50+50+50+50+50+50+50+50+50+50, 1370);
        //fire after "3"
        //this.createfire(emitter[16], 0, 0, 5070+50, 1055);
        this.createfire(emitter[17], 0, 0, 5070+50+50, 1055);
        //this.createfire(emitter[18], 0, 0, 5070+50+50+50, 1055);
        this.createfire(emitter[19], 0, 0, 5070+50+50+50+50, 1055);
        //this.createfire(emitter[20], 0, 0, 5070+50+50+50+50+50, 1055);
        //fire after "4"
        //this.createfire(emitter[21], 0, 0, 5470+50, 1055);
        this.createfire(emitter[22], 0, 0, 5470+50+50, 1055);
        //this.createfire(emitter[23], 0, 0, 5470+50+50+50, 1055);
        this.createfire(emitter[24], 0, 0, 5470+50+50+50+50, 1055);
        //fire afrer "5"
        //this.createfire(emitter[25], 0, 0, 4730+50, 1370);
        this.createfire(emitter[26], 0, 0, 4730+50+50, 1370);
        //this.createfire(emitter[27], 0, 0, 4730+50+50+50, 1370);
        this.createfire(emitter[28], 0, 0, 4730+50+50+50+50, 1370);
        //this.createfire(emitter[29], 0, 0, 4730+50+50+50+50+50, 1370);
        this.createfire(emitter[30], 0, 0, 4730+50+50+50+50+50+50, 1370);
        //this.createfire(emitter[31], 0, 0, 4730+50+50+50+50+50+50+50, 1370);
        this.createfire(emitter[32], 0, 0, 4730+50+50+50+50+50+50+50+50, 1370);
        */

        if (player.body.x >= 2130 && player.body.x <= 2159 && player.body.y <= 1585 && player.body.y >= 1360){
            this.endGame();
        }
        
    },

// correct the endGame function
    endGame: function(){
        gameStart=true;
        this.music.stop();
        this.state.start('gameover');
    },
    nextLevel: function(){
        gameStart=true;
        this.music.stop();
        this.state.start('level1');
    },
    restartLevel: function(){
        gameStart=true;
        this.music.stop();
        this.state.start('main');
    },
    mainMenu: function(){
        gameStart=true;
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
        //this.game.state.restart(false,false);
        gameStart=true;
        this.game.state.start('main');
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
        gameStart=true;
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
    }
}

PausePanel.prototype.hide = function(){
    this.game.add.tween(btnHelpScreen).to({y:this.game.camera.y-500}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(this).to({y:this.game.camera.y-100}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnRestart).to({y:this.game.camera.y-225}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelp).to({y:this.game.camera.y-150}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnQuit).to({y:this.game.camera.y-75}, 200, Phaser.Easing.Linear.NONE, true);
};

