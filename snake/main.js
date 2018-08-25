var step = 60;
var margin = 2;
var time = 0;
var speedInterval = 20;

var drawGrid = function(){
	for(var iGrid = 0; iGrid < Screen.dimensions.width; iGrid += step){
		for(var jGrid = 0; jGrid < Screen.dimensions.height; jGrid += step){
			Screen.setColor("#CCC");
			Screen.drawRect(iGrid+margin, jGrid+margin, step-margin*2, step-margin*2);
		}
	}
}

var Snakes = [];

var newSnake = function(controllerID, x, y, length, initialDir){
	var controller = Controllers.getById(controllerID);
	if(!controller)
		return;
	var tail = [];
	for(var iTail = 0; iTail < length; ++iTail){
		tail[iTail] = {
			x: x,
			y: y
		};
	}
	var snake = {
		controllerID: controllerID,
		color: controller.color,
		tail: tail,
		dir: initialDir,
		move: function(){
			// Move tail
			for(var iTail = this.tail.length-1; iTail > 0; --iTail){
				this.tail[iTail].x = this.tail[iTail-1].x;
				this.tail[iTail].y = this.tail[iTail-1].y;
			}
			// Move head
			var controller = Controllers.getById(this.controllerID);
			if(!controller)
				return;
			var dirs = controller.joysticks.left.directions;
			if(dirs.right)
				this.dir = 0;
			if(dirs.up)
				this.dir = 1;
			if(dirs.left)
				this.dir = 2;
			if(dirs.down)
				this.dir = 3;
			switch(this.dir){
				case 0:
					this.tail[0].x++;
					break;
				case 1:
					this.tail[0].y--;
					break;
				case 2:
					this.tail[0].x--;
					break;
				case 3:
					this.tail[0].y++;
					break;
			}
		},
		draw: function(){
			Screen.setColor(this.color);
			for(var iTail = 0; iTail < this.tail.length; ++iTail){
				var pos = this.tail[iTail];
				Screen.drawRect(
					step*pos.x+margin,
					step*pos.y+margin,
					step-2*margin,
					step-2*margin
				);
			}
		},
		update: function(){
			if(time%speedInterval == 0)
				this.move();
			this.draw();
		}
	};
	Snakes.push(snake);
}

Controllers.getList().forEach(function(controller){
	newSnake(controller.id, 0, 0, 7, 0);
});

console.log(Snakes);

Screen.loop = function(){
	Screen.clearAll();
	Screen.setColor("#000");
	Screen.drawRect(0, 0, Screen.dimensions.width, Screen.dimensions.height);
	drawGrid();
	for(var i = 0; i < Snakes.length; ++i){
		Snakes[i].update();
	}
	time++;
}