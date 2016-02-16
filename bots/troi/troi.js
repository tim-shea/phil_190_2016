var troi = new Bot(250, 250, 'troi', 'bots/troi/umbreon_2.0.png');
troi.angle.speed = 50;
troi.body.speed = 100;

troi.update = function() {
    if (Math.random() < .1) {
        troi.angle.speed += .5;
    }else{
    	troi.angle.speed -= 2;
    }
    if (Math.random() < 0.1) {
    	if (Math.random() < 0.05) {
    		troi.body.speed = 10;
    	}else {
    		troi.body.speed = 100;
    	}
    };
};
