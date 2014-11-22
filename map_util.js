
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
		Medkit: 10,
		Batteries: 2,
		Knife: 5,
		Sword: 5,
		HeadLight: 1,
		FlashLight: 5,
	};
	var itemName = ROT.RNG.getWeightedValue(options);
	new window[itemName](xx, yy);
}
