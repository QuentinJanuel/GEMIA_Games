var Player = {
	list: [],
	create: function(controller, x, y){
		var player = {
			getController: function(){
				return Controllers.getById(controller.id);
			},
			position: {x: x, y: y},
			dimensions: {x: 50, y: 50},
			origin: {x: 25, y: 25},
			color: controller.color,
			speed: {hor: 0, ver: 0},
			maxSpeed: {hor: 10, ver: 20},
			grav: 1.2,
			jump: 20,
			buttons: {
				jump: false
			},
			isInAir: true,
			collides: function(x, y, blocks){
				for(var iBlock = 0; iBlock < blocks.length; ++iBlock){
					var block = blocks[iBlock];
					// Collides horizontally
					var x1Player = x-this.origin.x;
					var x2Player = x1Player+this.dimensions.x;
					var x1Block = block.position.x;
					var x2Block = x1Block+block.dimensions.x;
					var collidesX = x2Player > x1Block && x1Player < x2Block;
					// Collides vertically
					var y1Player = y-this.origin.y;
					var y2Player = y1Player+this.dimensions.y;
					var y1Block = block.position.y;
					var y2Block = y1Block+block.dimensions.y;
					var collidesY = y2Player > y1Block && y1Player < y2Block;
					if(collidesX && collidesY)
						return true;
				}
				return false;
			},
			move: function(blocks){
				var controller = this.getController();
				if(!controller)
					return;
				var dirs = controller.joysticks.left.directions;
				var sign = function(x){
					if(x > 0)
						return 1;
					if(x < 0)
						return -1;
					return 0;
				}
				
				// Horizontal movement
				this.speed.hor = (dirs.right-dirs.left)*this.maxSpeed.hor;
				// Collisions
				if(this.collides(this.position.x+this.speed.hor, this.position.y, blocks)){
					while(!this.collides(this.position.x+sign(this.speed.hor), this.position.y, blocks))
						this.position.x += sign(this.speed.hor);
					this.speed.hor = 0;
				}
				// Apply
				this.position.x += this.speed.hor;

				// Vertical movement
				if(this.buttons.jump && !this.isInAir){
					this.isInAir = true;
					controller.vibrate(20);
					this.speed.ver = -this.jump;
				}
				this.speed.ver += this.grav;
				this.speed.ver = Math.min(this.speed.ver, this.maxSpeed.ver);
				// Collisions
				if(this.collides(this.position.x, this.position.y+this.speed.ver, blocks)){
					if(this.isInAir){
						controller.vibrate(10);
						this.isInAir = false;
					}
					while(!this.collides(this.position.x, this.position.y+sign(this.speed.ver), blocks))
						this.position.y += sign(this.speed.ver);
					this.speed.ver = 0;
				}
				// Apply
				this.position.y += this.speed.ver;
			},
			draw: function(){
				// Temporary draw the player as a square
				Screen.setColor(this.color);
				Screen.drawRect(
					this.position.x-this.origin.x,
					this.position.y-this.origin.y,
					this.dimensions.x,
					this.dimensions.y
				);
			},
			resetButtons: function(){
				var keys = Object.keys(this.buttons);
				for(var iKey = 0; iKey < keys.length; ++iKey){
					this.buttons[keys[iKey]] = false;
				}
			},
			update: function(Block){
				this.move(Block);
				this.draw();
				this.resetButtons();
			}
		};
		Controllers.onPressed("circle", function(controller){
			if(controller.id == player.getController().id)
				player.buttons.jump = true;
		});
		this.list.push(player);
	},
	update: function(blocks){
		for(var iPlayer = 0; iPlayer < this.list.length; ++iPlayer){
			this.list[iPlayer].update(blocks);
		}
	}
}

export default Player;