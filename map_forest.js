
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
