var sharAI = new Bot(100, 100, 'sharAI', 'bots/sharAI/sharAI.png');
sharAI.angle = 90;
sharAI.speed = 100;

var turnRandom = 0;

sharAI.update = function() {
	turnRandom = Math.random();
    if (turnRandom < .1) {
        sharAI.angle += 5;
        //console.log("sharAI is turning a little bit to the left");
    } else if (turnRandom >= .1 && turnRandom < .2) {
    	sharAI.angle -= 5;
    	//console.log("sharAI is turning a little bit to the right");
    }
};
