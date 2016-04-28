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
/*
troi.getUtility = function() {
    var ave = (this.entertainment.value + this.sociality.value) * 0.70;
    ave += (this.health.value * 0.67 - this.hunger.value * 0.33) * 0.3;
    console.log("0");
    return ave;
}

troi.selectAction = function() {
    var affordances = this.getAffordances();
    if (affordances.length == 0) {
        console.log("1");
        return this.doNothing;
    } else {
        console.log("2");
        //return affordances[Math.floor(Math.random() * affordances.length)];
        return affordances[0];
    }
}
troi.affordances = [
    new Affordance('nap',
        function(bot) {
            return true;
            //return (((timeTroi.getHours() * 100 + timeTroi.getMinutes()) > 1230) && (timeTroi.getHours() * 100 < 1800)) && (bot.health.value > 35 && bot.health.value < 95) && (bot.hunger.value < 60);
        },
        function(bot, source) {
            /*if (Math.random() < 0.15) {
                console.log("3");
                bot.gotTo(400, 400);
            } else if (Math.random() < 0.15) {
                console.log("4");
                bot.gotTo(1000, 2000);
            } else if (Math.randomq() < 0.5) {
                console.log("7");
                bot.gotTo(1200, 1200);
            } else {*/
            console.log("home");
            source.goHome(7000);
            //}
            console.log("6");
            source.Motions            
/*

        },
        troi),
    /*
        new Affordance('Go Home',
            function(bot){
                return (timeTroi.getHours)
                        })

    */




//]
