var Daniel = new Bot(240, 220, 'Daniel', 'bots/Daniel/espeon.png');
Daniel.angle = 100; // Initial Angle
Daniel.speed = -70; // Initial Speed
Daniel.confusion = 0;


Daniel.getStatus = function() {
	return Daniel.stateText;
}

Daniel.update = function() {

	switch (Daniel.state) {
		case 1: //doing fine
			Daniel.speed = -70;
			Daniel.stateText = "Everything is fine!";
			if (Math.random() < .5) {
        		Daniel.angle += 5;
    		} 
    		else {
        		Daniel.angle -= 5;
    		}
    		Daniel.confusion++;
    		break;

    	case 2: //getting lost
    		Daniel.speed = -40;
    		Daniel.stateText = "Getting lost.";
    		if (Math.random() < .5) {
        		Daniel.angle += 10;
    		} 
    		else {
        		Daniel.angle -= 10;
        	}
        	Daniel.confusion++;
        	break;

        case 3: //lost
        	Daniel.speed = 0;
        	Daniel.stateText = "Where am I?";
        	if (Math.random() < .5) {
        		Daniel.angle += 15;
    		} 
    		else {
        		Daniel.angle -= 15;
        	}
        	Daniel.confusion--;
        	break;

        default:
        	Daniel.speed = 70;
        	Daniel.stateText = "Something went wrong";
        	break;
	}

if (Daniel.confusion > 1000) {
	Daniel.state = 3;
}
else if (Daniel.confusion > 500 && Daniel.confusion < 700) {
	Daniel.state = 2;
}
else if (Daniel.confusion < 100) {
	Daniel.state = 1;
}

};

