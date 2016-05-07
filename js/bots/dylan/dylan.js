/**
 * Dylan's bot
 * 
 */
var dylan = CreateTemplateBot(1021, 1000, 'dylan', 'js/bots/dylan/player_car.png');

dylan.affordances = [
	new Affordance ('Honk',
		function(bot) { return true; },
		function(bot, source) { 
			source.makeSpeechBubble('BEEEEEEP');
			source.sociality.subtract(2);
			bot.makeSpeechBubble('OKAY! I am moving');
			bot.sociality.subtract(2);
		}, dylan),
	new Affordance ('Speed',
		function(bot) {return true; },
		function(bot, source) {
			source.currentMotion = Motions.speeding;
			source.makeSpeechBubble('AAAAAAAAAAAAA');
			source.entertainment.add(10);
			source.hunger.add(5);
		}, dylan),
	new Affordance ('Turn off',
		function(bot) {return true; },
		function(bot, source) {
			source.currentMotion = Motions.still;
			source.makeSpeechBubble('*dead silence because cars dont snore*');
			source.health.add(50);
		}, dylan),
	new Affordance ('Joke',
		function(bot) {return true; },
		function(bot, source) {
			source.makeSpeechBubble('I have the heart of a lion and a lifetime ban from the Toronto zoo.');
			source.sociality.add(10);
			bot.makeSpeechBubble('Ew');
			bot.entertainment.add(5);
		}, dylan)

];
dylan.getUtility = function() {
	return this.health.value + this.hunger.value - this.entertainment.value;
}

dylan.selectAction = function() {
	var affordances = this.getAffordances();
	if (affordances.length == 0)
		return this.doNothing;
	else
		return affordances[Math.floor(Math.random() * affordances.length)];
}

/*
var aff = this.getAffordances();
for (a of aff){
	var v = this.policy[a.toString()];
	if(v>=0)
	return a; 
	}
	return aff[0];
	

 */
