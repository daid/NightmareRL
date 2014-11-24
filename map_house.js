
function generateHouseArea(start_x, area_number)
{
	function placeRandomInWall(x, y, dir, size, type)
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
		new type(x + deltaB[0] * n, y + deltaB[1] * n);
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

			placeRandomInWall(x, y + split, true, w, Door);
		}else{
			var split = ROT.RNG.getUniformInt(2, w - 3);
			generateWallBox(x + split, y, 1, h);
			splitBox(x, y, split, h);
			splitBox(x + split, y, w - split, h);
			
			placeRandomInWall(x + split, y, false, h, Door);
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

	if (ROT.RNG.getPercentage() < 70)
	{
		var fence_x = x+ROT.RNG.getUniformInt(1, w-2);
		for(var n=0; n<y; n++)
			new FenceV(fence_x, n);
		for(var n=y+h; n<20; n++)
			new FenceV(fence_x, n);
	}

	for(var n=0; n<3;n++)
	{
		placeRandomInWall(x, y, false, h, Window);
		placeRandomInWall(x+w-1, y, false, h, Window);
	}
	for(var n=0; n<5; n++)
	{
		placeRandomInWall(x, y, true, w, Window);
		placeRandomInWall(x, y+h-1, true, w, Window);
	}

	placeRandomInWall(x, y, false, h, Door);
	placeRandomInWall(x, y, false, h, Door);
	placeRandomInWall(x+w-1, y, false, h, Door);
	placeRandomInWall(x+w-1, y, false, h, Door);
	placeRandomInWall(x, y, true, w, Door);
	placeRandomInWall(x, y+h-1, true, w, Door);
	
	var monster_options = {
		Zombie: 8,
		Ghost: 10,
	};
	
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
}
