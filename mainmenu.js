var Game = {}
var menuText;
Game.mainmenu = function (game){
	this.playButton = null;
	this.music=null
};

Game.mainmenu.prototype = {
	preload: function(){	
    this.load.image('sky', 'assets/sky.png');
    this.load.image('play', 'assets/playButton.png');
    //also needs ogg version for firefox.
    this.load.audio('menumusic', 'assets/Steve_Combs_13_Our_Wasted_Youth.mp3');
	},

	create: function(){
		//adds music
		this.music = this.add.audio('menumusic');
		this.music.play();
		this.add.sprite(0,0,'sky');
		menuText = this.add.text(380, 150, 'Main Menu', { fontSize: '32px', fill: '#fff' });
		this.playButton=this.add.button(400,300, 'play',this.startGame,this);
	},
	startGame: function(pointer){
		this.music.stop();
		this.state.start('main');
	}
}