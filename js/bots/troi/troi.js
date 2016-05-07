/**
 * Troi's Bot
 */
var troi = CreateTemplateBot(45, 2700, 'troi', 'js/bots/troi/umbreon_2.0.png');

this.home_x = 25;
this.home_y = 2700;
troi.treasure = {
    x: 10,
    y: 2930
}
var timeTroi = new Date();

troi.inventory = [];
troi.attackList = ["Shadow Ball", "Dark Pulse", "Payback", "Toxic", "Moonlight", "Agility"];
troi.grimoire = [];

troi.getUtility = function() {
    var ave = (this.entertainment.value + this.sociality.value) * 0.70;
    ave += (this.health.value * 0.67 - this.hunger.value * 0.33) * 0.3;
    return ave;
}

troi.selectAction = function() {
    var affordances = this.getAffordances();
    if (affordances.length == 0) {
        return this.doNothing;
    } else {
        return affordances[Math.floor(Math.random() * affordances.length)];
        // return affordances[0];
    }
}

troi.affordances = [
    new Affordance('nap',
        function(bot) {
            return (timeTroi.getHours() > 12 && timeTroi.getHours < 18) && (bot.health.value > 35 && bot.health.value < 95) && (bot.hunger.value < 60);
            //  return true;
        },
        function(bot, source) {
            /*  var temp = Math.random();
              if (temp < .5) {
                  source.goHome();
                  source.makeSpeechBubble("Homeward. Naptime.");
              } else if (temp < .75) {
                  source.goTo(1200, 1200);
                  source.makeSpeechBubble("Naptime.");
              } else {
                  var temp2 = Math.random();
                  if (temp2 < .5) {
                      source.goTo(400, 400);
                      source.makeSpeechBubble("Naptime.");

                  } else {
                      source.goTo(1000, 2000);
                      source.makeSpeechBubble("Naptime.");
                  }

              }*/
            source.currentMotion = Motions.still;
            source.makeSpeechBubble("Naptime");
            source.health.add(20);
            source.entertainment.subtract(10);
            source.sociality.subtract(10);
            source.hunger.add(5);
        },
        troi),

    new Affordance('Attack',
        function(bot) {
            return true;
        },
        function(bot, source) {
            var attack = troi.attackList[Math.floor(Math.random() * troi.attackList.length)];
            source.sociality.subtract(10);
            bot.sociality.subtract(10);

            source.makeSpeechBubble(attack);
            if (attack == "Shadow Ball") {
                bot.health.subtract(20);
            } else if (attack == "Dark Pulse") {
                bot.health.subtract(25);
            } else if (attack == "Payback") {
                if (source.health.value < 65) {
                    bot.health.subtract(70);
                } else {
                    bot.health.subtract(35);
                }
            } else if (attack == "Toxic") {
                bot.health.subtract(5);
                bot.health.subtract(5);
                bot.health.subtract(5);
                bot.health.subtract(5);
                bot.health.subtract(5);
                bot.health.subtract(5);
                bot.health.subtract(5);
                bot.health.subtract(5);
                bot.currentMotion = Motions.moping;
            } else if (attack == "Moonlight") {
                source.health.add(50);
            } else {
                source.currentMotion = Motions.sonicSpeed;
            }

        },
        troi),

    new Affordance('Forage',
        function(bot) {
            return bot.hunger.value < 70 && bot.health.value > 60;
        },
        function(bot, source) {
            source.currentMotion = Motions.running;
            troi.inventory.add(Math.floor(Math.random() * 1000));
            source.hunger.subtract(3);
            source.entertainment.add(5);
            source.sociality.subtract(1);
        },
        troi),
    
    new Affordance('Catalog',
        function(bot){
            return true;
        },
        function(bot, source){
            troi.grimoire.add(bot.name);
            source.sociality.add(5);
            source.hunger.subtract(3);
            source.entertainment.add(10);

        },troi)

];
