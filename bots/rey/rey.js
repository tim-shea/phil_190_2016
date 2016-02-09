var rey = new Bot(240, 220, 'rey', 'bots/rey/whitedeer.png');
rey.angle = 50; // Initial Angle
rey.speed = 100; // Initial Speed

rey.stateText = "Beware the break-dancing mighty deer!"; //break-dancing mighty deer because everytime it stops to rest it moves like crazy

rey.getStatus = function() {
    return rey.stateText;
}

rey.update = function() {
    if (Math.random() < .1) {
        rey.angle += 100;
        rey.angle = rey.angle % 180;
    }
    if (Math.random() < .01) {
        if (Math.random() < .5) {
            rey.speed = 300;
            rey.stateText = "Here comes the break-dancing mighty deer!";
        } else {
            rey.speed = 0;
            rey.stateText = "Time to bust a move! *begins break-dancing*";
        }
    }
};