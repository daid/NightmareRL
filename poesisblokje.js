var PoesIsBlokje = function(x, y) {
	MonsterBase.call(this, x, y);
	
	this.state = 0;
}.extend(MonsterBase, {
	act: function()
	{
		var pd = game.map[p(this.x, this.y)].player_distance;
			
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
				if (this.aiMoveToPlayer())
					return;
				if (this.aiRandomWalk())
					return;
			}
			break;
		case 1:
			if (pd > 10)
			{
				this.state = 0;
			}else{
				if (pd > 3 && ROT.RNG.getPercentage() < 50)
					if (this.aiRandomWalk())
						return;
				if (this.aiFleeFromPlayer())
					return;
			}
			break;
		}
		game.scheduler.setDuration(1);
	},
	getGlyph: function()
	{
		return "pFFF";
	},
	playerBump: function(player)
	{
		game.message("You gently petted the poesisblokje");
		return 1;
	},
});
