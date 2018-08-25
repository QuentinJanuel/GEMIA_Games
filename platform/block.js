var Block = {
	list: [],
	create: function(x, y, width, height){
		var block = {
			position: {x: x, y: y},
			dimensions: {x: width, y: height},
			draw: function(){
				Screen.setColor("#333");
				Screen.drawRect(
					this.position.x,
					this.position.y,
					this.dimensions.x,
					this.dimensions.y
				);
			},
			update: function(){
				this.draw();
			}
		};
		this.list.push(block);
	},
	update: function(){
		for(var iBlock = 0; iBlock < this.list.length; ++iBlock){
			this.list[iBlock].update();
		}
	}
};

export default Block;