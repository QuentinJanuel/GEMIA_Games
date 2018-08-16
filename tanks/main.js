"use strict";

var WIDTH = Screen.dimensions.width;
var HEIGHT = Screen.dimensions.height;

/*
##############################
SCENES
##############################
*/

var scene;

function changeScene(scenario){
	scene = scenario;
}

var Scena1 = {
	isIn: false,
	players: [],
	update: function(){
		if(!Scena1.isIn){
			Scena1.init();
		}
		Scena1.physic();
		Screen.clearAll();
		Scena1.draw();
	},
	init: function(){
		Scena1.players = [];
		for(var i=0; i<Controllers.getList().length; i++){
			Scena1.players.push({
				controller: i,
				pos: {x: 0, y: 0},
			});
		}
		Scena1.isIn = true;
	},
	draw: function(){
		for(var i=0; i<Scena1.players.length; i++){
			var client = Scena1.players[i];
			var controller = Controllers.getList()[Scena1.players[i].controller];
			Screen.setColor(controller.color);
			Screen.drawRect(client.pos.x, client.pos.y, 50, 50);
		}
	},
	physic: function(){
		for(var i=0; i<Scena1.players.length; i++){
			var controller = Controllers.getList()[Scena1.players[i].controller];
			Scena1.players[i].pos.x += Math.cos(controller.joysticks.left.angle)*controller.joysticks.left.distance*2;
			Scena1.players[i].pos.y -= Math.sin(controller.joysticks.left.angle)*controller.joysticks.left.distance*2;
		}
	}
}

var Hub = {
	isIn: false,
	selectIndex: 0,
	JoyMoved:false,
	button:[
		{
			text: "Play",
			callback: function(){
				changeScene(Scena1);
				//
			}
		},
		{
			text: "Settings",
			callback: null
		}
	],
	buttonHeight: 100,
	update: function(){
		if(!Hub.isIn){
			Hub.init();	
		}
		var specialRound = function(x){
			if(x > 0.5) return 1;
			if(x < -0.5) return -1;
			return 0;
		}
		var joyDir = 0;
		if(Controllers.getMain()){
			joyDir = specialRound(Math.sin(Controllers.getMain().joysticks.left.angle));
			if(joyDir == 0){
				Hub.JoyMoved = false;
			}
			if(Hub.JoyMoved){
				joyDir = 0;
			}
			if(joyDir != 0){
				Hub.JoyMoved = true;
			}
		}
		if(joyDir == 1){
			Hub.selectIndex = Hub.selectIndex-1;
			if(Hub.selectIndex < 0){
				Hub.selectIndex = 0;
			}
		}else if(joyDir == -1){
			Hub.selectIndex = Hub.selectIndex+1;
			if(Hub.selectIndex > Hub.button.length-1){
				Hub.selectIndex = Hub.button.length-1;
			}
		}
		if(joyDir != 0){
			Controllers.getMain().vibrate(50);
		}
		Screen.clearAll();
		Hub.draw();
	},
	init:function(){
		Hub.isIn = true;
		Controllers.onPressed("circle", function(controller){
			controller.vibrate(50);
			Hub.event("circle");
		});
	},
	event: function(type){
		if(type == "circle"){
			Hub.button[Hub.selectIndex].callback();
		}
	},
	draw: function(){
		Screen.setColor("#000");
		for(var i=0; i<Hub.button.length; i++){
			var text = Hub.button[i].text
			if(Hub.selectIndex == i){text = "> " + text + " <"}
			Screen.drawText(0.5*WIDTH, 0.5*HEIGHT+Hub.buttonHeight*i, text, {
				font: "Courier New",
				size: 50,
				align: "center"
			});
		}
	}
};

/*
##############################
MAIN
##############################
*/

changeScene(Hub);

Screen.loop = function(){
	scene.update();
}