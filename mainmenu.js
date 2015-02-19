var Game = {}
Game.mainmenu = function (game){
	this.playButton = null;
};

Game.mainmenu.prototype = {
	preload: function(){	
    this.load.image('sky', 'assets/sky.png');
    this.load.image('play', 'assets/playButton.png');
	},

	create: function(){
		this.add.sprite(0,0,'sky');
		this.playButton=this.add.button(400,300, 'play',this.startGame,this);
	},
	startGame: function(pointer){
		this.state.start('main');
	}
}