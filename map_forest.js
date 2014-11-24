var Spiderweb = function(x, y)
{
	StaticObject.call(this, x, y);
}.extend(StaticObject, {
	getGlyph: function() { return "#FFF"; },
	lightPasses: function() { return true; },
	playerBump: function(player)
	{
		var pos = p(this.x,this.y);
		if (ROT.RNG.getPercentage() < 40)
		{
			game.message("You fail to remove the spiderweb");
			return 2.0;
		}
		game.map[pos].static_object = null;
		game.message("You tear away the spiderweb");
		if (ROT.RNG.getPercentage() < 5)
			new SpiderSilk(this.x, this.y);
		return 2.0;
	},
});

function generateForestArea(start_x, area_number)
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
	
	var monster_options = {
		GiantSpider: 20,
		Ghost: 1,
		Zombie: 1,
	};
	
	var x = start_x + 2;
	var y = 0;
	var w = 30;
	var h = 20;
	var monster_score = Math.floor(6 * Math.sqrt(area_number));
	while(monster_score > 0)
	{
		var monster_name = ROT.RNG.getWeightedValue(monster_options);
		var pos = randomEmptySpot(x, y, w, h);
		var monster = new window[monster_name](pos[0], pos[1]);
		if (monster_name == "Ghost")
			monster.move_area = [x+1, y+1, w-2, h-2];
		monster_score -= monster.spawn_score;
	}

	var item_count = 5 + Math.floor(area_number / 6)
	for(var n=0; n<2; n++)
		addRandomItem(x, y, w, h);
	
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
