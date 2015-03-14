var menuText;
Game.endgame = function (game){
	this.playButton = null;
	this.music=null
};

Game.endgame.prototype = {
	
	create: function(){
		//adds music
		this.music = this.add.audio('menumusic');
		this.music.play();
		this.stage.backgroundColor = '#383838';
		var log = this.add.sprite(400,300,'logo');
		log.anchor.setTo(0.5,0.5);
		this.playButton=this.add.button((800-100)/2, ((600-50)/2) + 225, 'continue',this.startGame,this);
	},
	update: function(){

	},
	end: function(pointer){
		this.music.stop();
		this.state.start('mainmenu');
	}
}