Game.gameover = function (game){
	this.music = null;
};

Game.gameover.prototype = {
	
	create: function(){
		//adds music
		this.music = this.add.audio('menumusic');
		this.music.play();
		this.stage.backgroundColor = '#000000';
		//this.add.sprite(0,0,'sky');
		gameoverText = this.add.text(405, 220, 'Game Over', { fontSize: '32px', fill: '#fff' });
		gameoverText.anchor.setTo(0.5, 0.5);
		this.restartButton=this.add.button(350, 275,  'restart',this.startGame,this);

		background = this.add.sprite(0, 0);
		background.width = 800;
		background.height = 600;

		filter = this.add.filter('Fire', 800, 600);
		filter.alpha = 0.0;

		background.filters = [filter];

	},
	startGame: function(pointer){
		this.music.stop();
		this.state.start('main');
	},

	update: function() {
		filter.update();
	}
}