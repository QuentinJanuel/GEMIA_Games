import Player from "./player.js";
import Block from "./block.js";

Controllers.getList().forEach(function(controller){
	controller.vibrate(500);
	Player.create(controller, Screen.dimensions.width/2, 100);
});

Block.create(100, Screen.dimensions.height*3/4, Screen.dimensions.width-200, 100);
Block.create(100, 200, 100, Screen.dimensions.height*3/4-200);
Block.create(Screen.dimensions.width-200, 200, 100, Screen.dimensions.height*3/4-200);
Block.create(Screen.dimensions.width/2-50, Screen.dimensions.height*3/4-100, 100, 100);
Block.create(Screen.dimensions.width/2-50+200, Screen.dimensions.height*3/4-200, 100, 100);

Screen.loop = function(){
	Screen.clearAll();
	Block.update();
	Player.update(Block.list);
}