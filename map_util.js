var Wall = function(x, y)
{
	StaticObject.call(this, x, y);
}
Wall.extend(StaticObject);
Wall.prototype.getGlyph = function() { return "#777"; }
Wall.prototype.getName = function() { return "wall"; }
Wall.prototype.lightPasses = function() { return false; }

var Window = function(x, y)
{
	StaticObject.call(this, x, y);
}
Window.extend(StaticObject);
Window.prototype.getGlyph = function() { return "+777"; }
Window.prototype.getName = function() { return "window"; }

var Door = function(x, y)
{
	StaticObject.call(this, x, y);
}
Door.extend(StaticObject);
Door.prototype.getGlyph = function() { return "+A72"; }
Door.prototype.getName = function() { return "door"; }
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
Tree.prototype.getName = function() { return "tree"; }
Tree.prototype.lightPasses = function() { return false; }
var BigTreeL = function(x, y)
{
	StaticObject.call(this, x, y);
}
BigTreeL.extend(StaticObject);
BigTreeL.prototype.getGlyph = function() { return "[964"; }
BigTreeL.prototype.getName = function() { return "tree"; }
BigTreeL.prototype.lightPasses = function() { return false; }
var BigTreeR = function(x, y)
{
	StaticObject.call(this, x, y);
}
BigTreeR.extend(StaticObject);
BigTreeR.prototype.getGlyph = function() { return "]964"; }
BigTreeR.prototype.getName = function() { return "tree"; }
BigTreeR.prototype.lightPasses = function() { return false; }

var Bush = function(x, y)
{
	StaticObject.call(this, x, y);
}
Bush.extend(StaticObject);
Bush.prototype.getGlyph = function() { return "%4B4"; }
Bush.prototype.getName = function() { return "bush"; }

var FenceH = function(x, y)
{
	StaticObject.call(this, x, y);
}
FenceH.extend(StaticObject);
FenceH.prototype.getGlyph = function() { return "-842"; }
FenceH.prototype.getName = function() { return "fence"; }
FenceH.prototype.lightPasses = function() { return false; }
var FenceV = function(x, y)
{
	StaticObject.call(this, x, y);
}
FenceV.extend(StaticObject);
FenceV.prototype.getGlyph = function() { return "|842"; }
FenceV.prototype.getName = function() { return "fence"; }
FenceV.prototype.lightPasses = function() { return false; }

var Altar = function(x, y)
{
	StaticObject.call(this, x, y);
}
Altar.extend(StaticObject);
Altar.prototype.getGlyph = function() { return "=F46"; }
Altar.prototype.getName = function() { return "altar"; }
Altar.prototype.lightPasses = function() { return true; }

var Workbench = function(x, y)
{
	StaticObject.call(this, x, y);
}
Workbench.extend(StaticObject);
Workbench.prototype.getGlyph = function() { return "=D84"; }
Workbench.prototype.getName = function() { return "workbench"; }
Workbench.prototype.lightPasses = function() { return true; }

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
		Medkit: 7,
		Batteries: 2,
		HeadLight: 1,
		FlashLight: 5,
		Knife: 5,
		Sword: 2,
		BodyArmor: 2,
		Helmet: 2,
		
		//Not really items, but static objects.
		Altar: 3,
		Workbench: 5,
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
