// Phaser this File
//var this = new Phaser.this(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//-----------Game Variables---------
var player;
var platforms;
var cursors;

//----------Player Control Variables---
var facing = 'left';
var jumpButton;
var isDebug = false;
var ifCanJump = true;

//----------Pause Control-----------
var pause_label;
var pause_help;
var Pause_exit;
var Pause_continue;
var pause_restart;

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
        this.physics.p2.gravity.y = 400;
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
        var checkmark = this.add.sprite(400,128,'check');
        this.physics.p2.enableBody(checkmark,isDebug);
        checkmark.body.clearShapes();
        checkmark.body.loadPolygon('physicsdata','check');
        checkmark.body.setCollisionGroup(isJumpCollisionGroup);
        checkmark.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

        // The player aanimations and position
        player = this.add.sprite(32, this.world.height - 150, 'dude');
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        //  We need to enable physics on the player
        this.physics.p2.enable(player);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;

        //Again we need to set the player to use the player collision group.
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides(isJumpCollisionGroup,function (){ifCanJump = true;},this);
        player.body.collides(killCollisionGroup, this.endGame, this)

        //sets camera to follow
        this.camera.follow(player);

        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.UP);

        //  The score
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        //  Our controls.
        cursors = this.input.keyboard.createCursorKeys();
    	
    	//pause menu
    	
    },

    update: function() {

        //  To move the UI along with the camera 
        scoreText.x = this.camera.x+16;
        scoreText.y = this.camera.y+16;
        pause_label.x = this.camera.x+700;
        pause_label.y = this.camera.y+20;

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

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
        else
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
        console.log(player.body.y);
        console.log(this.world.height);
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
    }

}

