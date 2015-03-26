var menuText;
Game.endgame = function (game){
	this.playButton = null;
	this.music=null
};



//cutscene-----------------
var cutsceneFlag;
var blacker;
var whitehouse;
var terrain;
var starcut;
var player;
var president;

Game.endgame.prototype = {
	
	create: function(){


        this.stage.backgroundColor = '#d0f4f7';

		cutsceneFlag = this.add.sprite(0,0,'blank');

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

		var ground = this.add.sprite(0, this.camera.y+600 - 64-30,'ground'); //creates the sprite
        ground.scale.setTo(200,2);//set the scale
        this.physics.p2.enableBody(ground,false);    //enables physics on it
        ground.body.static = true;                  //disables gravity for itself...
        ground.body.fixedRotation = true;           //fixes rotation?
        //1.Tells the ground to be part of the jumpable collision group
        //2.This effectively tells it that it collides with these collision groups.
        ground.body.setCollisionGroup(isJumpCollisionGroup);
        ground.body.collides([isJumpCollisionGroup, playerCollisionGroup, killCollisionGroup, winCollisionGroup, BoxCollisionGroup]);

        whitehouse=this.add.sprite(0,0,'whitehouse');
        terrain = this.add.sprite(0,150,'terr1-6');
        this.add.tween(terrain).to( { alpha: 0 }, 1, Phaser.Easing.Linear.None, true);

        starcut = this.add.sprite(0,150,'letter');
        this.add.tween(starcut).to( { alpha: 0 }, 1, Phaser.Easing.Linear.None, true);


		player = this.add.sprite(32, this.camera.y+600-150-32, 'courier');
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

        //this.camera.follow(player); 

        //Again we need to set the player to use the player collision group.
        player.body.setCollisionGroup(playerCollisionGroup);
        player.body.collides(isJumpCollisionGroup,function (){ifCanJump = true;},this);
        player.body.collides(killCollisionGroup, this.endGame, this);
        player.body.collides(winCollisionGroup, function(){gameEnd=true;},this);
        player.body.collides(BoxCollisionGroup,function(){playerbox = true; ifCanJump = true;},this)
		//adds music

		this.stage.backgroundColor = '#383838';

		player.animations.play('right_idle_letter');

		president = this.add.sprite(32+300,this.camera.y+600-150-32+10,'president');
		president.animations.add('left_idle',[4],10,true);
		president.animations.add('right_idle',[2],10,true);
		president.animations.add('left_idle_letter',[1],10,true);
		president.animations.add('right_idle_letter',[0],10,true);

		president.animations.play('left_idle');

		blacker = this.add.sprite(0,0,'black');
        this.add.tween(blacker).to( { alpha: 0 }, 1, Phaser.Easing.Linear.None, true);

        credits = this.add.sprite(0,0,'credits');
        this.add.tween(credits).to( { alpha: 0 }, 1, Phaser.Easing.Linear.None, true);
	},
	update: function(){
        console.log('X: '+player.body.x);
        console.log('Y: '+player.body.y);
		if(cutsceneFlag.x == 0){
                this.add.tween(cutsceneFlag).to( { x: '+50' }, 1000, Phaser.Easing.Linear.None, true);
		}
		if(cutsceneFlag.x == 50){
			player.animations.play('right');
			player.body.moveRight(200);
            this.add.tween(cutsceneFlag).to( { x: '+50' }, 500, Phaser.Easing.Linear.None, true);
		}
		if(cutsceneFlag.x>50 && cutsceneFlag.x<100){
			player.body.moveRight(200);
		}
		if(cutsceneFlag.x == 100){
            this.add.tween(cutsceneFlag).to( { x: '+50' }, 1000, Phaser.Easing.Linear.None, true);
            player.animations.play('right_idle_letter');
        }
        if(cutsceneFlag.x == 150){
            this.add.tween(cutsceneFlag).to( { x: '+50' }, 1000, Phaser.Easing.Linear.None, true);
            player.animations.play('right_idle');
            president.animations.play('right_idle_letter');
        }
        if(cutsceneFlag.x == 200){
            this.add.tween(cutsceneFlag).to( { x: '+50' }, 500, Phaser.Easing.Linear.None, true);
            player.animations.play('left');
            player.body.moveLeft(200);
        }
        if(cutsceneFlag.x>200){
        	player.body.moveLeft(200);
        }
        if(cutsceneFlag.x == 250){
                this.add.tween(cutsceneFlag).to( { x: '+50' }, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(blacker).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        }
        if(cutsceneFlag.x == 300){
        	this.add.tween(president).to( { alpha: 0 }, 1, Phaser.Easing.Linear.None, true);
        	this.add.tween(whitehouse).to( { alpha: 0 }, 1, Phaser.Easing.Linear.None, true);
        	this.add.tween(terrain).to( { alpha: 1 }, 1, Phaser.Easing.Linear.None, true);
        	player.animations.play('right_idle');
            this.add.tween(blacker).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        	this.add.tween(cutsceneFlag).to( { x: '+50' }, 2000, Phaser.Easing.Linear.None, true);
        }
        if(cutsceneFlag.x == 350){
            this.add.tween(starcut).to( { alpha: 1 }, 1, Phaser.Easing.Linear.None, true);
            this.add.tween(cutsceneFlag).to( { x: '+50' }, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(starcut).to( { x: 675*2 }, 4000, Phaser.Easing.Linear.None, true);
            this.add.tween(starcut).to( { y: 1389/2 }, 4000, Phaser.Easing.Linear.None, true);
            this.add.tween(starcut).to( { angle: '+1500' }, 4000, Phaser.Easing.Linear.None, true);
        }
        if(cutsceneFlag.x == 400){
                this.add.tween(cutsceneFlag).to( { x: '+50' }, 1000, Phaser.Easing.Linear.None, true);
                this.add.tween(blacker).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
                //tween credits here... and extend cutsceneflag tween to make longer.
        }
        if(cutsceneFlag.x == 450){
                this.add.tween(cutsceneFlag).to( { x: '+50' }, 5000, Phaser.Easing.Linear.None, true);
        	this.add.tween(credits).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        }
        if(cutsceneFlag.x == 500){
			this.end();

        }
	},
	end: function(pointer){
		//this.music.stop();
		this.state.start('mainmenu');
	}
}