// Phaser this File
//var this = new Phaser.this(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//-----------Game Variables---------
var player;
var cursors;

//-------------OBJECTS---------------
var checkmark;

//----------Player Control Variables---
var facing = 'left';
var jumpButton;
var isDebug = false;
var ifCanJump = true;

//----------Pause Control-----------
var paused;
var pausePanel;
var mehSpeed;

//---------Other Variables---------
var score = 0;
var scoreText;
var diamond;



Game.main = function(game){
    this.music=null;
}
Game.main.prototype={
    
    preload: function () {
        this.load.audio('tutorialmusic', 'assets/Steve_Combs_22_Thank_You_Remix.mp3');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.image('fulldome', 'assets/fulldome.png');
        this.load.image('diamond','assets/diamond.png');
        this.load.image('check','assets/check.png');
        this.load.image('continue','assets/UI/continue.png');
        this.load.image('help','assets/UI/help.png');
        this.load.image('pause','assets/UI/pause.png');
        this.load.image('quit','assets/UI/quit.png');
        this.load.image('restart','assets/UI/restart.png');
        this.load.physics('physicsdata','physics.json');

    },


    create: function() {
        //adds music
        this.music = this.add.audio('tutorialmusic');
        this.music.play();

    	//changes bounds of the world and add a background for the world
    	this.world.setBounds(0,0,2800,this.world.height);
        this.add.tileSprite(0, 0,2800,this.world.height, 'fulldome');

        //  We're going to be using physics, so enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 500;
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.restitution = 0.0;

        //COLLISION GROUPS -- VERY IMPORTANT (Helps keep track of which platforms the player can jump on...)
        var playerCollisionGroup = this.physics.p2.createCollisionGroup();
        var isJumpCollisionGroup = this.physics.p2.createCollisionGroup();
        var killCollisionGroup = this.physics.p2.createCollisionGroup();
        //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
        //  (which we do) - what this does is adjust the bounds to use its own collision group.
        this.physics.p2.updateBoundsCollisionGroup();

        //Create a group that will use this collision group.

        //Add a ground for our world
        var ground = this.add.sprite(0, this.world.height - 32,'ground'); //creates the sprite
        ground.scale.setTo(3,2);//set the scale
        this.physics.p2.enableBody(ground,isDebug);    //enables physics on it
        ground.body.static = true;                  //disables gravity for itself...
        ground.body.fixedRotation = true;           //fixes rotation?
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        ground.body.setCollisionGroup(isJumpCollisionGroup);
        ground.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        var ground2 = this.add.sprite(1450, this.world.height - 32,'ground'); //creates the sprite
        ground2.scale.setTo(3,2);//set the scale
        this.physics.p2.enableBody(ground2,isDebug);    //enables physics on it
        ground2.body.static = true;                  //disables gravity for itself...
        ground2.body.fixedRotation = true;           //fixes rotation?
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        ground2.body.setCollisionGroup(isJumpCollisionGroup);
        ground2.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        //Add a forsure kill player object
        diamond = this.add.sprite(300, this.world.height-150, 'diamond');
        this.physics.p2.enableBody(diamond,isDebug);
        diamond.body.static = true;
        diamond.body.fixedRotation = true;
        diamond.body.setCollisionGroup(killCollisionGroup);
        diamond.body.collides([playerCollisionGroup]);


        //TESING purposes -- added a checkmark for lols
        checkmark = this.add.sprite(400,128,'check');
        this.physics.p2.enableBody(checkmark,isDebug);
        checkmark.body.clearShapes();
        checkmark.body.loadPolygon('physicsdata','check');
        checkmark.body.setCollisionGroup(isJumpCollisionGroup);
        checkmark.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        // The player aanimations and position
        player = this.add.sprite(32, this.world.height - 150, 'dude');
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.physics.p2.enable(player);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;

        //Again we need to set the player to use the player collision group.
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides(isJumpCollisionGroup,function (){ifCanJump = true;},this);
        player.body.collides(killCollisionGroup, this.endGame, this)

        //sets camera to follow
        this.camera.follow(player);

        //Sets the jump button to up
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.UP);

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

    },

    pauseGame: function(){
        if(!paused){
            paused = true;
            this.pausePanel.show();
            this.physics.p2.gravity.y = 0;
            
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
            this.physics.p2.gravity.y = 500;
            
            //Push out velocties affected by gravity for objects here.
            checkmark.body.velocity.y = mehSpeed.pop();
            checkmark.body.velocity.x = mehSpeed.pop();
            
            //allow for totations and disable static.
            checkmark.body.fixedRotation = false;
        }
    },

    update: function() {

        //  To move the UI along with the camera 
        scoreText.x = this.camera.x+16;
        scoreText.y = this.camera.y+16;
        this.btnPause.x = this.camera.x+675;
        this.btnPause.y = this.camera.y+20;
        this.pausePanel.x = this.camera.x+655;
        this.pausePanel.btnRestart.body.x = this.camera.x+350;
        this.pausePanel.btnHelp.body.x = this.camera.x+350;
        this.pausePanel.btnQuit.body.x = this.camera.x+350;

        if(!paused){
                this.pausePanel.y = this.camera.y-100;
                this.pausePanel.update();
        }


        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;
        if(paused)
            player.body.velocity.y = 0;

        //Control Player Movement;
        if (!paused){
            if (cursors.left.isDown)
            {
                player.body.moveLeft(200);

                if (facing != 'left')
                {
                    player.animations.play('left');
                    facing = 'left';
                }
            }
            else if (cursors.right.isDown)
            {
                player.body.moveRight(200);

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
                player.body.moveUp(300);
                ifCanJump = false;
            }
        }
        //console.log(player.body.y);
        //console.log(this.world.height);
        if (player.body.y >= this.world.height-32){
       // player.body.gravity.y =9999
            score = 0;
            this.music.stop();
            this.state.start('gameover');
        }
    },

    endGame: function(player, diamond){
        this.music.stop();
        this.state.start('gameover');
    },

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
        this.game.state.start('main');
    },this);

    btnHelp = this.game.add.button(350,-150,'help',function(){
        //game code to tween help image....
    },this);

    btnQuit = this.game.add.button(350,-75,'quit',function(){
        this.game.state.start('mainmenu');
    },this);
};

PausePanel.prototype = Object.create(Phaser.Group.prototype);
PausePanel.constructor = PausePanel;

PausePanel.prototype.show = function(){
    this.game.add.tween(this).to({y:0}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnRestart).to({y:175}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnHelp).to({y:250}, 500, Phaser.Easing.Bounce.Out, true);
    this.game.add.tween(btnQuit).to({y:325}, 500, Phaser.Easing.Bounce.Out, true);
};
PausePanel.prototype.update = function(){
    this.game.add.tween(btnRestart).to({x:-225}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelp).to({x:-150}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnQuit).to({x:-75}, 200, Phaser.Easing.Linear.NONE, true);
}

PausePanel.prototype.hide = function(){
    this.game.add.tween(this).to({y:-100}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnRestart).to({y:-225}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnHelp).to({y:-150}, 200, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(btnQuit).to({y:-75}, 200, Phaser.Easing.Linear.NONE, true);
};

