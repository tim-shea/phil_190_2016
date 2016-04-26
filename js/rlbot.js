/**
 * Reinforcement Learning Bot Template
 */
function CreateTemplateBot(x, y, name, image) {
	var templateBot = new Bot(x, y, name, image);
	
	/**
	 * Initialize bot
	 */
	templateBot.init = function() {
		// Setup basic bot stuff
		this.body = this.sprite.body;
		this.body.rotation = 100;
		this.body.speed = 0;
		this.currentMotion = Motions.walking;
		
		// Health starts at 100 and increases by 1 each second. Being
		// attacked can lower health. 0 is very uncomfortable and 100 is healthy.
		this.health = new DecayVariable(100, 1, 0, 100);
		
		// Hunger starts at 0 and increases by 1 each second. Eating
		// subtracts 1 hunger per 10 calories. -100 is painfully overfull
		// while 100 is starving!
		this.hunger = new DecayVariable(0, 1, -100, 100);
		
		// Sociality starts at 0 and decreases by 1 each second. Socializing
		// adds a fixed amount based on the action. -100 is very lonely while
		// 100 is satisfyingly gregarious.
		this.sociality = new DecayVariable(0, -1, -100, 100);
		
		// Entertainment starts at 0 and decreases by 1 each second. Trying
		// interesting things adds a fixed amount. -100 is sooo bored while
		// 100 is perfectly entertained.
		this.entertainment = new DecayVariable(0, -1, -100, 100);
		
		// Setup the reinforcement-specific stuff
		this.policy = {};
		this.affordanceRange = 250;
		this.doNothing = new Affordance(
			'DoNothing',
			function(bot) { return true; },
			function(bot) {},
			templateBot);
		this.selectedAffordance = this.doNothing;
		this.pastAction = 'DoNothing(' + name + ')';
		this.policy[this.pastAction] = 0;
		this.pastUtility = this.getUtility();
		this.learningRate = 0.1;
		game.time.events.loop(Phaser.Timer.SECOND * 1, this.update1Sec, this);
	};

	/**
	 * Populate the status field
	 */
	templateBot.getStatus = function() {
		var status = "Ready"
		status += "\n" + this.health.getBar("Health");
		status += "\n" + this.hunger.getBar("Hunger");
		status += "\n" + this.sociality.getBar("Sociality");
		status += "\n" + this.entertainment.getBar("Entertainment");
		status += "\nUtility: " + this.getUtility();
		status += "\nSpeed: " + this.body.speed;
		status += "\nAngle: " + this.body.rotation;
		status += "\nAction: " + this.selectedAffordance.name;
		status += "\nPolicy: ";
		for (action in this.policy) {
			status += "\n\t" + action + " = " + this.policy[action];
		}
		status += "\nAffordances: " + this.getAffordances();
		return status;
	}

	/**
	 * Main update called by the phaser game object (about 40 times / sec. on my machine).
	 */
	templateBot.update = function() {
		this.currentMotion.apply(this);
		this.genericUpdate();
	};

	/**
	 * Called every second
	 */
	templateBot.update1Sec = function() {
		this.hunger.increment();
		this.sociality.increment();
		this.entertainment.increment();
		this.applyPolicy();
	};
	
	// Every template bot has a doNothing action for when there's nothing
	// better to do.
	templateBot.doNothing = new Affordance(
		"Do Nothing",
		function(bot) { return true; },
		function(bot) {},
		templateBot);
	
	/**
	 * Return the current utility of the bot, which should combine all the
	 * factors that affect this bot's wellbeing into a single numeric value.
	 */
	templateBot.getUtility = function() {
		return this.health.value;
	};
	
	/**
	 * Default action selection is to just do nothing all the time. Very boring.
	 */
	templateBot.selectAction = function() {
		return this.doNothing;
	};
	
	/**
	 * Apply the learned policy to action selection
	 */
	templateBot.applyPolicy = function() {
		// Update our policy based on the prediction error of the last action we selected
		var temporalDifference = this.getUtility() - this.pastUtility;
		var prediction = this.policy[this.pastAction];
		var predictionError = prediction - temporalDifference;
		this.policy[this.pastAction] = prediction - this.learningRate * predictionError;
		this.pastUtility = this.getUtility();
		// Select an action
		this.selectedAffordance = this.selectAction();
		// Apply the selection
		if (!(this.selectedAffordance.toString() in this.policy))
			this.policy[this.selectedAffordance.toString()] = 0;
		this.selectedAffordance.action(this, this.selectedAffordance.source);
		this.pastAction = this.selectedAffordance.toString();
	}
	
	templateBot.getAffordances = function() {
		var affordances = [this.doNothing];
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