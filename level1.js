Game.level1 = function (game){
	this.music = null;
};

Game.level1.prototype = {
	
	create: function(){
		//adds music
		this.music = this.add.audio('menumusic');
		this.music.play();
		this.add.sprite(0,0,'sky');
		level1Text = this.add.text(405, 220, 'Level 1', { fontSize: '32px', fill: '#fff' });
		level1Text.anchor.setTo(0.5, 0.5);
		this.restartButton=this.add.button(350, 275,  'restart',this.startGame,this);

	},
	startGame: function(pointer){
		this.music.stop();
		this.state.start('main');
	}
}