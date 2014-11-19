var PoesIsBlokje = function(x, y) {
	this.x = x;
	this.y = y;
	this.state = 0;
	
	game.addActor(this);
}
PoesIsBlokje.extend(Actor);
PoesIsBlokje.prototype = {
	act: function()
	{
		var pd = game.map[p(this.x, this.y)].player_distance;
		var deltas = ROT.DIRS[8];
		var new_x = this.x;
		var new_y = this.y;
		
		switch(this.state)
		{
		case 0:
			if (pd < 3)
			{
				if (ROT.RNG.getPercentage() < 50)
					game.message("Prrrr!");
				else
					game.message("Prrrr! Poesisblokje runs away!");
				this.state = 1;
			}else{
				for(var n=0; n<deltas.length; n++)
				{
					var x = this.x + deltas[n][0];
					var y = this.y + deltas[n][1];
					if (p(x, y) in game.map && game.map[p(x, y)].player_distance < pd && game.spaceIsFree(x, y))
					{
						new_x = x;
						new_y = y;
						pd = game.map[p(x, y)].player_distance;
					}
				}
			}
			break;
		case 1:
			if (pd > 10)
			{
				this.state = 0;
			}else{
				for(var n=0; n<deltas.length; n++)
				{
					var x = this.x + deltas[n][0];
					var y = this.y + deltas[n][1];
					if (p(x, y) in game.map && game.map[p(x, y)].player_distance > pd && game.spaceIsFree(x, y))
					{
						new_x = x;
						new_y = y;
						pd = game.map[p(x, y)].player_distance;
					}
				}
			}
			break;
		}
		if (new_x != this.x || new_y != this.y)
		{
			game.moveActor(this, new_x, new_y);
		}
		game.scheduler.setDuration(1);
	},
	getGlyph: function()
	{
		return "pFFF";
	},
	playerBump: function()
	{
		game.message("You gently petted the poesisblokje");
		return 1;
	},
}
