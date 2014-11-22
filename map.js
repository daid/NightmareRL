var Grass = 0;
var DarkGrass = 1;
var Dirt = 2;
var Stone = 3;

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
	}
	return "?888";
}

function generateForestArea(start_x)
{
	generateFloorTiles(start_x, Grass);
	
	for(var n=0; n<20; n++)
	{
		var x = start_x + ROT.RNG.getUniformInt(2, 32);
		var y = ROT.RNG.getUniformInt(0, 19);
		var pos = p(x, y);
		if (pos in game.map && game.map[pos].static_object == null)
		{
			setFloorBox(x - 1, y, 3, 1, DarkGrass);
			setFloorBox(x, y - 1, 1, 3, DarkGrass);
			new Tree(x, y);
		}
	}

	for(var n=0; n<30; n++)
	{
		var x = start_x + ROT.RNG.getUniformInt(2, 32);
		var y = ROT.RNG.getUniformInt(0, 19);
		var pos = p(x, y);
		if (pos in game.map && game.map[pos].static_object == null)
		{
			new Bush(x, y);
		}
	}

	for(var n=0; n<10; n++)
	{
		do
		{
			var x = start_x + ROT.RNG.getUniformInt(2, 32);
			var y = ROT.RNG.getUniformInt(0, 18);
		}
		while(!game.spaceIsFree(x, y) || !game.spaceIsFree(x + 1, y) || !game.spaceIsFree(x, y + 1) || !game.spaceIsFree(x + 1, y + 1))
		
		setFloorBox(x - 2, y - 1, 6, 4, DarkGrass);
		setFloorBox(x - 1, y - 2, 4, 6, DarkGrass);
		new BigTreeL(x, y);
		new BigTreeR(x+1, y);
		new BigTreeL(x, y+1);
		new BigTreeR(x+1, y+1);
	}
	for(var n=0; n<6; n++)
	{
		do
		{
			var x = start_x + ROT.RNG.getUniformInt(2, 32);
			var y = ROT.RNG.getUniformInt(0, 19);
			
			var pos = p(x, y);
		}while(!(pos in game.map) || game.map[pos].static_object != null || game.map[pos].actor != null)

		new GiantSpider(x, y);
	}
}

function generateMapArea(start_x)
{
	if (start_x == 0)
	{
		generateStartArea(start_x);
	}else{
		if ((start_x / 30 % 2))
			generateForestArea(start_x);
		else
			generateFloorTiles(start_x, Stone);
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
StaticObject.prototype.lightPasses = function()
{
	return true;
}
StaticObject.prototype.playerBump = function(player)
{
	return -1;
}

var Wall = function(x, y)
{
	StaticObject.call(this, x, y);
}
Wall.extend(StaticObject);
Wall.prototype.getGlyph = function() { return "#777"; }
Wall.prototype.lightPasses = function() { return false; }

var Window = function(x, y)
{
	StaticObject.call(this, x, y);
}
Window.extend(StaticObject);
Window.prototype.getGlyph = function()
{
	return "+777";
}

var Door = function(x, y)
{
	StaticObject.call(this, x, y);
}
Door.extend(StaticObject);
Door.prototype.getGlyph = function() { return "+A72"; }
Door.prototype.lightPasses = function() { return false; }
Door.prototype.playerBump = function(player)
{
	var pos = p(this.x,this.y);
	game.map[pos].static_object = null;
	game.message("You open the door");
	return 1.5;
}

var Tree = function(x, y)
{
	StaticObject.call(this, x, y);
}
Tree.extend(StaticObject);
Tree.prototype.getGlyph = function() { return "|964"; }
Tree.prototype.lightPasses = function() { return false; }
var BigTreeL = function(x, y)
{
	StaticObject.call(this, x, y);
}
BigTreeL.extend(StaticObject);
BigTreeL.prototype.getGlyph = function() { return "[964"; }
BigTreeL.prototype.lightPasses = function() { return false; }
var BigTreeR = function(x, y)
{
	StaticObject.call(this, x, y);
}
BigTreeR.extend(StaticObject);
BigTreeR.prototype.getGlyph = function() { return "]964"; }
BigTreeR.prototype.lightPasses = function() { return false; }

var Bush = function(x, y)
{
	StaticObject.call(this, x, y);
}
Bush.extend(StaticObject);
Bush.prototype.getGlyph = function() { return "%4B4"; }
