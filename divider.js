module.exports = function(RED) {
    "use strict";
    
    function DividerNode(config) {
	
        RED.nodes.createNode(this,config);
        var node = this;

	reset();
	
        this.on('input', function(msg) {
	    switch(msg.payload){
	    case "tick":
		var start = msg.start || [];
		if(start.indexOf(node.input)>=0){
		    node.inputCount++;
		    if(node.inputCount > node.ratio || node.outputCount === 0){
			node.inputCount = 1;
			node.outputCount ++;
			start.push(node.output);
		    }
		}

		msg.start = start;

		var counter = node.input + "_of_" + node.output;
		var beats_per_name = "beats_per_" + node.output;
		var beats_per_val;
		if(node.input == "beat"){
		    beats_per_val = node.ratio;
		}
		else{
		    beats_per_val = node.ratio * msg["beats_per_" + node.input];
		}
		msg[beats_per_name] = beats_per_val;
		
		msg[counter] = node.inputCount;

		msg[node.output] = node.outputCount;

		node.send(msg);

		break;

	    case "reset":
		reset();
		node.send(msg);
		break;
		
	    default:
		node.send(msg);
		break;
	    }
        });

	function reset(){
	    node.input = config.input || "beat";
	    node.output = config.output || "bar";
	    node.ratio = config.ratio || 4;
	    node.inputCount = 0;
	    node.outputCount = 0;
	    node.name = config.name;
	}

    }
    
    
    RED.nodes.registerType("divider",DividerNode);
}

