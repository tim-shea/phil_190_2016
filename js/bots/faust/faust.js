/**
 * faust's bot
 */
var faust = CreateTemplateBot(300, 300, 'faust', 'js/bots/faust/faust.png');

faust.affordances = [
	new Affordance('Read',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('A really good book!');
			source.sociality.add(5);
			bot.makeSpeechBubble('What are you reading?');
			bot.sociality.add(15);
		}, faust),
	new Affordance('Firebend',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Dont hate cuz you cant relate');
			source.sociality.subtract(5);
			source.health.add(10)
			bot.makeSpeechBubble('Dont play with fire!');
			bot.sociality.subtract(10);
		}, faust),
	new Affordance('Sleep',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Zzzz...');
			source.health.add(15);
			source.motions.stop();
			bot.makeSpeechBubble('Are you awake?')
			bot.sociality.subtract(5);
		}, faust),
	new Affordance('Pester',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('You are kind of annoying...');
			source.sociality.add(5);
			bot.sociality.subtract(5);
		}, faust)
];


/** 
 * getUtilitycalculatesabot’scurrent“happiness”orwellbeing 
 * basedonanyvariableswithinthebotorintheworldthat 
 * mightaffectit.
 * Returnanumericvalue.Belowisanexample.
*/

faust.getUtility = function() { 
	return this.health.value - this.hunger.value + this.sociality.value;
}


/**
 * selectAction picks from bot's available affordnces and returns one to
 * execute. You use getAffordances() to generate the list.
 *
 * Return an Affordance
 */

faust.selectAction = function() {
	var affordances = this.getAffordances();
	if (affordances.length == 0)
		return this.doNothing;
	else
		return affordances[Math.floor(Math.random() * affordances.length)];
}


























