var jeff = new Bot(240, 220,'jeff','bots/jeff/person.png');
jeff.angle = 100;
jeff.speed = 100;

jeff.update = function() {
    if (Math.random() < .2) {
        jeff.angle -= 2;
    }
};