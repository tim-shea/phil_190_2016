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
        let rnd = game.rnd.integerInRange(1, 11);
        switch (rnd) {
            case 1:
                addFoodItem("food_fruit_veggies", "fruits and veggies", 10);
                break;
            case 2:
                addFoodItem("cupCake", "cupCake", 130);
                break;
            case 3:
            	addFoodItem("diet_pepsi", "Diet Pepsi", 0);
            	break;
            case 4:
                addFoodItem("jerry_can", "Gasoline", 100);
                //31,500 cals in a gallon of gasoline, about 5 gallons in a j100 can  
                break;
            case 5:
                addFoodItem("Philoberry", "Organic Philosopher's Stone", 5); 
                break;
            case 7:
                addFoodItem("Cheri_berry", "Pokemon berry #01", 1);
                break;
            case 8:
                addFoodItem("Enigma_berry", "Pokemon berry #60", 1);
                break;
            case 9:
                addFoodItem("Hondew_berry", "Pokemon berry #24", 1);
                break;
            case 10:
                addFoodItem("Passo_berry", "Pokemon berry #37", 1);
                break;  
            case 11:
                addFoodItem("Devil_Fruit_rubber", "Its taste is worse than crap; eater becomes hammer for life", -10);
                break;
            case 12:
                addFoodItem("steak", "Fresh meat", 10);
                break;  
            case 13:
                addFoodItem("pink_candy", "Yummy candy", 5);
                break;
            default:
                break;
        }
    }
}

/**
 * Add one item of food
 *
 * @param {string} id id of the food asset
 * @param {string} description description of the food item
 * @param {string} calories how many calories it has
 */
function addFoodItem(image_id, description, calories) {
    if (image_id != "") {
        food = new Entity(Math.random() * worldSizeX, Math.random() * worldSizeY, image_id);
        food.description = description;
        food.calories = calories;
        food.isEdible = true;
        food.eat = function() {
            // console.log("Eating " + this.description + " with " + this.calories + " calories");
            let tempSprite = this.sprite;
            tempSprite.reset(-10,-10);
            tempSprite.visible = false;
            // Respawn food in 5 seconds.
            //  TODO: Note that sprite.kill(), .exists, and body.   all failed...
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

/**
 * A production which, if its conditions are met, fires some actions.
 *
 * @param  {string} name name of this production
 * @param  {Number} priority value from 1 (lowest) to 10 (highest) 
 *                           indicating how important this production is
 * @param  {function} condition if true, fire the production
 * @param  {function} actions function to call when firing this produciton
 */
function Production(name, priorityLevel, condition, action) {
    this.name = name;
    this.priorityLevel = priorityLevel;
    this.condition = condition;
    this.action = action;

};
Production.priority = {};
Production.priority.High = 10;
Production.priority.Medium = 5;
Production.priority.Low = 1;

/**
 * Find those productions in a list whose condition is met, sort by priority, and fire the
 * highest priority production in the resulting set (in the case of a tie the first
 * production in the list of ties is fired).
 *
 * @param  {Production[]} productions list of productions to check
 */
function fireProductions(productions) {
    activeProductions = productions.filter(function(production) {return production.condition();});
    activeProductions = activeProductions.sort(
        function(a,b) {return (a.priorityLevel < b.priorityLevel);});
    if(activeProductions.length > 0) {
        activeProductions[0].action();
    }
}