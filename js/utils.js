/**
 * Implements a discrete time Markov process, or what is also known as a "Markov chain."" 
 *
 * http://setosa.io/blog/2014/07/26/markov-chains/
 * 
 * @param {String} initialStateName name of initial state
 */
function MarkovProcess(initialStateName) {
    // A collection of states, where each state has a name and a "fan-out array",
    // an array of target states and the probabilities of transitioning to them.
    // A state could be [["happy","sad"],[.4,.6]].
    this.states = {};
    this.current = initialStateName; // the current state name.  TODO: But that is more of a key.
};

/**
 * Add a state to the markov chain
 *
 * @param {String} stateName the name of the state being added 
 * @param {Object} theState  the fan-out array, e.g. [["happy","sad"],[.4,.6]].
 */
MarkovProcess.prototype.add = function(stateName, theState) {
    this.states[stateName] = theState;
};

/**
 * Change transition probabilities for the specified state.
 *
 * E.g. jeff.emotions.changeTransitions("Calm", [0,0,0,1]);
 *
 * @param {String} stateName the name of the state being edited 
 * @param {newTransitions} newTransitions the new transitions
 */
MarkovProcess.prototype.changeTransitions = function(stateName, newTransitions) {
    this.states[stateName][1] = newTransitions;
};

/**
 * Update the markov chain.  From the current state, choose a random
 * number between 0 and 1, and then set the new state based on that.
 */
MarkovProcess.prototype.update = function() {
    let rnd = Math.random(); // Roll a die
    let fanOut = this.states[this.current]; // Get the fan-out array
    let threshold = fanOut[1][0];
    for (let i = 0; i < fanOut[1].length; i++) {
        if (rnd < threshold) {
            this.current = fanOut[0][i];
            return;
        } else {
            threshold += fanOut[1][i + 1];
        }
    };
};

/**
 * A variable that can be incremented or decremented.
 *
 * TODO: Rename?  Decay should be more of a diffeq.  This is a clipped or rectified counter.
 * TODO: Add reset.
 *
 * @param {Number} initialVal initial value for variable
 * @param {Number} incrementAmount how much to increment or decrement
 * @param {Number} minVal the highest possible value
 * @param {Number} maxVal the highest possible value
 */
function DecayVariable(initialVal, incrementAmount, minVal, maxVal) {
    this.value = initialVal;
    this.incrementAmount = incrementAmount;
    this.minVal = minVal;
    this.maxVal = maxVal;
}
DecayVariable.prototype.decrement = function() {
    this.value = Math.max(this.minVal, this.value - this.incrementAmount);
}
DecayVariable.prototype.increment = function() {
    this.value = Math.min(this.maxVal, this.value + this.incrementAmount);
}
DecayVariable.prototype.add = function(amount) {
    this.value = Math.min(this.maxVal, this.value + amount);
}
DecayVariable.prototype.subtract = function(amount) {
    this.value = Math.max(this.minVal, this.value - amount);
}

/**
 * Adding a contains function to String
 */
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};


/**
 * Add a food item to the game
 */
function setUpFood() {

    // Add 20 pieces of food in various categories
    for (var i = 0; i < 20; i++) {
        let rnd = game.rnd.integerInRange(1, 1);
        switch (rnd) {
            case 1:
                addFoodItem("food_fruit_veggies", "fruits and veggies", 10);
                break;
            default:
                break;
        }
    }
}

/**
 * Add one item of food
 *
 * @param {String} imagePath path to the food asset
 * @param {String} description description of the food
 * @param {String} calories how many calories it has
 */
function addFoodItem(imagePath, description, calories) {
    if (imagePath != "") {
        food = new Entity(Math.random() * worldSizeX, Math.random() * worldSizeY, imagePath);
        food.description = description;
        food.calories = calories;
        food.isEdible = true;
        food.eat = function() {
            console.log("Eating " + this.description + " with " + this.calories + " calories");
            let tempSprite = this.sprite;
            tempSprite.reset(-10,-10);
            tempSprite.visible = false;
            // Respawn food in 5 seconds.
            //  TODO: Note that sprite.kill(), .exists, and body.enable all failed...
            //   So I place the sprite off screen then bring it back
            if (!tempSprite.visible) {
                game.time.events.add(Phaser.Timer.SECOND * 1, function() {
                    tempSprite.reset(Math.random() * worldSizeX, Math.random() * worldSizeY);
                    tempSprite.visible = true;
                });
            }
        }
        entities.push(food);
    }
}
