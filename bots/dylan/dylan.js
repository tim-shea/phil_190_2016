var dylan = new Bot(240, 220, 'dylan', 'bots/dylan/player_car.png'); 
    
    dylan.angle = 90;
    dylan.speed = 125;

    dylan.stateText = "Status Normal: cruising speed";



dylan.getStatus = function() {
	return dylan.stateText;
}

//getStats & init for later?? 

dylan.update = function() {
	if (Math.random() <.1) {
		dylan.angle += 5;
		dylan.angle = dylan.angle % 270;

	}

	if (Math.random() < .03) {
		if (Math.random() < .7) {
			dylan.speed = 575;
				dylan.stateText = "Punch it!";
		

	
	} else {
		dylan.speed < 0;
			dylan.stateText = "Reversing...";
		dylan.speed == 0;
			dylan.ststeText = "Collision!";	

		}

	}

};