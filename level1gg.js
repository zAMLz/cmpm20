Game.level1gg = function (game){
	this.music = null;
};

Game.level1gg.prototype = {
	
	create: function(){
		//adds music
		this.music = this.add.audio('ggmusic');
		this.music.play();
		this.add.sprite(0,0,'sky');
		gameoverText = this.add.text(405, 220, 'Game Over', { fontSize: '32px', fill: '#fff' });
		gameoverText.anchor.setTo(0.5, 0.5);
		this.restartButton=this.add.button(350, 275,  'restart',this.startGame,this);

	},
	startGame: function(pointer){
		this.music.stop();
		this.state.start('level1');
	}
}