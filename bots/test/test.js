var test = new Bot(120, 120, 'test', 'bots/test/test.gif');
test.angle = 50;
test.speed = 100;

test.update = function() {
    if (Math.random() < .1) {
        test.angle += 5;
    }
};
