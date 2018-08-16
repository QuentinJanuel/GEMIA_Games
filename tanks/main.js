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
	bullets: [],
	update: function(){
		if(!Scena1.isIn){
			Scena1.init();
		}
		Scena1.physic();
		Screen.clearAll();
		Scena1.draw();
	},
	init: function(){
		Sound.get("drums").play();
		Scena1.players = [];
		for(var i=0; i<Controllers.getList().length; i++){
			var foo = {
				controller: i,
				pos: {x: 100, y: 100},
				angle: 0,
				turretAngle: 0,
				speed: 4,
				reloading: false,
			}
			foo.shoot = function(){
				if(this.reloading){return};
				Sound.get("shoot").play();
				Controllers.getList()[this.controller].vibrate(50);
				Scena1.bullets.push({
					pos:{
						x: this.pos.x+Math.cos(this.turretAngle)*40,
						y: this.pos.y-Math.sin(this.turretAngle)*40
					},
					angle: this.turretAngle,
					speed: 20
				});
			}
			Scena1.players.push(foo);
		}
		Controllers.onPressed("circle", function(controller){
			if(!Scena1.isIn){return};
			Scena1.event(controller, "circle");
		});
		Scena1.isIn = true;
	},
	draw: function(){
		for(var i=0; i<Scena1.players.length; i++){
			var client = Scena1.players[i];
			var controller = Controllers.getList()[client.controller];
			Screen.drawImage(client.pos.x, client.pos.y, "tankBase", {
				xscale: 3,
				yscale: 3,
				angle: client.angle-3.14159/2,
			});
			Screen.drawImage(client.pos.x, client.pos.y, "tankTurret", {
				xscale: 3,
				yscale: 3,
				angle: client.turretAngle-3.14159/2
			});
		}
		for(var i=0; i<Scena1.bullets.length; i++){
			var bullet = Scena1.bullets[i];
			Screen.drawImage(bullet.pos.x, bullet.pos.y, "bullet", {
				xscale: 2,
				yscale: 2,
				angle: bullet.angle
			});
		}
	},
	physic: function(){
		for(var i=0; i<Scena1.players.length; i++){
			var client = Scena1.players[i];
			var controller = Controllers.getList()[client.controller];
			//Left joystick control tank angle and speed
			if(controller.joysticks.left.angle != 0){
				var turns = Math.round(client.angle/(2*3.14159));
				var oldRequest = (controller.joysticks.left.angle)+turns*(2*3.14159);
				var deltaOld = (client.angle - oldRequest);
				var newRequest = oldRequest + 2*3.14159;
				var deltaNew = (client.angle - newRequest);
				while(Math.abs(deltaOld) > Math.abs(deltaNew)){
					oldRequest += 2 * 3.14159;
					newRequest = oldRequest + 2*3.14159;

					deltaOld = (client.angle - oldRequest);
					deltaNew = (client.angle - newRequest);
				}
				client.angle -= deltaOld*0.1;
				client.turretAngle -= deltaOld*0.1;
			}
			Scena1.players[i].pos.x += Math.cos(client.angle)*controller.joysticks.left.distance*client.speed;
			Scena1.players[i].pos.y -= Math.sin(client.angle)*controller.joysticks.left.distance*client.speed;

			//Right joystick control turret angle
			if(controller.joysticks.right.angle != 0){
				var turns = Math.round(client.turretAngle/(2*3.14159));
				var oldRequest = (controller.joysticks.right.angle)+turns*(2*3.14159);
				var deltaOld = (client.turretAngle - oldRequest);
				var newRequest = oldRequest + 2*3.14159;
				var deltaNew = (client.turretAngle - newRequest);
				while(Math.abs(deltaOld) > Math.abs(deltaNew)){
					oldRequest += 2 * 3.14159;
					newRequest = oldRequest + 2*3.14159;

					deltaOld = (client.turretAngle - oldRequest);
					deltaNew = (client.turretAngle - newRequest);
				}
				client.turretAngle -= deltaOld*0.1;
			}
		}
		//Move bullets
		for(var i=0; i<Scena1.bullets.length; i++){
			var bullet = Scena1.bullets[i];
			Scena1.bullets[i].pos.x += bullet.speed*Math.cos(bullet.angle);
			Scena1.bullets[i].pos.y -= bullet.speed*Math.sin(bullet.angle);
		}
	},
	event: function(controller, type){
		if(!Scena1.isIn){return};
		for(var i=0; i<Scena1.players.length; i++){
			if(controller.id == Controllers.getList()[i].id){
				Scena1.players[i].shoot();
			}
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
				Hub.isIn = false;
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
		Sound.get("trumpets").play();
		Controllers.onPressed("circle", function(controller){
			if(!Hub.isIn){return};
			Hub.event(controller, "circle");
		});
	},
	event: function(controller, type){
		controller.vibrate(50);
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