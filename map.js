var Grass = 0;
var Dirt = 1;
var Stone = 2;

function p(x, y)
{
	//return x+","+y;
	return x*25 + y;
}

var MapTile = function(x, y) {
	this.floor = Grass;
	this.actor = null;
	this.fixture = null;
	this.visible = false;
	this.player_distance = 100;
	this.fog_of_war = " 888";
	
	game.map[p(x,y)] = this;
}
MapTile.prototype = {
	getGlyph: function()
	{
		if (this.actor != null)
			return this.actor.getGlyph();
		if (this.fixture != null)
			return this.fixture.getGlyph();
		switch(this.floor)
		{
		case Grass: return ".080";
		case Dirt: return ".852";
		case Stone: return ".333";
		}
		return "?888";
	}
};

function generateMapArea(start_x)
{
	var end_x = start_x + 30;
	var floor_type = ROT.RNG.getUniformInt(0, 2);
	for(var x=start_x; x<end_x; x++)
	{
		for(var y=0; y<20; y++)
		{
			if (!(p(x,y) in game.map))
			{
				var t = new MapTile(x, y);
				t.floor = floor_type;
			}
		}
	}
	for(var x=end_x; x<end_x+5; x++)
	{
		for(var y=0; y<20; y++)
		{
			if (ROT.RNG.getPercentage() < 80 - (x - end_x)*15)
			{
				var t = new MapTile(x, y);
				t.floor = floor_type;
			}
		}
	}
	
	if (start_x == 0)
	{
		generateStartArea(start_x);
	}else{
		for(var n=0; n<2; n++)
			new PoesIsBlokje(start_x + ROT.RNG.getUniformInt(0, 30), ROT.RNG.getUniformInt(0, 19));
	}
}

function _checkRecursivePlayerDistance(x, y, score)
{
	var pos = p(x,y);
	if (!(pos in game.map))
		return false;
	if (score > 20)
		return false;
	if (game.map[pos].fixture != null)
		return false;
	if (game.map[pos].player_distance <= score)
		return false;
	return true;
}

function recursivePlayerDistance(x, y, score)
{
	var todo_list = []
	todo_list.push(x);
	todo_list.push(y);
	todo_list.push(score);
	
	var _tmp = 0;
	while(todo_list.length > 0)
	{
		_tmp++;
		var x = todo_list.shift();
		var y = todo_list.shift();
		var s = todo_list.shift();
		if (!_checkRecursivePlayerDistance(x, y, s))
			continue;
		game.map[p(x,y)].player_distance = s;

		if (_checkRecursivePlayerDistance(x-1, y, s+1.0))
		{
			todo_list.push(x-1);
			todo_list.push(y);
			todo_list.push(s + 1.0);
		}
		if (_checkRecursivePlayerDistance(x+1, y, s+1.0))
		{
			todo_list.push(x+1);
			todo_list.push(y);
			todo_list.push(s + 1.0);
		}
		if (_checkRecursivePlayerDistance(x, y-1, s+1.0))
		{
			todo_list.push(x);
			todo_list.push(y-1);
			todo_list.push(s + 1.0);
		}
		if (_checkRecursivePlayerDistance(x, y+1, s+1.0))
		{
			todo_list.push(x);
			todo_list.push(y+1);
			todo_list.push(s + 1.0);
		}
		/*
		if (_checkRecursivePlayerDistance(x+1, y-1, s+1.2))
		{
			todo_list.push(x-1);
			todo_list.push(y-1);
			todo_list.push(s + 1.2);
		}
		todo_list.push(x+1);
		todo_list.push(y-1);
		todo_list.push(s + 1.2);
		todo_list.push(x-1);
		todo_list.push(y+1);
		todo_list.push(s + 1.2);
		todo_list.push(x+1);
		todo_list.push(y+1);
		todo_list.push(s + 1.2);
*/
		/*
		recursivePlayerDistance(x-1, y-1, score+1.2);
		recursivePlayerDistance(x+1, y-1, score+1.2);
		recursivePlayerDistance(x-1, y+1, score+1.2);
		recursivePlayerDistance(x+1, y+1, score+1.2);
		recursivePlayerDistance(x  , y-1, score+1.0);
		recursivePlayerDistance(x-1, y  , score+1.0);
		recursivePlayerDistance(x+1, y  , score+1.0);
		recursivePlayerDistance(x  , y+1, score+1.0);
		*/
	}
	console.log(_tmp);
}

var Fixture = function(x, y)
{
	this.x = x;
	this.y = y;
	var pos = p(x,y);
	if (pos in game.map)
		game.map[pos].fixture = this;
}
Fixture.prototype.getGlyph = function()
{
	return "?F00";
}
Fixture.prototype.lightPasses = function()
{
	return true;
}
Fixture.prototype.playerBump = function()
{
	return -1;
}

var Wall = function(x, y)
{
	Fixture.call(this, x, y);
}
Wall.extend(Fixture);
Wall.prototype.getGlyph = function() { return "#777"; }
Wall.prototype.lightPasses = function() { return false; }

var Window = function(x, y)
{
	Fixture.call(this, x, y);
}
Window.extend(Fixture);
Window.prototype.getGlyph = function()
{
	return "+777";
}

var Door = function(x, y)
{
	Fixture.call(this, x, y);
}
Door.extend(Fixture);
Door.prototype.getGlyph = function() { return "+A72"; }
Door.prototype.lightPasses = function() { return false; }
Door.prototype.playerBump = function()
{
	var pos = p(this.x,this.y);
	game.map[pos].fixture = null;
	game.message("You open the door");
	return 1.5;
}
