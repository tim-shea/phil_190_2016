/**
 * Implements a discrete time Markov process, or whatis also knowwn as a "Markov chain."" 
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
    this.current = initialStateName; // the current state name
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
            threshold += fanOut[1][i+1];
        }
    };
};

/**
 * A variable that can be incremented or decremented.
 *
 * TODO: Rename?  Decay should be more of a diffeq.  This is a clipped or rectified counter.
 *
 * @param {Number} initialVal initial value for variable
 * @param {Number} incrementAmount how much to increment or decrement
 * @param {Number} minVal the highest possible value
 * @param {Number} maxVal the highest possible value
 */
function DecayVariable(initialVal, incrementAmount, minVal, maxVal) {
    this.value = initialVal;
    this.incrementAmount = incrementAmount;
    this.minVal = maxVal;
    this.maxVal = maxVal;
}
DecayVariable.prototype.decrement = function() {
    this.value = Math.max(this.minVal,this.value - this.incrementAmount);
}
DecayVariable.prototype.increment = function() {
    this.value = Math.min(this.maxVal,this.value + this.incrementAmount);
}
DecayVariable.prototype.setValue = function(newVal) {
    this.value = newVal;
}

/**
 * Adding a contains function to String
 */
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
