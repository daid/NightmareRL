var game = {
	display: null,
	map: null,
	the_shadow: null,
	player: null,
	view_offset_x: 0,
	debug: false,

	init: function()
	{
		ROT.Display.Rect.cache = true;
		
		this.display = new ROT.Display({spacing: 1.001, fontFamily: "Inconsolata, monospace", fontWeight: "bold"});
		this.display.setOptions({fontSize: this.display.computeFontSize(window.innerWidth, window.innerHeight)});
		document.getElementById("mainDiv").removeChild(document.getElementById("mainDiv").firstChild);
		document.getElementById("mainDiv").appendChild(this.display.getContainer());
		
		this.setupNewGame();
	},
	
	setupNewGame: function()
	{
		//ROT.RNG.setSeed(1);

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
		var light = new FlashLight(this.player.x, this.player.y);
		light.charge = 100;
		light.pickup(this.player);
		this.player.inventory.remove(light);
		this.player.equipment[EquipSlotHand] = light;

		this.engine.start();
		new MessageBox(this.player, StartText);
	},
	
	addActor: function(actor)
	{
		var pos = p(actor.x,actor.y);
		if (pos in this.map && this.map[pos].actor == null)
		{
			this.map[pos].actor = actor;
			this.scheduler.add(actor, true, 1);
		}
	},

	moveActor: function(actor, x, y)
	{
		var new_pos = p(x,y);
		if (!(new_pos in this.map) || this.map[new_pos].actor != null)
			return false;
		this.map[p(actor.x,actor.y)].actor = null;
		actor.x = x;
		actor.y = y;
		this.map[new_pos].actor = actor;
		return true;
	},
	removeActor: function(actor)
	{
		this.map[p(actor.x,actor.y)].actor = null;
		this.scheduler.remove(actor);
	},
	
	spaceIsFree: function(x, y)
	{
		var pos = p(x,y);
		if (!(pos in this.map))
			return false;
		if (this.map[pos].actor != null)
			return false;
		if (this.map[pos].static_object != null)
			return false;
		return true;
	},
	
	lightPassesCallback: function(x, y)
	{
		var pos = p(x,y);
		if (!(pos in this.map))
			return false;
		if (this.map[pos].static_object != null)
			return this.map[pos].static_object.lightPasses();
		return true;
	},
	setVisible: function(x, y, r, visibility)
	{
		var pos = p(x,y);
		if (!(pos in this.map))
			return;
		this.map[p(x,y)].visible = true;
	},
	setPlayerVisible: function(x, y, r, visibility)
	{
		var pos = p(x,y);
		if (!(pos in this.map))
			return;
		this.map[p(x,y)].player_visible = true;
	},
	
	updateGlobalPlayerData: function()
	{
		for(var key in this.map)
		{
			this.map[key].visible = false;
			this.map[key].player_visible = false;
			this.map[key].player_distance = 100;
		}
		var fov = new ROT.FOV.RecursiveShadowcasting(this.lightPassesCallback.bind(this));
		fov.compute(this.player.x, this.player.y, this.player.light_range, this.setVisible.bind(this));
		fov.compute(this.player.x, this.player.y, 80, this.setPlayerVisible.bind(this));
		recursivePlayerDistance(this.player.x, this.player.y, 0);
	},
	
	draw: function()
	{
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
						if (game.debug)
							var glyph = this.map[pos].getGlyph();
						this.display.draw(xx, y+2, glyph[0], "#" + glyph.slice(1, 4), "#222");
					}
				}else{
					this.display.draw(xx, y+2, " ", "#000", "#222");
				}
			}
		}
		for(var n=0; n<80;n++)
		{
			this.display.draw(n, 22, " ");
			this.display.draw(n, 23, " ");
			this.display.draw(n, 24, " ");
		}
		if (this.player.equipment[EquipSlotHand] != null)
			this.display.drawText(0, 22, "Hand: " + this.player.equipment[EquipSlotHand].getName());
		else
			this.display.drawText(0, 22, "Hand: -");
		if (this.player.equipment[EquipSlotBody] != null)
			this.display.drawText(0, 23, "Body: " + this.player.equipment[EquipSlotBody].getName());
		else
			this.display.drawText(0, 23, "Body: -");
		if (this.player.equipment[EquipSlotHead] != null)
			this.display.drawText(0, 24, "Head: " + this.player.equipment[EquipSlotHead].getName());
		else
			this.display.drawText(0, 24, "Head: -");
		this.display.drawText(40, 22, "Melee: " + this.player.melee_damage);
		if (this.player.hp <= this.player.maxhp / 10)
			this.display.drawText(40, 23, "HP: %c{red}" + this.player.hp + "/" + this.player.maxhp);
		else
			this.display.drawText(40, 23, "HP: " + this.player.hp + "/" + this.player.maxhp);
		/*
		for(var m=0; m<25;m++)
			for(var n=0; n<80;n++)
				this.display.draw(n, m, String.fromCharCode(n+80*m));
		*/
	},
	
	message: function(s)
	{
		for(var n=0; n<80;n++)
		{
			this.display.draw(n, 0, " ");
			this.display.draw(n, 1, " ");
		}
		if (this.messageLog.length > 0)
			this.display.drawText(0, 0, this.messageLog[this.messageLog.length-1]);
		this.messageLog.push(s);
		this.display.drawText(0, 1, this.messageLog[this.messageLog.length-1]);
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
					this.removeActor(this.map[pos].actor);
					
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
