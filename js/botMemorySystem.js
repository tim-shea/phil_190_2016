/**
 * Initialize the memory network and associated options.
 *
 * Docs on dataset object: http://visjs.org/docs/data/dataset.html
 */
Bot.prototype.setNetwork = function() {
    if (!memoryOn) {
        return;
    }
    this.nodes = new vis.DataSet(); // Main memory store
    this.edges = new vis.DataSet();
    this.options = {
        // configurePhysics:true,  // Uncomment to fine-tune graph  
        nodes: {
            shape: 'dot',
            // smooth: false, // For better performance. Todo: does not seem to work...
            // scaling: {
            //     customScalingFunction: function(min, max, total, value) {
            //         return value / total;
            //     },
            //     min: 1,
            //     max: 5
            // }
        }
    };
};

/**
 * Add a memory to the network.  A memory is just  a string.
 * If the memory already exists increment its value by .1.
 *
 * @param {Node} id the string id for the memory (rename id?)
 */
Bot.prototype.addNode = function(id) {
    if (!memoryOn) {
        return;
    }
    node = this.nodes.get(id);
    // If the node is already in the network, change its color and increment
    if (node) {
        this.nodes.update({
            id: id,
            value: node.value + .1,
        });
        this.currentMemory = node;
    } else {
        // Otherwise, add a new node
        this.nodes.update({
            id: '' + id,
            label: '' + id,
            color: 'blue',
            value: 1 // Start at one
        });
    }
}

/**
 * Add a memory transition to the network.  This adds an edge just using the
 * last memory and the current one with a --> between. If it exists, increment it.
 *
 * @param {String} last last memory that happened
 * @param {String} current memory
 */
Bot.prototype.addEdge = function(last, current) {
    if (!memoryOn) {
        return;
    }
    id = last + "-->" + current;
    //No recurrent connections
    if (last === current) {
        return;
    }
    edge = this.edges.get(id);
    // Edge already exists.  Update that edge
    if (edge) {
        this.edges.update({
            id: id,
            value: edge.value + .1,
        });
        this.currentTransition = edge;
    } else {
        // Add new edge
        this.edges.update({
            id: '' + id,
            label: '',
            from: '' + last,
            to: '' + current,
            value: 1, // Start at one
            color: 'blue'
        });
    }
    // parse
}

/**
 * Update the memory network by decaying all node and edge activations
 */
Bot.prototype.updateNetwork = function() {
    if (!memoryOn) {
        return;
    }
    currentBot = this;
    // Decay nodes
    this.nodes.forEach(function(node) {
        // Decay node
        let tempval = round(Math.min(2, Math.max(1, node.value - .01)), 2);
        if (currentBot.showNodeActivations) {
            currentBot.nodes.update({ id: node.id, label: node.id + ':' + tempval, value: tempval });
        } else {
            currentBot.nodes.update({ id: node.id, value: tempval });
        }
        // Color non-current nodes blue
        if (currentBot.currentMemory) {
            if (node.id != currentBot.currentMemory.id) {
                currentBot.nodes.update({ id: node.id, color: 'blue' });
            } else {
                currentBot.nodes.update({ id: node.id, color: 'red' });
            }
        }
    });

    // Decay Edges
    this.edges.forEach(function(edge) {
        let tempval = round(Math.min(2, Math.max(1, edge.value - .01)), 2);
        // Decay edge
        if (currentBot.showEdgeActivations) {
            currentBot.edges.update({ id: edge.id, label: '' + tempval, value: tempval });
        } else {
            currentBot.edges.update({ id: edge.id, value: tempval });
        }
        // Color non-current edges blue
        if (currentBot.currentTransition) {
            // console.log(edge, currentTransition);
            if (edge.id != currentBot.currentTransition.id) {
                currentBot.edges.update({ id: edge.id, color: 'blue' });
            } else {
                // edges.update({ id: edge.id, color: 'red' });
            }
        }
    });

    // network.selectNodes([node.id]);
    // console.log(node);
}


/**
 * Add a new memory to the network
 *
 * @param {String} memory the new memory
 */
Bot.prototype.addMemory = function(memory) {
    if (!memoryOn) {
        return;
    }
    this.addNode(memory);
    if (this.lastMemory) {
        this.addEdge(this.lastMemory, memory)
    }
    if (this.lastMemory != memory) {
        this.lastMemory = memory;
    }
}

/**
 * Get a memory.  "Recall" it.  Returns null if there is no such memory.
 *
 * TODO: Get a memory based on a fragment of it? 
 *
 * @param  {String} memoryToGet what to look for
 * @return a reference to the vis.js node
 */
Bot.prototype.getMemory = function(memoryToGet) {
    if (!memoryOn) {
        return null;
    }
    return this.nodes.get(memoryToGet);
}

/**
 * Check if a specified memory is contained in the memory network.
 */
Bot.prototype.containsMemory = function(memoryToCheck) {
    return (this.getMemory(memoryToCheck) != null);
}

/**
 * Check if a memory has been recently added or activated, but seeing if it's
 * in the network,and if so, if it's activation value suggests it was recently 
 * added.  
 *
 * Values can range from 1-2.  Currently the threshold defaults to 1.01 (the lowest possible value) since 
 * the dynamics decay fairly quckly.
 * 
 * @param  {String} memoryToCheck string id of memory to check
 * @param  {Number} threshold if the value is above this, consider the memory "recent"
 * @return {Boolean} true if the memory exists and is recent.
 */
Bot.prototype.containsRecentMemory = function(memoryToCheck, threshold = 1.01) {
    var mem = this.getMemory(memoryToCheck)
    if (mem === null) {
        return false;
    } else if (mem.value > threshold) {
        return true;
    } else {
        return false;
    }
}


/**
 * Returns a list of all memories above a specified threshold
 * 
 * @param  {Number} threshold the threshold
 * @return {Memory[]} memories above the threshold
 */
Bot.prototype.getMemoriesAboveThreshold = function(threshold = 1.25) {
        var memories = this.nodes.get({
            filter: function(item) {
                return item.value > threshold;
            }
        });
        return memories;
    }
    /**
     * Returns a string representation of above-threshold memories.
     */
Bot.prototype.getActiveMemoryString = function(threshold = 1.5) {
    var retString = "Active memories:\n";
    var mems = this.getMemoriesAboveThreshold();
    if (Object.keys(mems).length === 0) {
        retString += "\tNo active memories.\n";
        return retString;
    }
    mems.sort(
        function(a, b) {
            return (a.value < b.value);
        });
    for (var i = 0; i < mems.length; i++) {
        retString += "\t" + mems[i].label + "\n";
    }
    return retString;
}

/**
 * Returns a string description of memories connected to the provided memory id.
 *
 * @param  {String} memory_name id of the memory to start with
 * @return {String} The formatted string
 */
Bot.prototype.getConnectedMemoryString = function(memory_name) {
    let retString = "";
    let thematicField = this.getConnectedMemories(memory_name);
    if(thematicField.length == 0) {
        return retString;
    }
    for (var j = 0; j < thematicField.length; j++) {
        retString += "\n\t" + thematicField[j];
    }
    return retString;
}

/**
 * Returns all memories connected to the given one.
 */
Bot.prototype.getConnectedMemories = function(memory_id) {
    return this.network.getConnectedNodes(memory_id);
}

/**
 * Remove the indicated memory
 *
 * @param {String} memory id of memory to remove
 */
Bot.prototype.forget = function(memory_id) {
    if (!memoryOn) {
        return;
    }
    this.nodes.remove(memory_id);
}