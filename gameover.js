Game.gameover = function (game){
	this.music = null;
};

Game.gameover.prototype = {
	
	create: function(){
		//adds music
		this.music = this.add.audio('menumusic');
		this.music.play();
		this.stage.backgroundColor = '#383838';
		//this.add.sprite(0,0,'sky');
		var log = this.add.sprite(this.camera.x+400,this.camera.y+300,'gameover');
		log.anchor.setTo(0.5,0.5);
		this.restartButton=this.add.button(350, 500,  'restart',this.startGame,this);

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