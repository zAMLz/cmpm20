var player;
var cursors;
var water;
var inWater=false;
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
var rightBeltBoxArray = new Array();
var leftBeltBoxArray = new Array();
var stool;
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

//------------TESTING PURPOSES
var isDebug = true;
var godmode = 0;

//----------Pause Control-----------
var paused;
var pausePanel;
var mehSpeed;

//---------Other Variables---------
var diamond;
var diamond2;

//----------fire-------------
var sprite;
var emitter;
var emitter2;
Game.level2 = function (game){
	this.music = null;
};

Game.level2.prototype = {

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
        terrain.body.clearShapes();
        if(realTerrain){
            terrain.body.clearShapes();
            terrain.body.loadPolygon('physicsdatafactory','fact1');
          //  console.log(image);
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

    create: function() {
        //adds music
        this.music = this.add.audio('tutorialmusic');
        this.music.play();

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


        //if the player collides with the star next level starts
        star = this.add.sprite(15500,500,'star');
        this.physics.p2.enableBody(star, isDebug);
        star.body.setCollisionGroup(winCollisionGroup);
        star.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

       
        // The player aanimations and position
        player = this.add.sprite(32, 1600 - 150, 'courier');
      //  player = this.add.sprite(11245, 1000, 'courier');
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
        player.body.collides(beltCollisionGroup, function (){ifCanJump = true; touchdown=true;});

        //sets camera to follow
        this.camera.follow(player);

        //Add water after adding the player so that way, water is layered ontop of the player
        water = this.add.sprite(500,1730,'water1-1'); //Note this has no interactions with the inWater function
        this.add.tween(water).to({alpha:0.95}, 1, Phaser.Easing.Linear.NONE, true);
        water.scale.setTo(2,1);

        //terrain
        this.terraincreator('fact1',200,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',1600,1600,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        this.terraincreator('fact1',2240,1000,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,true);
        //boxes floating in water
        this.floatingBox('box',580,1730,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,0);
        this.floatingBox('box',700,1730,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,1);
        this.floatingBox('box',900,1730,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,2);
        this.floatingBox('box',1020,1730,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,3);
        this.floatingBox('box',1230,1730,playerCollisionGroup,isJumpCollisionGroup,BoxCollisionGroup,4);

        door = this.add.sprite(1824, 1618, 'box');
        door.scale.setTo(1,3);
        door2 = this.add.sprite(1995,1018, 'box');
        door2.scale.setTo(1,3);

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
        this.playGame();


       
    },

    pauseGame: function(){
        if(!paused){
            paused = true;
            this.pausePanel.show();
            this.physics.p2.gravity.y = 0;
            this.camera.unfollow();
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
        console.log("x:"+this.camera.x);
        console.log("y:"+this.camera.y);
        console.log("px: ",player.body.x);
        console.log("py: ",player.body.y);
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
     
        if(!paused){
            this.pausePanel.y = this.camera.y-100;
            this.pausePanel.update();    

        }

        //door teleport thing
        if(player.body.x>=door.x&&player.body.x<=door.x+32&&player.body.y>=door.y&&player.body.y<=door.y+84){
            player.body.x=door2.x;
            player.body.y=door2.y;
        }


        //CHECK IF IN WATER -- This must be modified is water's position is modified...
        if(player.body.x >= water.x && player.body.x <= water.x+400 && player.body.y >= water.y && player.body.y <= water.y+1000){
          //  console.log("inwater");
            inWater = true;
           // this.physics.p2.gravity.y = 200;
          player.body.data.gravityScale=20;
          ifCanJump=false;
    /*        if(counter == 0){
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
        if (!paused && !inWater){
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
   /*        if ((pushButton.isDown && playerbox) || (pushButton.isDown && playerbox)) {
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
                
            } */

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
                player.body.velocity.x = 100;

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
 /*           if ((pushButton.isDown && playerbox) || (pushButton.isDown && playerbox)) {
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
                
            } */

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
                player.body.velocity.x = -85;

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

            // moving a Box-----------------------------
  /*          if ((pushButton.isDown && playerbox) || (pushButton.isDown && playerbox)) {
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
                
            }*/

        }
        //-----------------------player moveKill
        //if (player.body.x >= 226){
        //}

        //-----------------------player Kill zone
        if (player.body.y >= 1850+200){
            this.endGame();
        }

    },


// correct the endGame function
    endGame: function(){
        this.music.stop();
        this.state.start('level2gg');
    },
    nextLevel: function(){
        this.music.stop();
        this.state.start('level1');
    },
    restartLevel: function(){
        this.music.stop();
        this.state.start('level2');
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

