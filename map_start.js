function generateStartArea(start_x)
{
	generateFloorTiles(start_x, Grass);
	
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
	new Window(x + 4, y+h-1);
	new Window(x + 5, y+h-1);

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
	
	new Batteries(x + 11, y + 2);
	new Knife(x + 16, y + 2);
	new Batteries(x + 21, y + 2);

	new Medkit(x + 11, y + 11);
	new Medkit(x + 16, y + 11);
	new Medkit(x + 21, y + 11);
}
