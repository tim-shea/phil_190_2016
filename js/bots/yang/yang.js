/**
 * Yang's Bot
 */
var yang = CreateTemplateBot(2700, 2700, 'yang', 'js/bots/yang/yang.png');

///////////////////////////////////////////////////////////////////////////
//One leve of variable only contains :                                   //
//basic variables and references                                         //
//basic functions that manipulate basic variables and references         //
//objects that has its own basic variables, basic functions and objects  //
//"_" marks objects                                                      //
///////////////////////////////////////////////////////////////////////////
/**
 * combine all debug related stuff.
 * @memberOf yang
 * @type {Object}
 */
yang.test_ = {};
/**
 * combine all debug productions related stuff.
 * @memberOf yang.test_
 * @type {Object}
 */
yang.test_.test_production = [];
/**
 * combine all text related varandfun.
 * @memberOf yang
 * @type {Object}
 */
yang.text_ = {};
/**
 * combine all additional non-initializor functions.
 * @memberOf yang
 * @type {Object}
 */
yang.fun_ = {};
/**
 * stores random number for repeated use.
 * @memberOf yang
 * @type {Object}
 */
yang.chaosmachine_ = {};
/**
 * basic bio states of resources.
 * @memberOf yang
 * @type {Object}
 */
yang.biomachine_ = {};
/**
 * basic mind states of spirit.
 * @memberOf yang
 * @type {Object}
 */
yang.mindmachine_ = {};
/**
 * Pleasure and Pain
 * @memberOf yang
 * @type {Object}
 */
yang.ultility_sum_ = {};
/**
 * A node of nothing.
 * @memberOf yang
 * @type {Object}
 */
yang.void_node = { type: "void" };
/**
 * major node's code storage
 * @memberOf yang
 * @type {Object}
 */
yang.node_ = {};
/**
 * stores sequences of productions
 * @memberOf yang
 * @type {Object}
 */
yang.production_ = {};
/**
 * fire upon collision
 * @memberOf yang.production_
 */
yang.production_.inter_action = [];
/**
 * fire in reactions wrapup
 * @memberOf yang.production_
 */
yang.production_.inter_reaction = [];
/**
 * fire during Goal calculation
 * @memberOf yang.production_
 */
yang.production_.goal_production = [];
/**
 * fire in every reaction, because flag
 * @memberOf yang.production_
 */
yang.production_.inter_reactivememorization = [];
/**
 * goal related directional adjustment
 * @memberOf yang.production_
 */
yang.production_.direction = [];
/**
 * remembered object and etc
 * @memberOf yang
 * @type {Object}
 */
yang.memory_ = {};
/**
 * yang's goal set
 * @memberOf yang
 * @type {Object}
 */
yang.goal_ = new GoalSet();
/**
 * major node reference, those index names are magic
 * @memberOf yang
 * @type {Object}
 */
yang["mental_task_node"] = yang.void_node;
yang["speed_node"] = yang.void_node;
yang["acceleration_node"] = yang.void_node;
yang["rotation_node"] = yang.void_node;
/**
 * Path for BGM
 * @type {String}
 */
yang.BGM = '';
/**
 * BGM Path
 * @return {String} [path of file]
 */
yang.fun_.generate_BGM_path = function () {
    var list_of_paths = [
        'assets/A Magnificent Sight.mp3',
        'assets/At the End of the Wait.mp3',
        'assets/At the End of the Wait.mp3',
        'assets/Belfast.mp3',
        'assets/coockiecatinstrumental.m4a',
        'assets/Counter-Attack of Light (Shadowy Requiem).mp3',
        'assets/Do not Tease Me.mp3',
        'assets/Friend of solitude and loneliness.mp3',
        'assets/Mischievous Soul.mp3',
        'assets/Nameless Tombstone.mp3',
        'assets/okkusenman.mp3',
        'assets/Old Heros Visage.mp3',
        'assets/Shadow of Early Dawn.mp3',
        'assets/Soul of Freedom.mp3',
        'assets/Tale that was not told.mp3',
        'assets/The Dance of Leaves.mp3',
        'assets/The Final Stand.mp3',
        'assets/The Star above Falias.mp3',
        'assets/The Story of a White Deer.mp3',
        'assets/Unspeakable Evil.mp3',
        'assets/Viridian Emerald.mp3'
    ];
    return  list_of_paths[Math.round(Math.random() * (list_of_paths.length - 1))];
}
yang.BGM = yang.fun_.generate_BGM_path();//must declare befor load





//NEW STUFF
/**
 * for comparison
 * @type {Number}
 */
yang.memory_.best_policy_value = 0;


yang.affordances = [
	new Affordance('Music On',
		function(bot) { return !sounds.rand_BGM.isPlaying; },
		function(bot, source) {
			source.makeSpeechBubble('Wisps Bless you.');
			source.sociality.add(15);
			source.entertainment.add(20);
			//-----
			bot.makeSpeechBubble('Woot!');
			bot.hunger.subtract(5);
			bot.sociality.subtract(5);
			bot.entertainment.add(30);
			bot.playSound(sounds.rand_BGM, true, true);
		}, yang),
	new Affordance('Music Off',
		function(bot) { return sounds.rand_BGM.isPlaying; },
		function(bot, source) {
			source.makeSpeechBubble('Ok...');
			source.sociality.add(15);
			//-----
			bot.makeSpeechBubble('I have had enough');
			bot.sociality.subtract(15);
			bot.entertainment.add(25);
			sounds.rand_BGM.pause;
		}, yang),
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
			source.makeSpeechBubble('A duck wadled to a lemonade stand, and he said to the man, who running the stand~...');
			source.health.add(5);
			source.sociality.add(15);
			source.entertainment.add(10);
			//-----
			bot.makeSpeechBubble('No that song! NOoooo ');
			bot.hunger.subtract(15);
			bot.sociality.subtract(15);
			bot.entertainment.add(25);
		}, yang)
];

/**
 * yang's value being entertainment, being petted, and eating
 */
yang.getUtility = function() {
	return (this.entertainment.value + this.sociality.value) / this.hunger.value * this.health.value;
}

/**
 * Important!!
 */
yang.selectAction = function() {
	var affordances = this.getAffordances();
	if (affordances.length == 0) {
		return this.doNothing;
	} else {
		// find a choice that is never made! I'm Chaotic
		var i = 0;
		while (i < affordances.length && (!affordances[i].toString() in this.policy)) {
				i++;
			}
		}
		if (i != affordances.length) {
			return affordances[i];
		} else {
			possible_action = [];
			//recycle i
			i = 0;
			yang.memory_.best_policy_value = 0;
			while (i < affordances.length) {		
				if (this.policy[affordances[i].toString()] > yang.memory_.best_policy_value) {
					//set new standard
					yang.memory_.best_policy_value = this.policy[affordances[i].toString()];
					possible_action = [];
					possible_action.push(affordances[i]);
				} else if (this.policy[affordances[i].toString()] == yang.memory_.best_policy_value) {
					possible_action.push(affordances[i]);
				}
				i++;
			}
			return possible_action[Math.floor(Math.random() * possible_action.length)];
		}
}
