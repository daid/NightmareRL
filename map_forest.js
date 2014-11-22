var Spiderweb = function(x, y)
{
	StaticObject.call(this, x, y);
}
Spiderweb.extend(StaticObject);
Spiderweb.prototype.getGlyph = function() { return "#FFF"; }
Spiderweb.prototype.lightPasses = function() { return true; }
Spiderweb.prototype.playerBump = function(player)
{
	var pos = p(this.x,this.y);
	if (ROT.RNG.getPercentage() < 40)
	{
		game.message("You fail to remove the spiderweb");
		return 2.0;
	}
	game.map[pos].static_object = null;
	game.message("You tear away the spiderweb");
	return 2.0;
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
	
	for(var n=0; n<3; n++)
		addRandomItem(start_x + 2, 0, 30, 20);
	
	for(var n=0; n<10; n++)
	{
		var x = start_x + ROT.RNG.getUniformInt(2, 32);
		var y = ROT.RNG.getUniformInt(0, 19);
		for(var xx=-2; xx<3; xx++)
		{
			for(var yy=-2; yy<3; yy++)
			{
				if (ROT.RNG.getPercentage() < 70)
				{
					var pos = p(xx+x, yy+y);
					if (pos in game.map && game.map[pos].static_object == null && game.map[pos].items.length < 1)
						new Spiderweb(xx+x, yy+y);
				}
			}
		}
	}
}
