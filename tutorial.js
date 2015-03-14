var player;
var platforms;
var cursors;
var facing = 'left';
var jumpButton;
var pushButton;
var isDebug = false;
var ifCanJump = true;
var star;
var ladder;
var pausePanel;
var paused;
var callStand;
// text boxes
var dangerText;
var ladderText;
var pushText;

//collision groups
var playerCollisionGroup;
var isJumpCollisionGroup;
var winCollisionGroup;
var killCollisionGroup;
var BoxCollisionGroup;

//-------------Boxes------------------
var checkCreated = 0;
var Box;
var boxX;
var boxY;
var onGround = true;
var playerbox = false;

//---------------CUTSCENE-------------
var cutsceneFlag;



Game.tutorial = function(game){
    this.music=null;
}
Game.tutorial.prototype={
    createBox: function(x, y, index, playerCollisionGroup, isJumpCollisionGroup,BoxCollisionGroup ){
        boxX = x;
        boxY = y;
        Box = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(Box, false);
        Box.body.gravity = 500;
        Box.body.static = false;
        Box.body.fixedRotation = true;
        Box.body.setCollisionGroup(BoxCollisionGroup);
        Box.body.collides(isJumpCollisionGroup,function (){onGround = true;},this);
        Box.body.collides([playerCollisionGroup]);

    },
    createKillObj: function(x, y, index, playerCollisionGroup, killCollisionGroup){
        diamond = this.add.sprite(x, y, index);
        this.physics.p2.enableBody(diamond,false);
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
    	this.world.setBounds(0,0,4800,this.world.height);
        this.stage.backgroundColor = '#d0f4f7';
          //pause menu
        this.btnPause = this.game.add.button(675,20,'pause',this.pauseGame,this);
        this.pausePanel = new PausePanel(this.game);
        this.game.add.existing(this.pausePanel);
        this.playGame();

        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 400;
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.restitution = 0.0;

        //COLLISION GROUPS -- VERY IMPORTANT (Helps keep track of which platforms the player can jump on...)
        playerCollisionGroup = this.physics.p2.createCollisionGroup();
        isJumpCollisionGroup = this.physics.p2.createCollisionGroup();
        winCollisionGroup = this.physics.p2.createCollisionGroup();
        killCollisionGroup = this.physics.p2.createCollisionGroup();
        BoxCollisionGroup = this.physics.p2.createCollisionGroup();
        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.physics.p2.updateBoundsCollisionGroup();
        //text boxes
        //dangerText = this.add.text(400, 350, 'Danger!\nDon\'t touch\ndangerous things', { fontSize: '12px', fill: '#000' });
        //ladderText = this.add.text(550, 100, 'Hold the spacebar\nto latch on\nthe ladder', {fontSize: '12px', fill: '#000'});
        //pushText = this.add.text(100, 300, 'Some things\ncan be\npushed by\nholding the \nspacebar', { fontSize: '12px', fill: '#000' });

        this.add.sprite(0,0,'tutorial1');
        this.add.sprite(800,0,'tutorial2');
        this.add.sprite(800+800,0,'tutorial3');
        this.add.sprite(800+800+800,0,'tutorial4');
        this.add.sprite(800+800+800+800,0,'tutorial5');

        this.add.sprite(0,0,'blank');

        //Create a group that will use this collision group.

        //Add a ground for our world
        var ground = this.add.sprite(0, this.world.height - 64,'ground'); //creates the sprite
        ground.scale.setTo(200,2);//set the scale
        this.physics.p2.enableBody(ground,isDebug);    //enables physics on it
        ground.body.static = true;                  //disables gravity for itself...
        ground.body.fixedRotation = true;           //fixes rotation?
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        ground.body.setCollisionGroup(isJumpCollisionGroup);
        ground.body.collides([isJumpCollisionGroup, playerCollisionGroup, killCollisionGroup, winCollisionGroup, BoxCollisionGroup]);

        //ladder to pass traps
        ladder = this.add.sprite(2783+100-50+3, 488-100-50, 'ladder2');
        ladder = this.add.sprite(3900,220,'ladder2');

        // The player aanimations and position
        player = this.add.sprite(32, this.world.height-120, 'courier');
        player.animations.add('left', [3,4,5,11], 10, true);
        player.animations.add('right', [10,9,8,2], 10, true);
        player.animations.add('left_idle', [14], 10, true);
        player.animations.add('right_idle', [13], 10, true);
        player.animations.add('left_idle_letter', [6], 10, true);
        player.animations.add('right_idle_letter', [12], 10, true);
        player.animations.add('left_jump', [5], 10, true);
        player.animations.add('right_jump', [2], 10, true);
        player.animations.add('climb', [0,1], 5, true);
        
        //  We need to enable physics on the player
        this.physics.p2.enable(player);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;

        //Again we need to set the player to use the player collision group.
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides(isJumpCollisionGroup,function (){ifCanJump = true;},this);
        player.body.collides(winCollisionGroup, this.nextLevel, this);
        player.body.collides(killCollisionGroup, this.endGame, this);
        player.body.collides(BoxCollisionGroup,function(){playerbox = true; ifCanJump = true;},this)

        //star that advances you to next level
        star = this.add.sprite(1330, 460, 'letter');
        this.physics.p2.enableBody(star);
        star.body.setCollisionGroup(winCollisionGroup);
        star.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        //trap for tutorial
        this.createKillObj(3439+300, 490, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(3439+360, 490, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(3439+420, 490, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(3439+480, 490, 'blank', playerCollisionGroup, killCollisionGroup);
        this.createKillObj(3439+540, 490, 'blank', playerCollisionGroup, killCollisionGroup);
    
        this.createBox(2783, 488, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
        this.createBox(3439, 489, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
        //sets camera to follow
        this.camera.follow(player);

        //  Our controls.
        cursors = this.input.keyboard.createCursorKeys();
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        pushButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    pauseGame: function(){
        if(!paused){
            paused = true;
            this.pausePanel.show();
            this.camera.unfollow();
            this.physics.p2.gravity.y = 0;
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
        }
    },

    update: function() {
        console.log("x ",player.body.x)
        console.log("y ", Box.body.y);
        //  To move the UI along with the camera 
        this.btnPause.x = this.camera.x+675;
        this.btnPause.y = this.camera.y+20;
        this.pausePanel.x = this.camera.x+655;

        if(pushButton.isDown && ((player.body.x >= 2783+100-50+3 && player.body.x <= 2783+100-50+3+20 && player.body.y >= 488-100-50 && player.body.y <= 488-100-50+150)||
            (player.body.x >= 3900 && player.body.x <= 3900+20 && player.body.y >= 220 && player.body.y <= 220+150))) {
            callStand = true;
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

        if(!paused){
                this.pausePanel.y = this.camera.y-100;
                this.pausePanel.update();
        }

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if(paused || inWater){
            player.body.velocity.y = 0;
        }
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
                onGround = false;
                if (checkCreated < 1){
                    onGround = false;
                    Box.body.destroy();
                    Box.kill();
                    this.createBox( boxX, boxY, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
                    checkCreated++;
                }
                while (pushButton.isUp || cursors.right.isUp){
                Box.body.static = true;
                boxX = Box.body.x;
                boxY = Box.body.y;
                checkCreated =0;
                playerbox =false;                   
                }
            }else{
                Box.body.static = true;
                boxX = Box.body.x;
                boxY = Box.body.y;
                checkCreated =0;
                playerbox =false;
                
            }


            if (pushButton.isDown && cursors.left.isDown) {
                onGround = false;
                if (checkCreated < 1){
                    onGround = false;
                    Box.body.destroy();
                    Box.kill();
                    this.createBox( boxX, boxY, 'box',playerCollisionGroup, isJumpCollisionGroup, BoxCollisionGroup);
                    checkCreated++;
                }
                while (pushButton.isUp || cursors.left.isUp){
                Box.body.static = true;
                boxX = Box.body.x;
                boxY = Box.body.y;
                checkCreated =0;
                playerbox =false;                   
                }
            }

            //end moving a Box---------------------------

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
                player.animations.play('climb');
                player.body.moveUp(40);
            }
            else if(cursors.down.isDown){
                player.animations.play('climb');
                player.body.moveDown(40);
            }
            else
                player.animations.stop();
        }

    },

     endGame: function(){
        this.music.stop();
        this.state.start('tutorialgg');
    },
    nextLevel: function(){
        this.music.stop();
        this.state.start('main');
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
        this.game.state.start('tutorial');
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

