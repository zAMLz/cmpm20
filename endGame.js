var menuText;
Game.endgame = function (game){
	this.playButton = null;
	this.music=null
};



//cutscene-----------------
var cutsceneFlag;
var blacker;

Game.endgame.prototype = {
	
	create: function(){

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

        //this.add.sprite(0,0,'whitehouse');

		var ground = this.add.sprite(0, this.world.height - 64-30,'ground'); //creates the sprite
        ground.scale.setTo(200,2);//set the scale
        this.physics.p2.enableBody(ground,false);    //enables physics on it
        ground.body.static = true;                  //disables gravity for itself...
        ground.body.fixedRotation = true;           //fixes rotation?
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        ground.body.setCollisionGroup(isJumpCollisionGroup);
        ground.body.collides([isJumpCollisionGroup, playerCollisionGroup, killCollisionGroup, winCollisionGroup, BoxCollisionGroup]);

        this.add.sprite(0,0,'whitehouse');

		player = this.add.sprite(32, this.world.height-150-32, 'courier');
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
		//adds music

		this.stage.backgroundColor = '#383838';

		player.animations.play('right_idle_letter');

		president = this.add.sprite(32+300,this.world.height-150-32,'president');
	},
	update: function(){

	},
	end: function(pointer){
		this.music.stop();
		this.state.start('mainmenu');
	}
}