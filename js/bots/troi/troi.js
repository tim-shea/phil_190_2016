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
    if (affordances.length === 0) {
        return this.doNothing;
    } else {
        return affordances[Math.floor(Math.random() * affordances.length)];
    }
}
troi.affordances = [
    new Affordance('nap',
        function(bot) {
            return (((timeTroi.getHours() * 100 + timeTroi.getMinutes() )> 1230) 
            	&& (timeTroi.getHours() < 18))
            && (this.health.value > 35 && this.health.value < 95)
            && (this.hunger.value < 60);
        },
        function(bot, source) {
        	this.goHome(5000);

        },
        troi),






]
