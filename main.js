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

//-------------OBJECTS---------------
var boulder;
var badboulder;
var BBnotcreated = true;
var index;
var star;
var ladder;
var ladder1;
var ladder2;
var ladder3;
var ladder4;
var ladder5;
var ladder6;
var ladder7;
var ladder8;
var ladder9;
var ladder10;
var ladder11;
var ladder12;
var ladder13;



//-------------Boxes------------------
var checkCreated = 0;
var Box;
var boxX;
var boxY;
var onGround = true;
var playerbox = true;
//----------Player Control Variables---
var facing = 'left';
var jumpButton;
var ifCanJump = false;

//------------TESTING PURPOSES
var isDebug = false;
var godmode = 0;

//----------Pause Control-----------
var paused;
var pausePanel;
var mehSpeed;

//---------Other Variables---------
var score = 0;
var scoreText;
var diamond;
var diamond2;

//----------fire-------------
var sprite;
var emitter;
var emitter2;



Game.main = function(game){
    this.music=null;
}
Game.main.prototype={

    createBox: function(x, y, index, playerCollisionGroup, isJumpCollisionGroup,BoxCollisionGroup ){
        boxX = x;
        boxY = y;
        Box = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(Box);
        Box.body.friction = 100;
        Box.body.restitution = 0.0;
        Box.body.gravity = 500;
        Box.body.static = false;
        Box.body.fixedRotation = true;
        Box.body.setCollisionGroup(BoxCollisionGroup);
        Box.body.collides(isJumpCollisionGroup,function (){onGround = true;},this);
        Box.body.collides([playerCollisionGroup]);

    },

    terraincreator: function(image,x,y,playerCollisionGroup,isJumpCollisionGroup, BoxCollisionGroup, realTerrain){
        var terrain = this.add.sprite(x, y,image); //creates the sprite
        this.physics.p2.enableBody(terrain,isDebug);    //enables physics on it
        if(realTerrain){
            terrain.body.clearShapes();
            terrain.body.loadPolygon('physicsdata',image);
        }
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        terrain.body.setCollisionGroup(isJumpCollisionGroup);
        terrain.body.collides([isJumpCollisionGroup, playerCollisionGroup, killCollisionGroup, winCollisionGroup, BoxCollisionGroup]);
        terrain.body.static = true;                  //disables gravity for itself...
        terrain.body.fixedRotation = true;           //fixes rotation?
    },

    createKillObj: function(x, y, index, playerCollisionGroup, killCollisionGroup){
        diamond = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(diamond,isDebug);
        diamond.body.static = true;
        diamond.body.fixedRotation = true;
        diamond.body.setCollisionGroup(killCollisionGroup);
        diamond.body.collides([playerCollisionGroup]);
    },

    create: function() {
        //adds music
        this.music = this.add.audio('tutorialmusic');
        this.music.play();

        //changes bounds of the world and add a background for the world
        this.world.setBounds(0,0,10000,2800);
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
        this.terraincreator('terr1-5',3950,1527,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',4000,2127,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-b2',3605,2127,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-6',4750,1350,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',4750,1950,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);
        this.terraincreator('terr1-7',5550,1470,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('terr-null',5550,2070,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,false);

        //Add a forsure kill player object
        this.createKillObj(300, 1600-100, 'diamond', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2198, 1578, 'diamond', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2233, 1578, 'diamond', playerCollisionGroup, killCollisionGroup);

        this.createKillObj(2530, 1657, 'diamond', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2555, 1685, 'diamond', playerCollisionGroup, killCollisionGroup);


        this.createKillObj(2638, 1770, 'diamond', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2658, 1790, 'diamond', playerCollisionGroup, killCollisionGroup);

        this.createKillObj(2883, 1840, 'diamond', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(2913, 1840, 'diamond', playerCollisionGroup, killCollisionGroup);


        //create a moveable Boxs
        this.createBox(100, 1700, 'diamond',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);

        //Safe Boulder, used for jumping off the ground.
        boulder = this.add.sprite(1300,128,'boulder');
        this.physics.p2.enableBody(boulder,isDebug);
        boulder.body.clearShapes();
        boulder.body.setCircle(50);
        boulder.body.data.gravityScale=4;
        boulder.body.setCollisionGroup(isJumpCollisionGroup);
        boulder.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        //if the player collides with the star next level starts
        star = this.add.sprite(5800,100,'star');
        this.physics.p2.enableBody(star, isDebug);
        star.body.setCollisionGroup(winCollisionGroup);
        star.body.collides([isJumpCollisionGroup, playerCollisionGroup]);
        //climbable tree
        ladder = this.add.sprite(560, 1520,'ladder');
        ladder1 = this.add.sprite(500, 1400, 'ladder');
        ladder2 = this.add.sprite(580, 1300, 'ladder');
        ladder3 = this.add.sprite(3250, 1600, 'ladder');
        ladder4 = this.add.sprite(3325, 1525, 'ladder');
        ladder5 = this.add.sprite(3400, 1450, 'ladder');
        ladder6 = this.add.sprite(3565, 1430, 'ladder');
        ladder7 = this.add.sprite(3575, 1300, 'ladder');
        ladder8 = this.add.sprite(3450, 1310, 'ladder');
        ladder9 = this.add.sprite(3200, 1465, 'ladder');
        ladder10 = this.add.sprite(3125, 1375, 'ladder');
        ladder11 = this.add.sprite(1100, 1170, 'ladder');
        ladder12 = this.add.sprite(2030, 1450, 'ladder');
        ladder13 = this.add.sprite(2030, 1300, 'ladder');
        
        // The player aanimations and position
        player = this.add.sprite(32, 1600 - 150, 'dude');
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.physics.p2.enable(player);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;

        //Again we need to set the player to use the player collision group.
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides(isJumpCollisionGroup,function (){ifCanJump = true;},this);
        player.body.collides(killCollisionGroup, this.endGame, this);
        player.body.collides(winCollisionGroup, this.nextLevel,this);
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

        //  The score
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

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
        emitter = this.add.emitter(this.world.centerX, this.world.centerY, 300);
        //emitter = this.add.emitter(500, 300, 300);

        emitter.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
        emitter.gravity = 340;
        emitter.setAlpha(1, 0, 3000);
        emitter.setScale(0.5, 0, 0.5, 0, 3000);

        emitter.start(false, 3000, 5);

        sprite = this.add.sprite(500, 100, 'ball', 0);
        //sprite = this.add.sprite(900, 200, 'ball', 0);
        this.physics.arcade.enable(sprite);
        //sprite.body.setSize(5, 5, 0, 0);

        //fire 2
        emitter2 = this.add.emitter(this.world.centerX, this.world.centerY, 300);
        //emitter = this.add.emitter(500, 300, 300);

        emitter2.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );
        emitter2.gravity = -30;
        emitter2.setAlpha(1, 0, 2000);
        emitter2.setScale(0.3, 0.3, 0.3, 0, 3000);

        emitter2.start(false, 3000, 5);
       
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
            player.body.velocity.x=0;
            player.body.velocity.y=0;
            
            //add any object that is affected by gravity here.
            mehSpeed.push(checkmark.body.velocity.x);
            mehSpeed.push(checkmark.body.velocity.y);
            
            //Set the vbelocities to zero to make sure they dont move anymore.
            checkmark.body.velocity.x = 0;
            checkmark.body.velocity.y = 0;
            
            //fix the objects from rotating and make them static
            checkmark.body.fixedRotation = true;
        }
    },

    playGame: function(){
        if(paused){
            paused = false;
            this.pausePanel.hide();
            this.camera.follow(player,this.camera.FOLLOW_PLATFORMER);
            this.physics.p2.gravity.y = 500;
            
            //Push out velocties affected by gravity for objects here.
            checkmark.body.velocity.y = mehSpeed.pop();
            checkmark.body.velocity.x = mehSpeed.pop();
            
            //allow for totations and disable static.
            checkmark.body.fixedRotation = false;
        }
    },


    update: function() {
        //console.log("x:"+this.camera.x);
        //console.log("y:"+this.camera.y);
        //console.log("x:"+player.body.x);
        //console.log("y:"+player.body.y);
        //  To move the UI along with the camera 
        console.log("x: ", player.body.x);
        console.log("y: ", player.body.y);
        scoreText.x = this.camera.x+16;
        scoreText.y = this.camera.y+16;
        this.btnPause.x = this.camera.x+675;
        this.btnPause.y = this.camera.y+20;
        this.pausePanel.x = this.camera.x+655;
        if(!paused){
                this.pausePanel.y = this.camera.y-100;
                this.pausePanel.update();
        }

        //check if in bounds of ladder
        if(pushButton.isDown && ((player.body.x >= 560 && player.body.x <= 560+20 && player.body.y >= 1520 && player.body.y <= 1520+150) || 
            (player.body.x >= 500 && player.body.x <= 500+20 && player.body.y >= 1400 && player.body.y <= 1400+150) || 
            (player.body.x >= 580 && player.body.x <= 580+20 && player.body.y >= 1300 && player.body.y <= 1300+150) ||
            (player.body.x >= 3250 && player.body.x <= 3250+20 && player.body.y >= 1600 && player.body.y <= 1600+150) ||
            (player.body.x >= 3325 && player.body.x <= 3325+20 && player.body.y >= 1525 && player.body.y <= 1525+150) ||
            (player.body.x >= 3400 && player.body.x <= 3400+20 && player.body.y >= 1450 && player.body.y <= 1450+150) || 
            (player.body.x >= 3565 && player.body.x <= 3565+20 && player.body.y >= 1430 && player.body.y <= 1430+150) ||
            (player.body.x >= 3575 && player.body.x <= 3575+20 && player.body.y >= 1300 && player.body.y <= 1300+150) ||
            (player.body.x >= 3450 && player.body.x <= 3450+20 && player.body.y >= 1310 && player.body.y <= 1310+150) ||
            (player.body.x >= 3200 && player.body.x <= 3200+20 && player.body.y >= 1465 && player.body.y <= 1465+150) ||
            (player.body.x >= 3125 && player.body.x <= 3125+20 && player.body.y >= 1375 && player.body.y <= 1375+150) ||
            (player.body.x >= 1100 && player.body.x <= 1100+20 && player.body.y >= 1170 && player.body.y <= 1170+150) ||
            (player.body.x >= 2030 && player.body.x <= 2030+20 && player.body.y >= 1450 && player.body.y <= 1450+150) ||
            (player.body.x >= 2030 && player.body.x <= 2030+20 && player.body.y >= 1300 && player.body.y <= 1300+150))){
            console.log("on ladder");
            player.body.data.gravityScale=0.05;
            onLadder=true;
        }
        else{
            player.body.data.gravityScale=1;
            onLadder=false;
        }

        //CHECK OTHER ING GAME EVENTS HERE
        //1. DEATH BOULDER
        if(player.body.x>2429)
            this.badbouldercreate();
        //CHECK IF IN WATER -- This must be modified is water's position is modified...
        if(player.body.x >= 3200 && player.body.x <= 3200+400 && player.body.y >= 1850 && player.body.y <= 1850+1000){
           // console.log("inwater");
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

        //Control Player Movement;
        if (!paused && !inWater && !onLadder){
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
                        player.frame = 0;
                    }
                    else
                    {
                        player.frame = 5;
                    }

                    facing = 'idle';
                }
            }

            if (jumpButton.isDown && ifCanJump){
                player.body.moveUp(300+godmode);
                ifCanJump = false;
            }
            // moving a Box-----------------------------
            if ((pushButton.isDown && playerbox) || (pushButton.isDown && playerbox)) {
                onGround = false;
                if (checkCreated < 1){
                    onGround = false;
                    Box.body.destroy();
                    Box.kill();
                    this.createBox(boxX, boxY, 'diamond',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
                    checkCreated++;
                }
            }else if (pushButton.isUp && onGround){
            
                Box.body.static = true;
                boxX = Box.body.x;
                boxY = Box.body.y;
                checkCreated =0;
                playerbox =false;
                
            }

        }

        if (!paused && inWater && !onLadder){
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
            if (cursors.up.isDown&&!inWater)
            {
                player.body.moveUp(200+godmode);
            }
            else if (cursors.down.isDown)
            {
                player.body.moveDown(200+godmode);
            }
        }
        if(!paused && !inWater && onLadder){
            if(cursors.up.isDown){
                player.body.moveUp(40);
            }
            else if(cursors.down.isDown){
                player.body.moveDown(40);
            }
        }

        //-----------------------player Kill zone
        if (player.body.y >= 1850+200){
            this.endGame();
        }


        //------------------ Fire EMitter
        var px = 0;
        var py = 0;

        px *= -1;
        py *= -1;

        emitter.minParticleSpeed.set(px, py);
        emitter.maxParticleSpeed.set(px, py);

        emitter.emitX = sprite.x;
        emitter.emitY = sprite.y+58;

        //fire2---------------------------
        var px2 = 200;
        var py2 = 0;

        px2 *= -1;
        py2 *= -1;

        emitter2.minParticleSpeed.set(px2, py2);
        emitter2.maxParticleSpeed.set(px2, py2);

        emitter2.emitX = 400;
        emitter2.emitY = 1600;

        // emitter.forEachExists(game.world.wrap, game.world);
        //this.world.wrap(sprite, 64);
        //console.log(px);
        if (player.body.x >= 232 && player.body.x <= 431 && player.body.y <= 440 && player.body.y >= 434){
            this.endGame();
        }
    },


// correct the endGame function
    endGame: function(){
        score = 0;
        this.music.stop();
        this.state.start('gameover');
    },
    nextLevel: function(){
        this.music.stop();
        this.state.start('level1');
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
        this.game.state.restart(true,true);
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

