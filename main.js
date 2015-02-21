// Phaser this File
//var this = new Phaser.this(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;
var platforms;
var cursors;

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
    //  We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.gravity.y = 400;

    //  A simple background for our this
    this.add.tileSprite(0, 0,1400,this.world.height, 'fulldome');

    var ground = this.add.sprite(0, this.world.height - 64,'ground');
    this.physics.p2.enableBody(ground,true);

    var checkmark = this.add.sprite(400,128,'check');
    this.physics.p2.enableBody(checkmark,true);
    checkmark.body.clearShapes();
    checkmark.body.loadPolygon('physicsdata','check');

    platforms = this.add.group();
    platforms.add(ground);
    platforms.add(checkmark);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    /*platforms = this.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, this.world.height - 64, 'ground');

    //  Scale it to fit the width of the this (the original sprite is 400x32 in size)
    ground.scale.setTo(200, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;*/

    // The player and its settings
    player = this.add.sprite(32, this.world.height - 150, 'dude');

    //  We need to enable physics on the player
    this.physics.p2.enable(player);

    player.body.collideWorldBounds = true;
    //sets camera to follow

    this.camera.follow(player);

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = this.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

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
    this.physics.p2.collide(player, platforms);
    this.physics.p2.collide(stars, platforms);

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
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

}
}
function collectStar(player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

};
