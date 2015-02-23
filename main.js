// Phaser this File
//var this = new Phaser.this(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var platforms;
var cursors;
var facing = 'left';
var jumpButton;
var isDebug = false;
var ifCanJump = true;

var stars;
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
    	this.world.setBounds(0,0,1400,this.world.height);
        this.add.tileSprite(0, 0,1400,this.world.height, 'fulldome');

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
        var ground = this.add.sprite(0, this.world.height - 64,'ground'); //creates the sprite
        ground.scale.setTo(200,2);//set the scale
        this.physics.p2.enableBody(ground,isDebug);    //enables physics on it
        ground.body.static = true;                  //disables gravity for itself...
        ground.body.fixedRotation = true;           //fixes rotation?
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        ground.body.setCollisionGroup(isJumpCollisionGroup);
        ground.body.collides([isJumpCollisionGroup, playerCollisionGroup]);

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
    	pause_label = this.add.text(700, 20, 'Pause', { font: '32px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.events.onInputUp.add(function () {
            // When the paus button is pressed, we pause the this
            this.paused = true;
    		console.log("this PAUSED IN CAMERA>> X: "+this.camera.x+" Y:"+this.camera.y);
    		// click on diamond to unpause
    		
    		pause_label_continue = this.add.text(this.camera.x+400, this.camera.y+200, 'Continue',{ font: '32px Arial', fill: '#fff' });
    		pause_label_continue.anchor.setTo(0.5,0.5);
    		pause_label_continue.events.onInputUp.add(unpause, this);

    		pause_label_help = this.add.text(this.camera.x+400, this.camera.y+250, 'Help',{ font: '32px Arial', fill: '#fff' });
        	pause_label_help.anchor.setTo(0.5,0.5);
        	//pause_label_help.events.onInputUp.add(helpmenu, this);	//HELP FUNCTION LOADS THE HELP STUFF

        	pause_label_exit = this.add.text(this.camera.x+400, this.camera.y+300, 'Exit',{ font: '32px Arial', fill: '#fff' });
        	pause_label_exit.anchor.setTo(0.5,0.5);
        	//pause_label_help.events.onInputUp.add(exitthis, this);	//Exit Function takes the this back to the menu
    	});
    		
    	//this.input.onDown.add(unpause, self);
    	
    	function unpause(event) {
    		if(this.paused) {
    				pause_label_continue.destroy();
    				pause_label_help.destroy();
    				pause_label_exit.destroy();
    				this.paused = false;
    		}	
    	};
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
    },

    endGame: function(player, diamond){
        this.music.stop();
        this.state.start('gameover');
    }

}

