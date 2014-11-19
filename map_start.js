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

function generateStartArea(start_x)
{
	var w = 25;
	var h = 14;
	var x = start_x + 7;
	var y = 3;
	generateWallBox(x, y, w, h);
	setFloorBox(x, y, w, h, Stone);
	generateWallBox(x + 8, y, 1, h);
	generateWallBox(x + 8, y + 4, w-8, 6);
	generateWallBox(x + 14, y, 6, 5);
	generateWallBox(x + 13, y + 9, 6, 5);
	
	new Door(x + 8, y+7);
	new Door(x + w-1, y+6);
	new Window(x + 4, y);
	new Window(x + 5, y);

	new Window(x, y + 3);
	new Window(x, y + 4);
	
	new Window(x, y + h - 4);
	new Window(x, y + h - 5);

	new Door(x + 11, y+4);
	new Door(x + 10, y+9);

	new Door(x + 15, y+4);
	new Door(x + 16, y+9);

	new Door(x + 22, y+4);
	new Door(x + 21, y+9);

	new Window(x + 11, y);
	new Window(x + 11, y + h - 1);
	
	new Window(x + 16, y);
	new Window(x + 16, y + h - 1);

	new Window(x + 21, y);
	new Window(x + 21, y + h - 1);
	
	new PoesIsBlokje(x + 11, y + 2);
}
