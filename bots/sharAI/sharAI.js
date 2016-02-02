var sharAI = new Bot(100, 100, 'sharAI', 'bots/sharAI/sharAI.png');
sharAI.angle = 90;
sharAI.speed = 100;
sharAI.stateText = "sharAI says: Hello!";

var turnRandom = 0;

sharAI.talk = function(array) {
    return array[Math.floor(Math.random() * array.length)]
};

var likeStrings = ["video games", "my mom"];
var talkStrings = ["Beep boop!", ("I miss " + sharAI.talk(likeStrings) )];

sharAI.getStatus = function() {
    return sharAI.stateText;
}

sharAI.update = function() {
    turnRandom = Math.random();
    if (turnRandom < .1) {
        sharAI.speeed = 100;
        sharAI.angle += 5;
    } else if (turnRandom >= .1 && turnRandom < .2) {
        sharAI.speed = 100;
        sharAI.angle -= 5;
    }

    if (turnRandom < .01) {
        sharAI.speed = 0;
        if (Math.random() < .1) {
            sharAI.stateText = ("sharAI says: " + sharAI.talk(talkStrings) );
        }
    }
}


