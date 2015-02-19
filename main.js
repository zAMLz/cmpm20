// Phaser Game File
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('fulldome', 'assets/fulldome.png');
    game.load.image('diamond','assets/diamond.png');

}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function create() {
	//changes bounds of the world
	game.world.setBounds(0,0,1400,game.world.height);
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.tileSprite(0, 0,1400,game.world.height, 'fulldome');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(200, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    //sets camera to follow
    game.camera.follow(player);


    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

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
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
	
	//pause menu
	pause_label = game.add.text(700, 20, 'Pause', { font: '32px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;
		console.log("GAME PAUSED IN CAMERA>> X: "+game.camera.x+" Y:"+game.camera.y);
		// click on diamond to unpause
		
		pause_label_continue = game.add.text(game.camera.x+400, game.camera.y+200, 'Continue',{ font: '32px Arial', fill: '#fff' });
		pause_label_continue.anchor.setTo(0.5,0.5);
		pause_label_continue.events.onInputUp.add(unpause, this);

		pause_label_help = game.add.text(game.camera.x+400, game.camera.y+250, 'Help',{ font: '32px Arial', fill: '#fff' });
    	pause_label_help.anchor.setTo(0.5,0.5);
    	//pause_label_help.events.onInputUp.add(helpmenu, this);	//HELP FUNCTION LOADS THE HELP STUFF

    	pause_label_exit = game.add.text(game.camera.x+400, game.camera.y+300, 'Exit',{ font: '32px Arial', fill: '#fff' });
    	pause_label_exit.anchor.setTo(0.5,0.5);
    	//pause_label_help.events.onInputUp.add(exitgame, this);	//Exit Function takes the game back to the menu
		});
		
	//game.input.onDown.add(unpause, self);
	
	function unpause(event) {
		if(game.paused) {
				pause_label_continue.destroy();
				pause_label_help.destroy();
				pause_label_exit.destroy();
				game.paused = false;
		}	
	};
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  To move the UI along with the camera 
    scoreText.x = game.camera.x+16;
    scoreText.y = game.camera.y+16;
    pause_label.x = game.camera.x+700;
    pause_label.y = game.camera.y+20;

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

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}