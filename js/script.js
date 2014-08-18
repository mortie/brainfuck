(function()
{
	var inputElement = document.getElementById("inputElement");
	var outputElement = document.getElementById("outputElement");
	var memMapElement = document.getElementById("memMapElement");
	var examplesSelect = document.getElementById("examplesSelect");
	var descriptionElement = document.getElementById("descriptionElement");
	var stepButton = document.getElementById("stepButton");
	var runButton = document.getElementById("runButton");
	var showNumbersCheckbox = document.getElementById("showNumbersCheckbox");
	var inputChanged = false;
	var inputString = "";

	var bfInterpreter = new BFInterpreter(inputElement, outputElement);

	//do things when someone input anyhting
	inputElement.addEventListener("input", function(e)
	{
		inputChanged = true;
		inputString = inputElement.innerHTML
		                          .replace(/\&gt;/g, ">")
		                          .replace(/\&lt;/g, "<")
		                          .replace(/\<\/*div\>/g, "\n");
		location.hash = inputString;
	});

	//remove pollution caused by the marker
	inputElement.addEventListener("click", function(e)
	{
		inputElement.innerHTML = inputString;
	});

	//reset interpreter
	function reset(clearOutput)
	{
		inputChanged = false;
		bfInterpreter.reset();
		bfInterpreter.inputString = inputString;
		if (clearOutput === true)
			outputElement.innerHTML = "";
	}

	//draw a map of interpreter's memory
	function drawMemMap()
	{
		memMapElement.innerHTML = "";
		bfInterpreter.memory.forEach(function(mem, i)
		{
			memMapElement.innerHTML += "<div class='key'>"+
			                           i+":"+
			                           "</div><div class='val'>"+
			                           mem+
			                           "</div>";
		});
	}

	//handle stepping
	stepButton.addEventListener("click", function(e)
	{
		//reset if user has input anything since last time
		if (inputChanged)
			reset(true);

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

		//do the actual stepping
		var res = bfInterpreter.step();

		drawMemMap();

		//update output
		if (typeof res === "number")
		{
			if (showNumbersCheckbox.checked)
				outputElement.innerHTML += res+" ";
			else
				outputElement.innerHTML += String.fromCharCode(res);
		}
		else if (res === false)
		{
			reset();
		}
	});

	//handle running
	runButton.addEventListener("click", function(e)
	{
		reset(true);

		var str = "";
		var showNumbers = showNumbersCheckbox.checked;

		while (true)
		{
			var res = bfInterpreter.step();

			if (res === false)
				break;

			if (typeof res === "number")
			{
				if (showNumbers)
					str += res+" ";
				else
					str += String.fromCharCode(res);
			}

			if (bfInterpreter.currentChar == ",")
				outputElement.innerHTML = str;
		}

		outputElement.innerHTML = str;

		drawMemMap();

		reset();
	});

	examplesSelect.addEventListener("change", function(e)
	{
		var example = e.srcElement.value;
		if (example === "")
		{
			descriptionElement.innerHTML = "";
		}
		else
		{
			var bfRequest = new XMLHttpRequest();
			bfRequest.open("get", "examples/"+example+".bf", true)
			bfRequest.send();
			bfRequest.onload = function(e)
			{
				inputString = e.srcElement.responseText;
				inputElement.innerHTML = e.srcElement.responseText;
				location.hash = e.srcElement.responseText;
				reset();
			}

			var descRequest = new XMLHttpRequest();
			descRequest.open("get", "examples/"+example+".desc", true)
			descRequest.send();
			descRequest.onload = function(e)
			{
				descriptionElement.innerHTML = e.srcElement.responseText;
			}
		}
	});

	//read hash if appliccable
	if (location.hash !== "#")
	{
		var str = decodeURIComponent(location.hash.substring(1));
		inputElement.innerHTML = str;
		inputString = str;
		inputChanged = true;
	}
})();
