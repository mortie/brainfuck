(function()
{
	var inputElement = document.getElementById("inputElement");
	var outputElement = document.getElementById("outputElement");
	var stepButton = document.getElementById("stepButton");
	var runButton = document.getElementById("runButton");
	var inputChanged = false;
	var inputString = "";

	var bfInterpreter = new BFInterpreter(inputElement, outputElement);

	inputElement.addEventListener("input", function(e)
	{
		inputChanged = true;
		inputString = inputElement.innerHTML
		                          .replace(/\&gt;/g, ">")
		                          .replace(/\&lt;/g, "<");
		location.hash = inputString;
	});

	//remove pollution caused by the marker
	inputElement.addEventListener("click", function(e)
	{
		inputElement.innerHTML = inputString;
	});

	//reset interpreter
	function reset()
	{
		inputChanged = false;
		bfInterpreter.reset();
		bfInterpreter.inputString = inputString;
		outputElement.innerHTML = "";
	}

	//handle stepping
	stepButton.addEventListener("click", function(e)
	{
		//reset if user has input anything since last time
		if (inputChanged)
			reset();

		//do the actual stepping
		var res = bfInterpreter.step();
		console.log(bfInterpreter);

		//update output
		if (typeof res === "number")
			outputElement.innerHTML += res;

		//update input
		var i = bfInterpreter.index;
		var firstString = inputString.substring(0, i);
		var midString = inputString[i];
		var lastString = inputString.substring(i+1);

		inputElement.innerHTML = (firstString || "")+
		                         "<span class='indexMarker'>"+
		                         (midString || "")+
		                         "</span>"+
		                         (lastString || "");
	});

	//handle running
	runButton.addEventListener("click", function(e)
	{
		if (inputChanged)
			reset();

		while (true)
		{
			var res = bfInterpreter.step();

			if (res === false)
				break;

			if (typeof res === "number")
				outputElement.innerHTML += String.fromCharCode(res);
		}
	});

	//read hash if appliccable
	if (location.hash !== "#")
	{
		inputElement.innerHTML = location.hash.substring(1);
		inputString = location.hash.substring(1);
		inputChanged = true;
	}
})();
