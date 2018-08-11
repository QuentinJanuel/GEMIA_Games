import Screen from "/screen.js";
import Controllers from "/controllers.js";

let ang = 0;

Screen.loop = () => {
	Screen.clearAll();
	Screen.setColor("#00F");
	Screen.drawRect(0, 0, 100, 100);
	Screen.setColor("#F00");
	Screen.drawCircle(300, 1000, 300);
	Screen.drawText(500, 200, "Hello", {
		font: "Comic Sans MS",
		size: 100,
		align: "center"
	});
	ang += 0.01;
	Screen.drawImage(Screen.dimensions.width/2, Screen.dimensions.height/2, "sprite", {
		xscale: 1,
		yscale: 0.5,
		angle: ang
	});
	Screen.drawImage(100, 100, "icon");
}
