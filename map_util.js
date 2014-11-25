var Wall = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "#777"; },
	getName: function() { return "wall"; },
	lightPasses: function() { return false; },
});

var Window = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "+777"; },
	getName: function() { return "window"; },
});

var Door = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "+A72"; },
	getName: function() { return "door"; },
	lightPasses: function() { return false; },
	playerBump: function(player)
	{
		var pos = p(this.x,this.y);
		game.map[pos].static_object = null;
		game.message("You open the door");
		return 1.5;
	},
});

var Tree = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "|964"; },
	getName: function() { return "tree"; },
	lightPasses: function() { return false; },
});

var BigTreeL = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "[964"; },
	getName: function() { return "tree"; },
	lightPasses: function() { return false; },
});
var BigTreeR = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "]964"; },
	getName: function() { return "tree"; },
	lightPasses: function() { return false; },
});

var Bush = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "%4B4"; },
	getName: function() { return "bush"; },
});

var FenceH = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "-842"; },
	getName: function() { return "fence"; },
	lightPasses: function() { return false; },
});
var FenceV = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "|842"; },
	getName: function() { return "fence"; },
	lightPasses: function() { return false; },
});

var Altar = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "=F46"; },
	getName: function() { return "altar"; },
	lightPasses: function() { return true; },
});

var Workbench = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "=D84"; },
	getName: function() { return "workbench"; },
	lightPasses: function() { return true; },
});

function generateFloorTiles(start_x, floor_type)
{
	var end_x = start_x + 30;
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
}

function generateWallBox(x, y, w, h)
{
	for(var n=0;n<w;n++)
	{
		new Wall(x+n, y);
		new Wall(x+n, y+h-1);
	}
	for(var n=1;n<h-1;n++)
	{
		new Wall(x, y+n);
		new Wall(x+w-1, y+n);
	}
}

function setFloorBox(x, y, w, h, floor_type)
{
	for(var n=0;n<w;n++)
	{
		for(var m=0;m<h;m++)
		{
			var pos = p(x+n, y+m);
			if (pos in game.map)
				game.map[pos].floor = floor_type;
		}
	}
}

function addRandomItem(x, y, w, h)
{
	do
	{
		var xx = ROT.RNG.getUniformInt(x, x+w-1);
		var yy = ROT.RNG.getUniformInt(y, y+h-1);
		var pos = p(xx, yy);
	}while(pos in game.map && game.map[pos].static_object != null);
	
	var options = {
		Medkit: 70,
		Batteries: 20,
		HeadLight: 10,
		FlashLight: 50,
		Knife: 50,
		Sword: 20,
		BodyArmor: 30,
		Helmet: 20,
		GlowingDagger: 1,
		
		//Not really items, but static objects.
		Altar: 30,
		Workbench: 50,
	};
	var itemName = ROT.RNG.getWeightedValue(options);
	new window[itemName](xx, yy);
}

function randomEmptySpot(x, y, w, h)
{
	do
	{
		var xx = ROT.RNG.getUniformInt(x, x+w-1);
		var yy = ROT.RNG.getUniformInt(y, y+h-1);
		var pos = p(xx, yy);
	}while(pos in game.map && game.map[pos].static_object != null && game.map[pos].actor != null);
	
	return [xx, yy];
}
