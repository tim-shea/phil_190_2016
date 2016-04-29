/**
 * Rey's Bot
 */
var rey = CreateTemplateBot(1200, 1200, 'rey', 'js/bots/rey/whitedeer.png');

rey.affordances = [
	new Affordance('Dance',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Dance with me, yeah?!');
			bot.makeSpeechBubble('Yeah, I am down!');
			source.sociality.add(15);
			source.entertainment.add(20);
			source.makeSpeechBubble('Are you having as much fun as me?!');
			bot.sociality.add(15);
			bot.entertainment.add(20);
		}, rey),
	new Affordance('Rest',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Okay I am pretty tired now. I must rest');
			bot.sociality.subtract(20);
			bot.entertainment.subtract(30);
			ssource.sociality.subtract(15);
			source.entertainment.subtract(30);
			source.hunger.add(40);
		}, rey)
];

rey.getUtility = function() {
	return this.sociality.value - this.hunger.value + this.entertainment.value;
}


rey.selectAction = function() {
	var affordances = this.getAffordances();
	if (affordances.length == 0)
		return this.doNothing;
	else
	return this.getAffordances()[0];
}