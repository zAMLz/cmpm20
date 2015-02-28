Game.preloader = function (game){
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

Game.preloader.prototype = {
	preload: function(){
	this.background = this.add.sprite(0,0, 'preloadBackground');
	this.preloadBar = this.add.sprite(0,400,'preloadBar');
	this.preloadBar.anchor.setTo(0.5, 0.5);
	this.load.setPreloadSprite(this.preloadBar);
	this.loadingText = this.add.text(this.world.centerX, this.world.centerY - ((this.world.height / 2) / 2), "Loading", { font: "36px Chunk", fill: "#ffffff", align: "center" });
    this.loadingText.anchor.setTo(0.5, 0.5);

    this.load.image('sky', 'assets/sky.png');
    this.load.image('play', 'assets/playButton.png');
    //also needs ogg version for firefox.
    this.load.audio('menumusic', 'assets/Steve_Combs_13_Our_Wasted_Youth.mp3');
    this.load.audio('tutorialmusic', 'assets/Steve_Combs_22_Thank_You_Remix.mp3');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.load.image('fulldome', 'assets/fulldome.png');
    this.load.image('diamond','assets/diamond.png');
    this.load.image('check','assets/check.png');
    this.load.physics('physicsdata','physics.json');
    //UI
    this.load.image('continue','assets/UI/continue.png');
    this.load.image('help','assets/UI/help.png');
    this.load.image('pause','assets/UI/pause.png');
    this.load.image('quit','assets/UI/quit.png');
    this.load.image('restart','assets/UI/restart.png');
    this.load.image('helpscn','assets/UI/helpscreen.png');
	},

	create: function(){
		 this.loadingText.setText("Loaded");
         this.loadingText.anchor.set(0.5, 0.5);
         this.add.tween(this.loadingText).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
         this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.In, true);
         var tween = this.add.tween(this.preloadBar).to({ y: (this.game.canvas.height / 2) }, 1000, Phaser.Easing.Exponential.In, true);
		 this.preloadBar.cropEnabled = false;
		 tween.onComplete.add(function(){this.state.start('mainmenu')}, this);
	}
}