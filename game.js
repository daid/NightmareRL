var game = {
	display: null,
	map: null,
	the_shadow: null,
	player: null,
	view_offset_x: 0,

	init: function()
	{
		ROT.Display.Rect.cache = true;
		
		this.display = new ROT.Display();
        document.body.appendChild(this.display.getContainer());
		
		this.setupNewGame();
	},
	
	setupNewGame: function()
	{
		ROT.RNG.setSeed(1);

		this.scheduler = new ROT.Scheduler.Action();
		this.engine = new ROT.Engine(this.scheduler);

		this.map = {}
		this.the_shadow = new TheShadow();
		this.messageLog = [];
		this.view_offset_x = 0;
		
		for(var x=0; x<80; x++)
		{
			for(var y=0; y<20; y++)
			{
				var pos = p(x,y);
				if (!(pos in this.map))
					generateMapArea(x);
			}
		}
		
		this.player = new Player(9, 5);
		this.engine.start();
	},
	
	addActor: function(actor)
	{
		this.map[p(actor.x,actor.y)].actor = actor;
		this.scheduler.add(actor, true, 1);
	},

	moveActor: function(actor, x, y)
	{
		this.map[p(actor.x,actor.y)].actor = null;
		actor.x = x;
		actor.y = y;
		this.map[p(x,y)].actor = actor;
	},
	spaceIsFree: function(x, y)
	{
		var pos = p(x,y);
		if (!(pos in this.map))
			return false;
		if (this.map[pos].actor != null)
			return false;
		if (this.map[pos].fixture != null)
			return false;
		return true;
	},
	
	lightPassesCallback: function(x, y)
	{
		var pos = p(x,y);
		if (!(pos in this.map))
			return false;
		if (this.map[pos].fixture != null)
			return this.map[pos].fixture.lightPasses();
		return true;
	},
	setVisible: function(x, y, r, f)
	{
		var pos = p(x,y);
		if (!(pos in this.map))
			return;
		this.map[p(x,y)].visible = true;
	},
	
	draw: function()
	{
		for(var key in this.map)
		{
			this.map[key].visible = false;
			this.map[key].player_distance = 100;
		}
		var fov = new ROT.FOV.RecursiveShadowcasting(this.lightPassesCallback.bind(this));
		fov.compute(this.player.x, this.player.y, 8, this.setVisible.bind(this));
		recursivePlayerDistance(this.player.x, this.player.y, 0);
		
		for(var xx=0; xx<80; xx++)
		{
			var x = xx + this.view_offset_x;
			for(var y=0; y<20; y++)
			{
				var pos = p(x,y);
				if (pos in this.the_shadow._tiles)
					this.display.draw(xx, y+2, " ", "#000", "#000");
				else if (pos in this.map)
				{
					if (this.map[pos].visible)
					{
						var glyph = this.map[pos].getGlyph();
						this.display.draw(xx, y+2, glyph[0], "#" + glyph.slice(1, 4), "#000");
						
						fog_color = ROT.Color.interpolateHSL(ROT.Color.fromString(glyph.slice(1, 4)), [0x80,0x80,0x80]);
						this.map[pos].fog_of_war = glyph[0] + (fog_color[0] >> 4).toString(16) + (fog_color[1] >> 4).toString(16) + (fog_color[2] >> 4).toString(16);
					}else{
						var glyph = this.map[pos].fog_of_war;
						this.display.draw(xx, y+2, glyph[0], "#" + glyph.slice(1, 4), "#222");
					}
				}else{
					this.display.draw(xx, y+2, " ", "#000", "#222");
				}
			}
		}
		this.display.drawText(0, 22, "" + this.view_offset_x);
		/*
		for(var m=0; m<25;m++)
			for(var n=0; n<80;n++)
				this.display.draw(n, m, String.fromCharCode(n+80*m));
		*/
	},
	
	message: function(s)
	{
		if (this.messageLog.length > 0)
			this.display.drawText(0, 0, this.messageLog[this.messageLog.length-1].rpad(" ", 79) + "|");
		this.messageLog.push(s);
		this.display.drawText(0, 1, this.messageLog[this.messageLog.length-1].rpad(" ", 79) + "|");
	},
	
	advanceViewOffset: function()
	{
		for(var y=0; y<20; y++)
		{
			var pos = p(this.view_offset_x, y);
			if (pos in this.map)
			{
				if (this.map[pos].actor != null)
				{
					this.scheduler.remove(this.map[pos].actor);
					
					//When we remove the player from the game, lock the engine so we do not end up in an endless loop. TOFIX: End the game.
					if (this.map[pos].actor == this.player)
						this.engine.lock();
				}
				delete this.map[pos];
			}
		}
		
		this.view_offset_x ++;
		for(var y=0; y<20; y++)
		{
			var pos = p(this.view_offset_x + 79, y);
			if (!(pos in this.map))
				generateMapArea(this.view_offset_x + 79);
		}
	},
}
