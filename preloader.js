Game.preloader = function (game){
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

var guy;
Game.preloader.prototype = {
	preload: function(){
	this.stage.backgroundColor = '#383838';
	this.preloadBar = this.add.sprite(0,400,'preloadBar');
	this.preloadBar.anchor.setTo(0.5, 0.5);
	this.load.setPreloadSprite(this.preloadBar);
	this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Your Game is Loading...", { font: "36px Chunk", fill: "#ffffff", align: "center" });
    this.loadingText.anchor.setTo(0.5, 0.5);
    guy = this.add.sprite(-10, 300,'courier');
    guy.anchor.setTo(0.5,0.5);
    guy.animations.add('right', [10,9,8,2], 10, true);
    guy.animations.play('right');
    this.add.tween(guy).to( { x:400 }, 2000, Phaser.Easing.Linear.None, true);

    this.load.image('logo','assets/logo.png');
    this.load.image('gameover','assets/gameover.png');
    this.load.image('black','assets/black.png');
    this.load.image('red','assets/red.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('play', 'assets/UI/play.jpg');
    //also needs ogg version for firefox.
    this.load.audio('menumusic', ['assets/audio/Steve_Combs_13_Our_Wasted_Youth.mp3', 'Steve_Combs_13_Our_Wasted_Youth.ogg']);
    this.load.audio('tutorialmusic', ['assets/audio/Steve_Combs_22_Thank_You_Remix.mp3', 'Steve_Combs_22_Thank_You_Remix.ogg']);
    this.load.audio('ggmusic', ['assets/audio/DvdThemeMusic.eerie.creepy.classicHorror1.mp3','assets/audio/DvdThemeMusic.eerie.creepy.classicHorror1.ogg']);
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('letter','assets/letter.png');
    //this.load.spritesheet('sawblade','assets/world/factory/sawblades/sawbladeRnf.png',100,100);
    //this.load.spritesheet('sawblade2','assets/world/factory/sawblades/sawbladeRolds.png',100,100);
    this.load.image('sawblade','assets/world/factory/sawblades/sawbladeR0.png');
    this.load.image('sawblade2','assets/world/factory/sawblades/sawbladeRold.png');
    this.load.image('fulldome', 'assets/fulldome.png');
    this.load.image('diamond','assets/diamond.png');
    this.load.image('box','assets/box.png');
    this.load.image('blank','assets/blank.png');
    this.load.image('check','assets/check.png');
    this.load.image('ladder','assets/ladder.png');
    this.load.image('ladder2','assets/ladder2.png');
    this.load.image('conveyor', 'assets/world/work/othersprite/conveyor.png');
    this.load.spritesheet('plateSheet', 'assets/world/work/othersprite/pressurePlate.png',32,28);
    this.load.spritesheet('doorSheet','assets/world/work/othersprite/doorsheet.png',33,84);

     //Terrain details
    this.load.physics('physicsdataforest','assets/world/forest/forest.json');
    this.load.image('terr-null','assets/world/forest/terr-null.png');
    this.load.image('terr1-1','assets/world/forest/terr1-1.png');
    this.load.image('terr1-2','assets/world/forest/terr1-2.png');
    this.load.image('terr1-3','assets/world/forest/terr1-3.png');
    this.load.image('terr1-4','assets/world/forest/terr1-4.png');
    this.load.image('terr1-5','assets/world/forest/terr1-5.png');
    this.load.image('terr1-6','assets/world/forest/terr1-6.png');
    this.load.image('terr1-7','assets/world/forest/terr1-7.png');
    this.load.image('terr1-b','assets/world/forest/terr1-b.png');
    this.load.image('terr1-b2','assets/world/forest/terr1-b2.png');
    this.load.image('water1-1','assets/world/forest/water1-1.png');
    this.load.image('boulder','assets/world/forest/boulder.png');
    this.load.image('introforest','assets/world/forest/introforest.png');
    this.load.image('introfactory','assets/world/factory/introfactory.png');
    //second world
    this.load.physics('physicsdatafactory','assets/world/factory/factory.json');
    this.load.image('fact1','assets/world/factory/fact1.png');
    this.load.image('fact3','assets/world/factory/fact3.png');
    //UI
    this.load.image('continue','assets/UI/continue.png');
    this.load.image('help','assets/UI/help.png');
    this.load.image('pause','assets/UI/pause.png');
    this.load.image('quit','assets/UI/quit.png');
    this.load.image('restart','assets/UI/restart.png');
    this.load.image('helpscn','assets/UI/helpscreen.png');
    this.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Fire.js');
    //fire
    this.load.image('fire1', 'assets/fire/fire1.png');
    this.load.image('fire2', 'assets/fire/fire2.png');
    this.load.image('fire3', 'assets/fire/fire3.png');
    this.load.image('smoke', 'assets/fire/smoke-puff.png');
    this.load.spritesheet('ball', 'assets/fire/plasmaball.png', 128, 128);
	},

	create: function(){
		 this.loadingText.setText("Your Game has Loaded.");
         this.loadingText.anchor.set(0.5, 0.5);
         this.add.tween(this.loadingText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
         this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
         //this.add.tween(this.preloadBar).to({ y: (this.game.canvas.height / 2) }, 1000, Phaser.Easing.Exponential.In, true);
		 this.preloadBar.cropEnabled = false;
         var tween = this.add.tween(guy).to( { x:800 }, 2000, Phaser.Easing.Linear.None, true);
		 tween.onComplete.add(function(){this.state.start('mainmenu')}, this);
	}
}