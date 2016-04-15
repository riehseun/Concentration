var gameLayer;
var gameArray = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
var pickedTiles = [];
var scoreText;
var moves = 0;

var gameScene = cc.Scene.extend({
	onEnter:function() {
		gameArray = shuffle(gameArray);
		this._super();
		gameLayer = new game();
		gameLayer.init();
		this.addChild(gameLayer);
	}
});

var game = cc.Layer.extend({
	init:function() {
		this._super();
		var gradient = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46, 0x82, 0xB4, 255));
		this.addChild(gradient);
		scoreText = cc.LabelTTF.create("Moves: 0", "Arial", "32", cc.TEXT_ALIGNMENT_CENTER);
		this.addChild(scoreText);
		scoreText.setPosition(250,500);
		for (i=0; i<16; i++) {
			//var tile = cc.Sprite.create("assets/cover.png");
			var tile = new MemoryTile();
			tile.pictureValue = gameArray[i];
			this.addChild(tile,0);
			tile.setPosition(120+i%4*74, 400-Math.floor(i/4)*74);
		}
	}
});

var MemoryTile = cc.Sprite.extend({
	ctor:function() {
		this._super();
		this.initWithFile("assets/cover.png");
		cc.eventManager.addListener(listener.clone(), this);
	}
});

var listener = cc.EventListener.create({
	event: cc.EventListener.TOUCH_ONE_BY_ONE, // waiting for touches 
	swallowTouches: true, // ignore all but the first touch
	onTouchBegan: function (touch, event) {
		if (pickedTiles.length < 2) {
			var target = event.getCurrentTarget();
			var location = target.convertToNodeSpace(touch.getLocation());
			var targetSize = target.getContentSize();
			var targetRectangle = cc.rect(0,0,targetSize.width, targetSize.height);
			if (cc.rectContainsPoint(targetRectangle, location)) {
				console.log("I picked a tile!");
				if (pickedTiles.indexOf(target) == -1) {
					target.initWithFile("assets/"+target.pictureValue+".png");
					pickedTiles.push(target);
					if (pickedTiles.length == 2) {
						checkTiles();
					}	
				}
			}
		}
	}
});

var shuffle = function(v) {
	for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
	return v;
};

function checkTiles() {
	moves++;
	scoreText.setString("Moves: " + moves);
	var pause = setTimeout(function() {
		if (pickedTiles[0].pictureValue != pickedTiles[1].pictureValue) { // covers if two tiles do not match
			pickedTiles[0].initWithFile("assets/cover.png");
			pickedTiles[1].initWithFile("assets/cover.png");
		}
		else { // remove two tiles from the game
			gameLayer.removeChild(pickedTiles[0]);
			gameLayer.removeChild(pickedTiles[1]);
		}
		pickedTiles = [];
	}, 2000); // give user 2 seconds
}
