/**
 * sharAI's bot
 */
var sharAI = CreateTemplateBot(2950, 75, 'sharAI', 'js/bots/sharAI/sharAI.png');

sharAI.affordances = [
    new Affordance('Attack',
        function(bot) {
            return true;
        },
        function(bot, source) {
            source.makeSpeechBubble("Argh! \@\!\$\% you too, " + bot.name + "!");
            source.health.subtract(5);
            bot.sociality.subtract(5);
        }, sharAI),

    new Affordance('Feed',
        function(bot) {
            return true;
        },
        function(bot, source) {
            bot.makeSpeechBubble("Want a snack?");
            source.makeSpeechBubble("Oh! Thank you, " + bot.name + "!");
            bot.sociality.add(10);
            source.sociality.add(5);
            bot.hunger.add(5);
            source.hunger.subtract(5);
        }, sharAI),

    new Affordance('Joke',
        function(bot) {
            return true; },
        function(bot, source) {
            switch (Math.floor(Math.random() * 11)) {
                case 0: default:
                    bot.makeSpeechBubble("How do spiders communicate?");
                    source.makeSpeechBubble("Through the World Wide Web!");
                    break;
                case 1:
                	bot.makeSpeechBubble("What do you call an undercover arachnid?");
                	source.makeSpeechBubble("A spy-der!");
                	break;
               	case 2:
               		bot.makeSpeechBubble("What do geeky spiders like to do?");
               		source.makeSpeechBubble("Make websites!");
               		break;
               	case 3:
               		bot.makeSpeechBubble("What do you get when you cross spiders and corn?");
               		source.makeSpeechBubble("Cobwebs!");
               		break;
               	case 4:
               		bot.makeSpeechBubble("What part of a computer does a spider use?");
               		source.makeSpeechBubble("A webcam!");
               		break;
               	case 5:
               		bot.makeSpeechBubble("What do spiders do when they get angry?");
               		source.makeSpeechBubble("They go up the wall!");
               		break;
               	case 6:
               		bot.makeSpeechBubble("What did the mother spider say to her child?");
               		source.makeSpeechBubble("\"You spend too much time on the web!\"");
               		break;
               	case 7:
               		bot.makeSpeechBubble("Why are spiders good swimmers?");
               		source.makeSpeechBubble("They have webbed feet!");
               		break;
               	case 8:
               		bot.makeSpeechBubble("What do you call an Irish spider?");
               		source.makeSpeechBubble("A racist joke? Really, dude?");
               		bot.sociality.subtract(10);
               		source.sociality.subtract(5);
               		bot.entertainment.subtract(5);
               		source.entertainment.subtract(10);
               		break;
               	case 9:
               		bot.makeSpeechBubble("What do you call two young married spiders?");
               		source.makeSpeechBubble("Newly webs!");
               		break;
               	case 10:
               		bot.makeSpeechBubble("Why did the spider sit next to Miss Muffet?");
               		source.makeSpeechBubble("To find out what the hell is a tuffet!");
               		break;
               	case 11:
               		bot.makeSpeechBubble("What did one spider say to the other?");
               		source.makeSpeechBubble("Time's fun when you\'re having flies!");
               		break;
            }
            bot.entertainment.add(5);
            source.entertainment.add(5);
            bot.sociality.add(5);
            source.sociality.add(5);
        }, sharAI)
];

sharAI.getUtility = function() {
    return (this.health.value + this.entertainment.value) - (this.hunger.value + this.sociality.value);
}

sharAI.selectAction = function() {
    var affordances = this.getAffordances();
    if (affordances.length == 0) {
        return this.doNothing;
    } else {
        if (Math.random() > .8) {
            return affordances[Math.floor(Math.random() * affordances.length)];
        } else {
            var maxValue = 0;
            var chosenAction = this.doNothing;
            for (a of affordances) {
                var value = this.policy[a.toString()];
                if (value > maxValue) {
                    maxValue = value;
                    chosenAction = a;
                }
            }
            return chosenAction;
        }
    }
}
