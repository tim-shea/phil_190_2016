/**
 * Prototype for simple bot neural network.  A work in progress.
 */
function NeuralNetwork() {
    this.inputs = [0, 0];
    this.outputs = [0, 0];
    this.weights = [
        [1.5, 1],
        [1, 1]
    ];
};

NeuralNetwork.prototype.update = function() {
	this.outputs = [0, 0];
    for (var i = 0; i < this.outputs.length; i++) {
        for (var j = 0; j < this.inputs.length; j++) {
            this.outputs[i] += this.inputs[j] * this.weights[i][j];
        }
    }
};