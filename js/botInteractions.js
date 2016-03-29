/**
 * Override to react when hearing something
 *
 * @param  {Bot} botWhoSpokeToMe who talked to me
 * @return {String} whatTheySaid what they said!
 */
Bot.prototype.hear = function(botWhoSpokeToMe, whatTheySaid) {
    console.log(botWhoSpokeToMe.name + " said " + whatTheySaid);
}

/**
 * High five a specified bot
 *
 * @param {Bot} botToHighFive the bot to high five
 */
Bot.prototype.highFive = function(botToHighFive) {
    if (botToHighFive instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToHighFive.sprite) < 100) {
            botToHighFive.highFived(this);
        }
    }
}

/**
 * Override to react when high fived
 *
 * @param  {Bot} botWhoSpokeToMe who talked to me
 */
Bot.prototype.highFived = function(botWhoHighFivedMe) {
    console.log(botWhoHighFivedMe.name + " high fived " + this.name);
}

/**
 * Bite a specified bot
 *
 * @param {Bot} botToAttack The bot to bite
 * @param {Number} damage Strength of the bite
 */
Bot.prototype.bite = function(botToAttack, damage) {
    if (botToAttack instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botToAttack.sprite) < 50) {
            botToAttack.gotBit(this, damage);
        }
    }
};

/**
 * Override to react when attacked
 *
 * @param {Bot} botWhoAttackedMe The bot that bit me
 * @param {Number} damage The amount of damage done
 */
Bot.prototype.gotBit = function(botWhoAttackedMe, damage) {
    console.log(botWhoAttackedMe.name + "attacked me!");
};

/**
 * caress with antler
 * @param {Bot} target bot
 * @param {String} message
 */
Bot.prototype.antler_caress = function(botTocaress, message) {
    // console.log(botTocaress.name + message);
};
/**
 * Override to react when caressed
 * @param {Bot} target bot
 * @param {String} message
 */
Bot.prototype.antler_caressed = function(botWhocaresedMe, message) {
    // console.log(botWhocaresedMe.name + "If you stroke this antler, you will be blessed by the wisps that lives on them.");
};

/**
 * Crush a bot at close proximity
 * @param  {Bot} botToCrush the bot being crushed
 * @param  {number} damage     damage of crushing, should be higher than biting?
 * 
 */
Bot.prototype.crush = function(botToCrush, damage) {
    if (botToCrush instanceof Bot) {
        if(game.physics.arcade.distanceBetween(this.sprite, botToCrush.sprite) < 10) {
            botToCrush.gotCrushed(this, damage);
        }
    }
}

Bot.prototype.gotCrushed = function(botToCrush) {
    //console.log(botToCrush.name + " got crushed by dylan.");
};

/**
 * Bow down to bot
 * @param {Bot} botToBow the bot that is being bowed down to
 */
Bot.prototype.bow = function(botToBow) {
    if (botToBow instanceof Bot) {
        if(game.physics.arcade.distanceBetween(this.sprite, botToBow.sprite) < 15) {
            botToBow.gotBow(this);
        }
    }
};
/**
 * Override to react when bowed down to
 * 
 * @param {Bot} botWhoBowed bot who bowed down to me
 * 
 */
Bot.prototype.gotBow = function(botWhoBowed) {
    // console.log(botWhoBowed.name + "bowed down to " + this.name);
};


/**
 * Lick a specified bot
 *
 * @param {Bot} botToLick the bot to lick
 */
Bot.prototype.lick = function(botTolick) {
    if (botTolick instanceof Bot) {
        if (game.physics.arcade.distanceBetween(this.sprite, botTolick.sprite) < 100) {
            botTolick.gotLicked(this);
        }
    }
};


/**
 * Override to react when licked
 *
 * @param  {Bot} botWhoLickedToMe who licked me
 */
Bot.prototype.gotLicked = function(botWhoLickedMe) {
    // console.log(botWhoLickedMe.name + " licked " + this.name);
};


Bot.prototype.ignore = function (annoyingBot) {
    this.incrementAngle(180);
    this.body.speed = 250;
    annoyingBot.gotIgnored(this);
}

/**
 * Override to react when ignored
 *
 * @param  {Bot} botWhoIgnoredToMe who ignored me
 */
Bot.prototype.gotIgnored = function(botWhoIgnoredMe) {
    this.body.speed = 0;
    this.pursue(botWhoIgnoredMe, 350);
}

/**
 * Override to react when someone tries to eat you!
 */
Bot.prototype.eat = function() {
    console.log("Someone tried to eat " + this.name);
};
