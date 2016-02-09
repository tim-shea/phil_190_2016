var duyen = new Bot(150, 150, 'duyen', 'bots/duyen/duyen.png');
	
duyen.angle = 90;
duyen.speed = 100;

duyen.stateText = "just flowing around";

duyen.getStatus = function() {
 	return duyen.stateText;
}

duyen.update = function() {
 	if (Math.random() < .1) {
 		duyen.angle +=5;
 		duyen.angle = duyen.angle % 120; 
 }
	
if (Math.random() < 0.1) {
	if (Math.random() < 0.05) {
			duyen.speed = 10;
 		}
 		else {
 			duyen.speed = 100;
 		}
 	}
 };