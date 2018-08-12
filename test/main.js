import Test from "./test.js";

Test.sayHello();

let ang = 0, ang2 = 0;

Controllers.onJoin = () => {
	console.log("someone join");
}
Controllers.onQuit = () => {
	console.log("someone left");
}

Controllers.onPressed("home", controller => {
	console.log("home pressed");
	controller.vibrate(100);
});
Controllers.onPressed("square", controller => {
	console.log("square pressed");
	controller.vibrate(100);
});
Controllers.onPressed("circle", controller => {
	console.log("circle pressed");
	controller.vibrate(100);
});

Screen.loop = () => {
	let main = Controllers.getMain();
	Screen.clearAll();
	Screen.setColor("#000");
	if(main)
		Screen.setColor(main.color);
	Screen.drawRect(0, 0, 100, 100);
	Screen.setColor("#F00");
	Screen.drawCircle(300, 1000, 300);
	Screen.drawText(500, 200, "WE ARE THE BEST", {
		font: "Comic Sans MS",
		size: 100
	});
	if(main){
		const angle = main.joysticks.left.angle;
		const angle2 = main.joysticks.right.angle;
		if(angle != 0)
			ang = angle-Math.PI/2;
		if(angle2 != 0)
			ang2 = angle2-Math.PI/2;
	}
	Screen.drawImage(Screen.dimensions.width/3, Screen.dimensions.height/2, "sprite", {
		xscale: 0.5,
		yscale: 0.5,
		angle: ang
	});
	Screen.drawImage(Screen.dimensions.width*2/3, Screen.dimensions.height/2, "sprite", {
		xscale: 0.5,
		yscale: 0.5,
		angle: ang2
	});
	Screen.drawImage(100, 100, "icon");
}
