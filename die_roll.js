function rollDie(s)
{
	function parseValue(tokens)
	{
		var n = tokens.shift();
		if (n == "-")
		{
			return -parseInt(tokens.shift());
		}
		if (n == "(")
		{
			var a = parseAddSub(tokens);
			var end = tokens.shift();
				return NaN;
			return a;
		}
		return parseInt(n);
	}

	function parseDie(tokens)
	{
		var a = parseValue(tokens);
		if (tokens[0] == "d")
		{
			tokens.shift();
			var b = parseValue(tokens);
			var ret = 0;
			for(var n=0; n<a; n++)
				ret += ROT.RNG.getUniformInt(1, b);
			return ret;
		}
		return a;
	}

	function parseMulDiv(tokens)
	{
		var a = parseDie(tokens);
		if (tokens[0] == "*")
		{
			tokens.shift();
			var b = parseMulDiv(tokens);
			return a * b;
		}
		if (tokens[0] == "/")
		{
			tokens.shift();
			var b = parseMulDiv(tokens);
			return Math.floor(a / b);
		}
		return a;
	}

	function parseAddSub(tokens)
	{
		var a = parseMulDiv(tokens);
		if (tokens[0] == "+")
		{
			tokens.shift();
			var b = parseAddSub(tokens);
			return a + b;
		}
		if (tokens[0] == "-")
		{
			tokens.shift();
			var b = parseAddSub(tokens);
			return a - b;
		}
		return a;
	}

	var tokens = [];
	var token = "";
	for(var n=0; n<s.length; n++)
	{
		switch(s[n])
		{
		case "d":
		case "+":
		case "-":
		case "*":
		case "/":
		case "(":
		case ")":
			if (token.length > 0)
				tokens.push(token);
			tokens.push(s[n]);
			token = "";
			break;
		default:
			token += s[n];
		}
	}
	if (token.length > 0)
		tokens.push(token);
	
	var ret = parseAddSub(tokens);
	if (tokens.length > 0 || isNaN(ret))
		console.log("Parse error: " + s);
	return ret;
}
