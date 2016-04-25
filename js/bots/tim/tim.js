/**
 * Reinforcement Learning Bot Template
 */

/**
 * Greedy action selection
 */
function selectActionGreedily(bot) {
	var selectedAffordance = bot.doNothing;
	var selectedPrediction = bot.policy[bot.doNothing.name];
	for (affordance of bot.getAffordances()) {
		var prediction = 0;
		if (affordance.name in bot.policy)
			prediction = bot.policy[affordance.name];
		if (prediction >= selectedPrediction) {
			selectedAffordance = affordance;
			selectedPrediction = prediction;
		}
	}
	return selectedAffordance;
}

/**
 * Exploratory action selection
 */
function selectActionRandomly(bot) {
	var affordances = bot.getAffordances();
	if (affordances.length == 0)
		return bot.doNothing;
	else
		return affordances[Math.floor(Math.random() * affordances.length)];
}

function CreateTemplateBot(x, y, name, image) {
	var templateBot = new Bot(x, y, name, image);
	
	/**
	 * Initialize bot
	 *
	 * @override
	 */
	templateBot.init = function() {
		this.body = this.sprite.body;
		this.body.rotation = 100;
		this.body.speed = 0;
		this.stopMotion = false;
		this.currentMotion = Motions.still;
		this.hunger = new DecayVariable(0, 1, 0, 100);
		this.sociality = new DecayVariable(0, -1, -50, 50);
		this.policy = {'Do Nothing': 0};
		this.affordanceRange = 500;
		this.doNothing = new Affordance(
			"Do Nothing",
			function(bot) { return true; },
			function(bot) {},
			templateBot);
		this.selectedAffordance = this.doNothing;
		this.pastAction = 'Do Nothing';
		this.pastUtility = this.getUtility();
		game.time.events.loop(Phaser.Timer.SECOND * 1, this.update1Sec, this);
	};

	/**
	 * Populate the status field
	 *
	 * @override
	 */
	templateBot.getStatus = function() {
		var status = "Ready"
		status += "\n" + this.hunger.getBar("Hunger");
		status += "\n" + this.sociality.getBar("Sociality");
		status += "\nSpeed: " + this.body.speed;
		status += "\nAngle: " + this.body.rotation;
		status += "\nAction: " + this.selectedAffordance.name;
		status += "\nPolicy: " + JSON.stringify(this.policy);
		status += "\nAffordances: " + this.getAffordances();
		return status;
	}

	/**
	 * Set the current motion state, updated every second.
	 */
	templateBot.setMotion = function() {
		this.body.rotation = this.body.rotation + this.getRandom(-1, 1);
	};

	//////////////////////
	// Update Functions //
	//////////////////////

	/**
	 * Main update called by the phaser game object (about 40 times / sec. on my machine).
	 *
	 * @override
	 */
	templateBot.update = function() {
		if (this.stopMotion) {
			this.currentMotion = Motions.still;
		} else {
			this.currentMotion = Motions.walking;
			this.currentMotion.apply(this);
		    this.genericUpdate();
		}
	};

	/**
	 * Called every second
	 */
	templateBot.update1Sec = function() {
		this.hunger.increment();
		this.sociality.increment();
		this.applyPolicy();
	};
	
	templateBot.doNothing = new Affordance(
		"Do Nothing",
		function(bot) { return true; },
		function(bot) {},
		templateBot);
	
	templateBot.getUtility = function() {
		return 100 - this.hunger.value + this.sociality.value;
	};
	
	/**
	 * Apply the learned policy to action selection
	 */
	templateBot.applyPolicy = function() {
		// Update our policy based on the prediction error of the last action we selected
		var temporalDifference = this.getUtility() - this.pastUtility;
		var prediction = this.policy[this.pastAction];
		var predictionError = prediction - temporalDifference;
		this.policy[this.pastAction] = prediction - 0.25 * predictionError;
		this.pastUtility = this.getUtility();
		// Select an action greedily based on the learned policy
		this.selectedAffordance = selectActionRandomly(this);
		// Apply the selection
		if (!(this.selectedAffordance.name in this.policy))
			this.policy[this.selectedAffordance.name] = 0;
		this.selectedAffordance.action(this);
		this.pastAction = this.selectedAffordance.name;
	}
	
	templateBot.getAffordances = function() {
		var affordances = [];
		for (entity of this.getNearbyObjects(this.affordanceRange)) {
			if (!entity.affordances)
				continue;
			for (affordance of entity.affordances)
				if (affordance.condition(this))
					affordances.push(affordance);
		}
		return affordances;
	}
	
	return templateBot;
}

var tim = CreateTemplateBot(600, 570, 'tim', 'js/bots/tim/cat.png');
tim.affordances = [
	new Affordance('Pet the kitty',
		function(bot) { return true; },
		function(bot) {
			bot.speak('Soft kitty, warm kitty, little ball of fur');
			bot.sociality.value += 5;
		},
		tim)
];

