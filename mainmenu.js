var menuText;
Game.mainmenu = function (game){
	this.playButton = null;
	this.music=null
};

Game.mainmenu.prototype = {
	
	create: function(){
		//adds music
		this.music = this.add.audio('menumusic');
		this.music.play();
		this.add.sprite(0,0,'sky');
		this.playButton=this.add.button((this.world.width-100)/2, (this.world.height-50)/2, 'play',this.startGame,this);
	},
	startGame: function(pointer){
		this.music.stop();
		this.state.start('tutorial');
	}
}