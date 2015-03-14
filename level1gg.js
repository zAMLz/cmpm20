Game.level1gg = function (game){
	this.music = null;
};
var filter;
var background;
Game.level1gg.prototype = {

	
	create: function(){
		//filter script
		var fragmentSrc = [

        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform vec2      mouse;",

        "#define MAX_ITER 4",

        "void main( void )",
        "{",
            "vec2 v_texCoord = gl_FragCoord.xy / resolution;",

            "vec2 p =  v_texCoord * 8.0 - vec2(20.0);",
            "vec2 i = p;",
            "float c = 1.0;",
            "float inten = .05;",

            "for (int n = 0; n < MAX_ITER; n++)",
            "{",
                "float t = time * (1.0 - (3.0 / float(n+1)));",

                "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
                "sin(t - i.y) + cos(t + i.x));",

                "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
                "p.y / (cos(i.y+t)/inten)));",
            "}",

            "c /= float(MAX_ITER);",
            "c = 1.5 - sqrt(c);",

            "vec4 texColor = vec4(0.0, 0.01, 0.015, 1.0);",

            "texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));",

            "gl_FragColor = texColor;",
        "}"
    ];
    	filter = new Phaser.Filter(this, null, fragmentSrc);
    	filter.setResolution(800, 600);
		//adds music
		this.music = this.add.audio('ggmusic');
		this.music.play();
		background = this.add.sprite(0,0,'sky');
		gameoverText = this.add.text(405, 220, 'Game Over', { fontSize: '32px', fill: '#fff' });
		gameoverText.anchor.setTo(0.5, 0.5);
		this.restartButton=this.add.button(350, 275,  'restart',this.startGame,this);
		background.filters = [filter];

	},
	update: function(){
		filter.update(this.input.activePointer);
	},
	startGame: function(pointer){
		this.music.stop();
		this.state.start('level1');
	}
}