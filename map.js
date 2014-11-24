var Grass = 0;
var DarkGrass = 1;
var Dirt = 2;
var Stone = 3;
var Blood = 4;
var Corpse = 5;

function p(x, y)
{
	return x*25 + y;
}

var MapTile = function(x, y) {
	this.floor = Grass;
	this.actor = null;
	this.static_object = null;
	this.items = [];
	this.visible = false;
	this.player_visible = false;
	this.player_distance = 100;
	this.fog_of_war = " 888";
	
	game.map[p(x,y)] = this;
}
MapTile.prototype.getGlyph = function()
{
	if (this.actor != null)
		return this.actor.getGlyph();
	if (this.static_object != null)
		return this.static_object.getGlyph();
	if (this.items.length > 0)
		return this.items[this.items.length-1].getGlyph();
	switch(this.floor)
	{
	case Grass: return ".0A0";
	case DarkGrass: return ".060";
	case Dirt: return ".852";
	case Stone: return ".444";
	case Blood: return ".A00";
	case Corpse: return "%A00";
	}
	return "?888";
}

function generateMapArea(start_x, area_number)
{
	if (area_number == 0)
	{
		generateStartArea(start_x);
	}else{
		if ((area_number % 2) == 1)
			generateHouseArea(start_x, area_number);
		else
			generateForestArea(start_x, area_number);
		//for(var n=0; n<2; n++)
		//	new PoesIsBlokje(start_x + ROT.RNG.getUniformInt(0, 30), ROT.RNG.getUniformInt(0, 19));
	}
}

function _checkRecursivePlayerDistance(x, y, score)
{
	var pos = p(x,y);
	if (!(pos in game.map))
		return false;
	if (score > 20)
		return false;
	if (game.map[pos].static_object != null)
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
	
	while(todo_list.length > 0)
	{
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
		if (_checkRecursivePlayerDistance(x-1, y-1, s+1.2))
		{
			todo_list.push(x-1);
			todo_list.push(y-1);
			todo_list.push(s + 1.2);
		}
		if (_checkRecursivePlayerDistance(x+1, y-1, s+1.2))
		{
			todo_list.push(x+1);
			todo_list.push(y-1);
			todo_list.push(s + 1.2);
		}
		if (_checkRecursivePlayerDistance(x-1, y+1, s+1.2))
		{
			todo_list.push(x-1);
			todo_list.push(y+1);
			todo_list.push(s + 1.2);
		}
		if (_checkRecursivePlayerDistance(x+1, y+1, s+1.2))
		{
			todo_list.push(x+1);
			todo_list.push(y+1);
			todo_list.push(s + 1.2);
		}
	}
}

var StaticObject = function(x, y)
{
	this.x = x;
	this.y = y;
	var pos = p(x,y);
	if (pos in game.map)
		game.map[pos].static_object = this;
}
StaticObject.prototype.getGlyph = function()
{
	return "?F00";
}
StaticObject.prototype.getName = function()
{
	return "Unknown";
}
StaticObject.prototype.lightPasses = function()
{
	return true;
}
StaticObject.prototype.playerBump = function(player)
{
	return -1;
}
