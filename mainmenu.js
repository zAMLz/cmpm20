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
		menuText = this.add.text(300, 400, 'Main Menu', { fontSize: '32px', fill: '#fff' });
		menuText.anchor.setTo(0.5,0.5);
		this.playButton=this.add.button((this.world.width-100)/2, (this.world.height-100)/2, 'play',this.startGame,this);
		//this.playButton.anchor.setTo(0.5, 0.5);
	},
	startGame: function(pointer){
		this.music.stop();
		this.state.start('main');
	}
}