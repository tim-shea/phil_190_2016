/**
 * Jeff's bot
 */
var jeff = CreateTemplateBot(570, 570, 'jeff', 'js/bots/jeff/person.png');

/**
 * More hungry is bad; more sociality and entertainment are good
 */
jeff.getUtility = function() {
    return -1 * this.hunger.value + 100 + this.sociality.value + this.entertainment.value;
}

/**
 * Set of affordances.  
 *
 * TODO: Discuss how to allow bot-makers to only specify the "source" side.
 */
jeff.affordances = [
	new Affordance('Shake Hands',
		function(bot) { return true; },
		function(bot, source) {
			source.makeSpeechBubble('Good to see you');
			source.sociality.add(15);
			bot.sociality.add(15);
		}, jeff),
	new Affordance('Discuss philosophy',
		function(bot) { return true; },
		function(bot, source) {
			// Todo: choose from a list of random things, and maybe make the entertainment boost have a random component
			source.makeSpeechBubble("Better to regret something you have done than something you have haven't done");
			source.entertainment.add(10);
			bot.entertainment.add(10);
		}, jeff)
];


/**
 * Action selection
 */
jeff.selectAction = function() {
	var affordances = this.getAffordances();

	// exploratory
	if(Math.random() > .8) {
		return affordances.randItem();
	}

	// greedy
	var maxVal = -10000;
	var affordanceToChoose = affordances[0];
	for(affordance in affordances) {
		var currentVal = this.policy[affordance.toString()];
		if(currentVal > maxVal) {
			affordanceToChoose = affordance;
		}
	}

	return affordanceToChoose;

}
