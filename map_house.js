
function generateHouseArea(start_x)
{
	function placeRandomDoor(x, y, dir, size)
	{
		var deltaA = [1, 0];
		var deltaB = [0, 1];
		if (dir)
		{
			deltaA = [0, 1];
			deltaB = [1, 0];
		}
		var options = []
		for(var n=0; n<size; n++)
		{
			var pos = p(x - deltaA[0] + deltaB[0] * n, y - deltaA[1] + deltaB[1] * n);
			if (!(pos in game.map) || game.map[pos].static_object == null)
			{
				var pos = p(x + deltaA[0] + deltaB[0] * n, y + deltaA[1] + deltaB[1] * n);
				if (!(pos in game.map) || game.map[pos].static_object == null)
				{
					options.push(n);
				}
			}
		}
		var n = options.random();
		new Door(x + deltaB[0] * n, y + deltaB[1] * n);
	}
	
	function splitBox(x, y, w, h)
	{
		var n = ROT.RNG.getUniformInt(0, (w - 4) + (h - 4) - 1);
		if (w < 5 && h < 5)
			return;
		if (w + h < ROT.RNG.getUniformInt(10, 30))
			return;
		if (w < 5)
			n = w;
		if (h < 5)
			n = 0;
		if (n > (w - 4))
		{
			var split = ROT.RNG.getUniformInt(2, h - 3);
			generateWallBox(x, y + split, w, 1);
			splitBox(x, y, w, split);
			splitBox(x, y + split, w, h - split);

			placeRandomDoor(x, y + split, true, w);
		}else{
			var split = ROT.RNG.getUniformInt(2, w - 3);
			generateWallBox(x + split, y, 1, h);
			splitBox(x, y, split, h);
			splitBox(x + split, y, w - split, h);
			
			placeRandomDoor(x + split, y, false, h);
		}
	}

	generateFloorTiles(start_x, Dirt);
	
	var x = start_x + ROT.RNG.getUniformInt(5, 10);
	var y = ROT.RNG.getUniformInt(2, 4);
	var w = ROT.RNG.getUniformInt(20, 25);
	var h = 16;
	
	generateWallBox(x, y, w, h);
	setFloorBox(x, y, w, h, Stone);
	splitBox(x, y, w, h);
	placeRandomDoor(x, y, false, h);
	placeRandomDoor(x, y, false, h);
	placeRandomDoor(x+w-1, y, false, h);
	placeRandomDoor(x+w-1, y, false, h);
	
	for(var n=0; n<3; n++)
	{
		var g = new Ghost(x+ROT.RNG.getUniformInt(1, w-2), y+ROT.RNG.getUniformInt(1, h-2));
		g.move_area = [x+1, y+1, w-2, h-2];
	}
}
