/**
 * Tim's cat
 */
var cat = CreateTemplateBot(600, 570, 'cat', 'js/bots/tim/cat.png');

cat.affordances = [
	new Affordance('Pet',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Purr, purr');
			source.sociality.add(15);
			bot.makeSpeechBubble('Soft kitty, warm kitty, little ball of fur');
			bot.sociality.add(5);
		}, cat),
	new Affordance('Attack',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Mrow!');
			source.health.subtract(5);
			bot.sociality.subtract(5);
		}, cat)
];

/**
 * Cat's value being alive, being petted, and eating
 */
cat.getUtility = function() {
	return this.health.value - this.hunger.value + this.sociality.value;
}

/**
 * Do something random
 */
cat.selectAction = function() {
	var affordances = this.getAffordances();
	if (affordances.length == 0)
		return this.doNothing;
	else
		return affordances[Math.floor(Math.random() * affordances.length)];
}
