var Player = function(x, y) {
	this.inventory = []
	this.max_inventory_size = 10;
	
	this.equip_hand = null;
	this.equip_body = null;
	this.equip_head = null;
	
	this.light_range = 1;
	
	Actor.call(this, x, y);
}
Player.extend(Actor);

Player.prototype.act = function()
{
	game.engine.lock();
	game.draw();
	window.addEventListener("keydown", this);
	window.addEventListener("keypress", this);
	
	this.updateStats();
}
Player.prototype.getGlyph = function()
{
	return "@FFF";
}
Player.prototype.executeAction = function(duration)
{
	t = Date.now();
	game.scheduler.setDuration(duration);
	window.removeEventListener("keydown", this);
	window.removeEventListener("keypress", this);
	game.engine.unlock();
	tick_time = (Date.now() - t);
	console.log("Tick time:" + tick_time + " (" + 1000/tick_time + ")");
}
Player.prototype.handleEvent = function(e) 
{
	switch(e.type)
	{
	case "keydown":
		switch(e.keyCode)
		{
		case ROT.VK_CLEAR: //When numlock is unlocked.
		case ROT.VK_NUMPAD5:
			//Wait action.
			this.executeAction(1);
			break;
		case ROT.VK_END:
		case ROT.VK_NUMPAD1:
			this.move(this.x - 1, this.y + 1);
			break;
		case ROT.VK_DOWN:
		case ROT.VK_NUMPAD2:
			this.move(this.x, this.y + 1);
			break;
		case ROT.VK_PAGE_DOWN:
		case ROT.VK_NUMPAD3:
			this.move(this.x + 1, this.y + 1);
			break;
		case ROT.VK_LEFT:
		case ROT.VK_NUMPAD4:
			this.move(this.x - 1, this.y);
			break;
		case ROT.VK_RIGHT:
		case ROT.VK_NUMPAD6:
			this.move(this.x + 1, this.y);
			break;
		case ROT.VK_HOME:
		case ROT.VK_NUMPAD7:
			this.move(this.x - 1, this.y - 1);
			break;
		case ROT.VK_UP:
		case ROT.VK_NUMPAD8:
			this.move(this.x, this.y - 1);
			break;
		case ROT.VK_PAGE_UP:
		case ROT.VK_NUMPAD9:
			this.move(this.x + 1, this.y - 1);
			break;
		default:
			for(var key in ROT)
				if (key.indexOf("VK_") == 0 && ROT[key] == e.keyCode)
					console.log("Unhandled key down: " + key);
			return;
		}
		break;
	case "keypress":
		switch(String.fromCharCode(e.charCode))
		{
		case ".":
			//Wait action.
			this.executeAction(1);
			break;
		case "p"://pickup
			if (game.map[p(this.x, this.y)].items.length < 1)
			{
				game.message("There is nothing here to pickup.");
			}else{
				var items = game.map[p(this.x, this.y)].items.slice(0);
				for(var n=0; n<items.length; n++)
				{
					var item = items[n];
					var cnt = item.pickup(this);
					if (cnt > 0)
					{
						game.message("Picked up " + cnt + "x " + item.getName());
					}else{
						game.message("You cannot carry anymore");
					}
				}
			}
			break;
		case "d"://Drop
			new ItemSelect(this, function(index) {
				this.inventory[index].drop(this);
				this.executeAction(1);
			}.bind(this));
			break;
		case "e"://Equip
			new ItemSelect(this, function(index) {
				var inv = this.inventory[index];
				switch(inv.type)
				{
				case EquipmentHandItem:
					game.message("You take the " + inv.getName() + " in your hand");
					this.inventory.remove(inv);
					if (this.equip_hand != null)
						this.inventory.push(this.equip_hand);
					this.equip_hand = inv;
					this.updateStats();
					this.executeAction(2.5);
					break;
				case EquipmentHeadItem:
					game.message("You put the " + inv.getName() + " on your head");
					this.inventory.remove(inv);
					if (this.equip_head != null)
						this.inventory.push(this.equip_head);
					this.equip_head = inv;
					this.updateStats();
					this.executeAction(2.5);
					break;
				default:
					game.draw();
					game.message("You cannot equip a " + inv.getName());
				}
			}.bind(this));
			break;
		default:
			console.log("Unhandled key pressed: " + String.fromCharCode(e.charCode));
			return;
		}
		break;
	}
	e.preventDefault();
},
Player.prototype.move = function(x, y)
{
	if (x > game.view_offset_x + 79)
		return;
	if (game.spaceIsFree(x, y))
	{
		game.moveActor(this, x, y);
		this.executeAction(1);
	}else{
		var pos = p(x, y);
		if (pos in game.map && game.map[pos].actor != null)
		{
			var bump_result = game.map[pos].actor.playerBump();
			if (bump_result > 0)
			{
				this.executeAction(bump_result);
				return;
			}
		}
		if (pos in game.map && game.map[pos].static_object != null)
		{
			var bump_result = game.map[pos].static_object.playerBump();
			if (bump_result > 0)
			{
				this.executeAction(bump_result);
				return;
			}
		}
		game.message("Your way is blocked");
	}
}
Player.prototype.getLightDistance = function()
{
	return this.light_range;
}
Player.prototype.updateStats = function()
{
	this.light_range = 1;
	if (this.equip_hand != null)
		this.equip_hand.updatePlayerWhenEquiped(this);
	if (this.equip_body != null)
		this.equip_body.updatePlayerWhenEquiped(this);
	if (this.equip_head != null)
		this.equip_head.updatePlayerWhenEquiped(this);
}

function ItemSelect(player, callback)
{
	this._player = player;
	this._callback = callback;

	var cnt = this._player.inventory.length;
	if (cnt < 1)
		return;
	
	for(var n=0;n<cnt+2;n++)
	{
		for(var m=0;m<40;m++)
			game.display.draw(3+m, 4+n, " ");
		game.display.draw(3, 4+n, "|");
		game.display.draw(42, 4+n, "|");
	}
	for(var n=0;n<40;n++)
	{
		game.display.draw(3+n, 3, "-");
		game.display.draw(3+n, 6+cnt, "-");
	}
	for(var n=0; n<cnt; n++)
	{
		var inv = this._player.inventory[n];
		game.display.drawText(5, 5+n, (n+1) + ") " + inv.amount + "x " + inv.getName());
	}

	window.removeEventListener("keydown", this._player);
	window.removeEventListener("keypress", this._player);
	window.addEventListener("keydown", this);
	window.addEventListener("keypress", this);
}
ItemSelect.prototype.handleEvent = function(e) 
{
	switch(e.type)
	{
	case "keydown":
		switch(e.keyCode)
		{
		case ROT.VK_ESCAPE:
			window.addEventListener("keydown", this._player);
			window.addEventListener("keypress", this._player);
			window.removeEventListener("keydown", this);
			window.removeEventListener("keypress", this);
			game.draw();
			break;
		}
		break;
	case "keypress":
		var index = parseInt(String.fromCharCode(e.charCode));
		if (!isNaN(index))
		{
			if (index == 0)
				index = 10;
			index--;

			window.addEventListener("keydown", this._player);
			window.addEventListener("keypress", this._player);
			window.removeEventListener("keydown", this);
			window.removeEventListener("keypress", this);
			this._callback(index);
		}
		break;
	}
}
