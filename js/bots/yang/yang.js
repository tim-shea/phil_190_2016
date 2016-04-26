/**
 * Yang's Bot
 */
var yang = CreateTemplateBot(2700, 2700, 'yang', 'js/bots/yang/yang.png');

yang.affordances = [
	new Affordance('antler barrier',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Thou shall not pass!For sake of your own goodness.');
			source.health.subtract(5);
			source.hunger.add(5);
			source.sociality.add(15);
			source.entertainment.add(10);
			//-----
			bot.makeSpeechBubble('Let it go already!');
			bot.health.add(15);
			bot.hunger.subtract(15);
			bot.sociality.subtract(15);
			bot.entertainment.add(25);
		}, yang),
	new Affordance('sing the duck song',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('A duck wadles to a lemonade stand, and he said to the man, who running the stand~...');
			source.health.add(5);
			source.sociality.add(15);
			source.entertainment.add(10);
			//-----
			bot.makeSpeechBubble('No that song! NOoooo ');
			bot.hunger.subtract(15);
			bot.sociality.subtract(15);
			bot.entertainment.add(25);
		}, yang),
];

/**
 * yang's value being entertainment, being petted, and eating
 */
yang.getUtility = function() {
	return (this.entertainment.value + this.sociality.value) / this.hunger.value * this.health.value;
}

/**
 * Do something random
 */
yang.selectAction = function() {
	var affordances = this.getAffordances();
	if (affordances.length == 0)
		return this.doNothing;
	else
		return affordances[Math.floor(Math.random() * affordances.length)];
}