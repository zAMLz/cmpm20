var Game = {};

Game.boot = function (game){

};

Game.boot.prototype =  {
	preload: function () {
		this.load.image('preloadBackground', 'assets/sky.png');
		this.load.image('preloadBar', 'assets/preloaderBar.png');
    	this.load.spritesheet('courier', 'assets/courier.png', 32, 48);
	},
	create: function(){
		this.state.start('preloader');
	}
}