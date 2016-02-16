var Daniel = new Bot(240, 220, 'Daniel', 'bots/Daniel/espeon.png');

Daniel.init = function() {
    this.body = this.sprite.body;
    Daniel.body.angle = 100; // Initial Angle
    Daniel.body.speed = -70; // Initial Speed
    Daniel.confusion = 0;
}


Daniel.getStatus = function() {
    return Daniel.stateText;
}

Daniel.found = function() {
    Daniel.confusion = 0;
}

Daniel.update = function() {

    switch (Daniel.state) {
        case 1: //doing fine
            Daniel.body.speed = -70;
            Daniel.stateText = "Everything is fine!";
            if (Math.random() < .5) {
                Daniel.incrementAngle(5);
            } else {
                Daniel.incrementAngle(-5);
            }
            Daniel.confusion++;
            break;

        case 2: //getting lost
            Daniel.body.speed = -40;
            Daniel.stateText = "Getting lost.";
            if (Math.random() < .5) {
                Daniel.incrementAngle(10);
            } else {
                Daniel.incrementAngle(-10);
            }
            Daniel.confusion++;
            break;

        case 3: //lost
            Daniel.body.speed = 0;
            Daniel.stateText = "Where am I?";
            if (Math.random() < .5) {
                Daniel.incrementAngle(15);
            } else {
                Daniel.incrementAngle(-15);
            }
            Daniel.confusion--;
            break;

            // case 4: //found
            //     Daniel.body.speed = 70;
            //     Daniel.stateText = "Oh there I am!";
            //     if (Math.random() < .5) {
            //         Daniel.incrementAngle(5);
            //     } else {
            //         Daniel.incrementAngle(-5);
            //     }
            //     Daniel.confusion++;
            //     break;

        default:
            Daniel.body.speed = -70;
            Daniel.stateText = "Something went wrong";
            break;
    }

    if (Daniel.confusion > 1000) {
        Daniel.state = 3;
    } else if (Daniel.confusion > 500 && Daniel.confusion < 700) {
        Daniel.state = 2;
    } else if (Daniel.confusion < 100) {
        Daniel.state = 1;
    }

    Daniel.basicUpdate();
};
