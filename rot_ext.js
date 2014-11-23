Array.prototype.remove = function(item)
{
	this.splice(this.indexOf(item), 1);
}

Function.prototype.extend = function(parent, data)
{
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	if (data != undefined)
	{
		for(var k in data)
		{
			this.prototype[k] = data[k];
		}
	}
	return this;
}
