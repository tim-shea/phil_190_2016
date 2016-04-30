/**
 * Daniel's Bot
 */
var Daniel = CreateTemplateBot(240, 220, 'Daniel', 'js/bots/Daniel/espeon.png');

Daniel.affordances = [
    new Affordance('Dance Party',
        function(bot) {
            return true; },
        function(bot, source) {
            source.currentMotion = Motions.tantrum;
            source.entertainment.add(10);
            source.makeSpeechBubble('Dance Party!');
            bot.currentMotion = Motions.tantrum;
            bot.entertainment.add(10);
            game.time.events.add(Phaser.Timer.SECOND * 5, function() {
                source.currentMotion = Motions.walking;
                source.sociality.add(5);
                bot.currentMotion = Motions.walking;
            }, Daniel);
        }, Daniel),
    new Affordance('Duel',
        function(bot) {
            return true },
        function(bot, source) {
            source.currentMotion = Motions.still;
            source.entertainment.add(5);
            source.sociality.subtract(15);
            source.makeSpeechBubble('Duel me!');
            bot.currentMotion = Motions.still;
            bot.entertainment.add(5);
            bot.sociality.subtract(15);
            game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                source.currentMotion = Motions.walking;
                bot.currentMotion = Motions.walking;
                if (Math.random() < .5) {
                    bot.health.subtract(15);
                    console.log("victory");
                    source.makeSpeechBubble('Victory!');
                } else {
                    source.health.subtract(15);
                    source.makeSpeechBubble('You win this round!');
                    console.log("failure");
                }
            }, Daniel);
        }, Daniel)
];

Daniel.getUtility = function() {
    return this.health.value + this.entertainment.value / 2 + this.sociality.value / 2 - this.hunger.value;
}

Daniel.selectAction = function() {
    var affordances = this.getAffordances();
    var maxPolicy = 0;
    var affordanceChoice = 0;
    for (var i = 0; i < affordances.length; i++) {
    	if (this.policy[i.toString()] < maxPolicy) {
    		affordanceChoice = i;
    		maxPolicy = this.policy[a.toString()];
    	}
    }
    if (Math.random() > .3) {
    	return affordances[affordanceChoice];
    } else {
    	return affordances[Math.floor(Math.random() * affordances.length)];
    }
}