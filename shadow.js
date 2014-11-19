var TheShadow = function() {
	this._tiles = {}
	this._advance_delay = 0;
	
	game.scheduler.add(this, true, 1);
}

TheShadow.prototype = {
	act: function()
	{
		do
		{
			var x = ROT.RNG.getUniformInt(0, 15);
			if (ROT.RNG.getPercentage() < 10)
				x = 0;
			else if (ROT.RNG.getPercentage() < 10)
				x = 1;
			
			var y = ROT.RNG.getUniformInt(0, 19);
			
			x += game.view_offset_x;
			if (p(x, y) in this._tiles)
				continue;
			
			if (x == 0)
				break;
			if (p(x-1, y) in this._tiles)
				break;
			if (p(x-1, y-1) in this._tiles)
				break;
			if (p(x-1, y+1) in this._tiles)
				break;
			if (p(x, y-1) in this._tiles)
				break;
			if (p(x, y+1) in this._tiles)
				break;
		}while(1);
		this._tiles[p(x, y)] = true;

		if (this._advance_delay > 0)
		{
			this._advance_delay --;
		}else{
			var line = true;
			for(y=0; y<20; y++)
			{
				if (!(p(game.view_offset_x, y) in this._tiles))
				{
					line = false;
					break;
				}
			}
			if (line)
			{
				game.advanceViewOffset();
			}
			this._advance_delay = 10;
		}
		
		var pos = p(game.player.x, game.player.y);
		if (pos in this._tiles)
			game.message("You feel the darkness ripping you apart!");
		
		game.scheduler.setDuration(0.3);
	}
}
