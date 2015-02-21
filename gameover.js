var restartText;
Game.gameover = function (game){};

Game.gameover.prototype = {
	preload: function(){	
    this.load.image('sky', 'assets/sky.png');
    this.load.image('play', 'assets/playButton.png');
	},

	create: function(){
		this.add.sprite(0,0,'sky');
		menuText = this.add.text(380, 150, 'Game Over', { fontSize: '32px', fill: '#fff' });
		restartText = this.add.text(400, 250, 'Restart:', { fontSize: '32px', fill: '#fff' });
		this.playButton=this.add.button(400,300, 'play',this.startGame,this);
	},
	startGame: function(pointer){
		this.state.start('main');
	}
}