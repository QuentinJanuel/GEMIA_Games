let ang = 0, ang2 = 0;

Screen.loop = () => {
	Screen.clearAll();
	Screen.setColor("#00F");
	Screen.drawRect(0, 0, 100, 100);
	Screen.setColor("#F00");
	Screen.drawCircle(300, 1000, 300);
	Screen.drawText(500, 200, "WE ARE THE BEST", {
		font: "Comic Sans MS",
		size: 100
	});
	//
	if(Controllers.length > 0){
		const angle = Controllers[0].joystick.left.angle;
		if(angle != 0)
			ang = -(angle-270)*Math.PI/90;
	}
	if(Controllers.length > 1){
		const angle = Controllers[1].joystick.left.angle;
		if(angle != 0)
			ang2 = -(angle-270)*Math.PI/90;
	}
	//
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
