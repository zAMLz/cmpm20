var Game = {};

Game.boot = function (game){

};

Game.boot.prototype =  {
	preload: function () {
		this.load.image('preloadBackground', 'assets/sky.png');
		this.load.image('preloadBar', 'assets/preloaderBar.png')
	},
	create: function(){
		this.state.start('preloader');
	}
}