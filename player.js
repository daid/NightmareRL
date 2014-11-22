var StartText = "It is this dream again. This nightmare. "+
	"You have it every night.\n"+
	"Will you manage to escape the darkness this time? "+
	"Or will you once again fall victim to the horrors that haunt you.\n"+
	"\n"+
	"(Tip: Press '?' for help)";
var HelpText = "Arrow keys: Move\n" +
	".: Wait\n"+
	"g: Pickup (get) item from floor\n"+
	"u: Use item.\n"+
	"e: Equip item\nd: Drop item";

var EquipSlotHand = 0;
var EquipSlotBody = 1;
var EquipSlotHead = 2;

var Player = function(x, y) {
	this.inventory = []
	this.max_inventory_size = 10;
	
	this.equipment = [null, null, null];
	
	this.base_maxhp = 50;
	this.hp = this.base_maxhp;
	
	this.updateStats();
	
	Actor.call(this, x, y);
}
Player.extend(Actor);

Player.prototype.act = function()
{
	game.engine.lock();
	game.draw();
	window.addEventListener("keydown", this);
	window.addEventListener("keypress", this);
	
	var pos = p(this.x, this.y);
	var item_list = "";
	for(var n=0; n<game.map[pos].items.length; n++)
	{
		var item = game.map[pos].items[n];
		item_list += " " + item.amount + "x " + item.getName();
	}
	if (item_list.length > 0)
	{
		item_list = "On the floor:" + item_list;
		if (item_list.length > 80)
			item_list = item_list.slice(0, 77) + "...";
		game.message(item_list);
	}
	this.updateStats();
}
Player.prototype.getGlyph = function()
{
	return "@FFF";
}
Player.prototype.executeAction = function(duration)
{
	t = Date.now();
	for(var n=0; n<this.equipment.length; n++)
		if (this.equipment[n] != null)
			this.equipment[n].tickWhenEquiped(this, duration);
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
		case "g"://get/pickup
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
				case EquipmentBodyItem:
				case EquipmentHeadItem:
					var slot;
					switch(inv.type)
					{
					case EquipmentHandItem:
						game.message("You take the " + inv.getName() + " in your hand");
						slot = EquipSlotHand;
						break;
					case EquipmentBodyItem:
						game.message("You wear the " + inv.getName());
						slot = EquipSlotBody;
						break;
					case EquipmentHeadItem:
						game.message("You put the " + inv.getName() + " on your head");
						slot = EquipSlotHead;
						break;
					}
					this.inventory.remove(inv);
					if (this.equipment[slot] != null)
						this.inventory.push(this.equipment[slot]);
					this.equipment[slot] = inv;
					this.updateStats();
					this.executeAction(2.5);
					break;
				default:
					game.draw();
					game.message("You cannot equip a " + inv.getName());
				}
			}.bind(this));
			break;
		case "u"://Use
			new ItemSelect(this, function(index) {
				var inv = this.inventory[index];
				var duration = inv.useItem(this);
				if (inv.amount < 1)
					this.inventory.remove(inv);
				if (duration > 0)
				{
					this.executeAction(duration);
				}else{
					if (duration < 0)
						game.message("Cannot use a " + inv.getName() + " like this");
					game.draw();
				}
			}.bind(this));
			break;
		case "?"://Help
			new MessageBox(this, HelpText);
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
			var bump_result = game.map[pos].actor.playerBump(this);
			if (bump_result > 0)
			{
				this.executeAction(bump_result);
				return;
			}
		}
		if (pos in game.map && game.map[pos].static_object != null)
		{
			var bump_result = game.map[pos].static_object.playerBump(this);
			if (bump_result > 0)
			{
				this.executeAction(bump_result);
				return;
			}
		}
		game.message("Your way is blocked");
	}
}
Player.prototype.updateStats = function()
{
	this.maxhp = this.base_maxhp;
	this.protection = 0;
	
	this.light_range = 1;
	this.melee_damage = "1d2";
	this.melee_accuracy = 10;
	this.melee_attack_delay = 1.0;

	for(var n=0; n<this.equipment.length; n++)
		if (this.equipment[n] != null)
			this.equipment[n].updatePlayerWhenEquiped(this);

	if (this.hp > this.maxhp)
		this.hp = this.maxhp;
}
Player.prototype.takeDamage = function(damage_amount, source)
{
	damage_amount -= this.protection;
	if (damage_amount < 1)
		damage_amount = 1;
	
	this.hp -= damage_amount;
	if (this.hp < 1)
	{
		game.removeActor(this);
		game.engine.lock();
		game.draw();
	}
	
	return damage_amount;
}

function ItemSelect(player, callback)
{
	this._player = player;
	this._callback = callback;

	var cnt = this._player.inventory.length;
	if (cnt < 1)
		return;
	this._player.inventory.sort(function(a, b) { if (a.type != b.type) return a.type - b.type; return a.getName().localeCompare(b.getName()); });
	
	for(var n=0;n<cnt+2;n++)
	{
		for(var m=0;m<60;m++)
			game.display.draw(3+m, 4+n, " ");
		game.display.draw(3, 4+n, "|");
		game.display.draw(62, 4+n, "|");
	}
	for(var n=0;n<60;n++)
	{
		game.display.draw(3+n, 3, "-");
		game.display.draw(3+n, 6+cnt, "-");
	}
	for(var n=0; n<cnt; n++)
	{
		var inv = this._player.inventory[n];
		var name = inv.getName();
		if (inv.stack_size > 1)
			name = inv.amount + "x " + name;
		game.display.drawText(5, 5+n, ((n+1)%10) + ")   " + name);
		game.display.draw(8, 5+n, inv.getGlyph()[0], "#" + inv.getGlyph().slice(1, 4));
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

			if (index < this._player.inventory.length)
			{
				window.addEventListener("keydown", this._player);
				window.addEventListener("keypress", this._player);
				window.removeEventListener("keydown", this);
				window.removeEventListener("keypress", this);
				this._callback(index);
			}
		}
		break;
	}
}

MessageBox = function(player, message)
{
	this._player = player;

	var cnt = game.display.drawText(5, 5, message, 56);
	for(var n=0;n<cnt+2;n++)
	{
		for(var m=0;m<60;m++)
			game.display.draw(3+m, 4+n, " ");
		game.display.draw(3, 4+n, "|");
		game.display.draw(62, 4+n, "|");
	}
	for(var n=0;n<60;n++)
	{
		game.display.draw(3+n, 3, "-");
		game.display.draw(3+n, 6+cnt, "-");
	}
	game.display.drawText(5, 5, message, 56);

	window.removeEventListener("keydown", this._player);
	window.removeEventListener("keypress", this._player);
	//window.addEventListener("keydown", this);
	window.addEventListener("keypress", this);
}
MessageBox.prototype.handleEvent = function(e) 
{
	window.addEventListener("keydown", this._player);
	window.addEventListener("keypress", this._player);
	//window.removeEventListener("keydown", this);
	window.removeEventListener("keypress", this);
	game.draw();
}
