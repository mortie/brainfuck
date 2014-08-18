(function()
{
	window.BFInterpreter = function()
	{
		this._inputString;
		this._index = 0;
		this._memory = [];
		this._memoryPtr = 0;
	}

	window.BFInterpreter.prototype =
	{
		get inputString()
		{
			return this._inputString;
		},

		set inputString(val)
		{
			this._inputString = val;
		},

		get index()
		{
			return this._index;
		},

		"step": function()
		{
			var c = this._inputString[this._index];
			if (c === undefined)
				return false;

			++this._index;

			console.log(c);

			switch (c)
			{
			case "<":
				--this._memoryPtr;
				break;
			case ">":
				++this._memoryPtr;
				break;
			case "+":
				this._memory[this._memoryPtr] = (this._memory[this._memoryPtr] || 0) + 1;
				break;
			case "-":
				this._memory[this._memoryPtr] = (this._memory[this._memoryPtr] || 0) - 1;
				break;
			case "[":
				if (this._memory[this._memoryPtr] === 0)
					this._index = this._search("[", "]", 1)
				break;
			case "]":
				if (this._memory[this._memoryPtr] !== 0)
					this._index = this._search("]", "[", -1);
				break;
			case ".":
				return this._memory[this._memoryPtr];
			case ",":
				break;
			}
		},

		"reset": function()
		{
			this._index = 0;
			this._memory = [];
			this._memoryPtr = 0;
			this._inputString = "";
		},

		"_search": function(inc, dec, jmp)
		{
			var i = this._index+jmp;
			var depth = 1;

			while (depth > 0)
			{
				i += jmp;
				switch (this._inputString[i])
				{
				case inc:
					++depth;
					break;
				case dec:
					--depth;
					break;
				}
			};

			return i;
		}
	}
})();
