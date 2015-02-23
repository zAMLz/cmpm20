// Phaser this File
//var this = new Phaser.this(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var platforms;
var cursors;
var facing = 'left';
var jumpButton;

var stars;
var score = 0;
var scoreText;
Game.main = function(game){}
Game.main.prototype={
preload: function () {

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
	//changes bounds of the world
	this.world.setBounds(0,0,1400,this.world.height);
    //  A simple background for our this
    this.add.tileSprite(0, 0,1400,this.world.height, 'fulldome');

    //  We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.gravity.y = 400;

    var ground = this.add.sprite(0, this.world.height - 64,'ground'); //creates the sprite
    ground.scale.setTo(200,2);//set the scale
    this.physics.p2.enableBody(ground,true);    //enables physics on it
    ground.body.static = true;                  //disables gravity 
    ground.body.fixedRotation = true;           //fixes rotation?

    //TESING purposes -- added a checkmark for lols
    var checkmark = this.add.sprite(400,128,'check');
    this.physics.p2.enableBody(checkmark,true);
    checkmark.body.clearShapes();
    checkmark.body.loadPolygon('physicsdata','check');

    // The player and its settings
    player = this.add.sprite(32, this.world.height - 150, 'dude');
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    //  We need to enable physics on the player
    this.physics.p2.enable(player);
    player.body.fixedRotation = true;
    player.body.collideWorldBounds = true;
   
    //sets camera to follow
    this.camera.follow(player);

    jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

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

    //  Collide the player and the stars with the platforms
    //this.physics.p2.collide(player, platforms);
    //this.physics.p2.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.arcade.overlap(player, stars, collectStar, null, this);

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
    
    if (jumpButton.isDown && checkIfCanJump)
    {
        player.body.moveUp(300);

    }

}
}

function checkIfCanJump() {

    

};
