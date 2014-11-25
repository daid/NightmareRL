var StartText = "It is this dream again. This nightmare. "+
	"You have it every night.\n"+
	"Will you manage to escape the darkness this time? "+
	"Or will you once again fall victim to the horrors that haunt you.\n"+
	"\n"+
	"(Tip: Press '?' for help)";
var HelpText = "Arrow keys: Move\n" +
	".: Wait\n"+
	"g: Pickup (get) item from floor\n"+
	"i: Inventory (use/equip items).\n"+
	"u: Use item.\n"+
	"e: Equip item\n"+
	"d: Drop item\n"+
	"c: Craft item\n"+
	"l: Show message log";

var EquipSlotHand = 0;
var EquipSlotBody = 1;
var EquipSlotHead = 2;

var Player = function(x, y) {
	this.inventory = []
	this.max_inventory_size = 10;
	
	this.equipment = [null, null, null];
	
	this.base_maxhp = 50;
	this.experience = 0;
	this.level = 1;
	this.hp = this.base_maxhp;
	
	this.updateStats();
	
	Actor.call(this, x, y);
}.extend(Actor, {
	act: function()
	{
		game.engine.lock();
		this.updateStats();
		game.updateGlobalPlayerData();
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
	},
	getGlyph: function()
	{
		return "@FFF";
	},
	executeAction: function(duration)
	{
		t = Date.now();
		for(var n=0; n<this.equipment.length; n++)
			if (this.equipment[n] != null)
				this.equipment[n].tickWhenEquiped(this, duration);
		game.scheduler.setDuration(duration);
		window.removeEventListener("keydown", this);
		window.removeEventListener("keypress", this);
		game.updateGlobalPlayerData();
		game.engine.unlock();
		tick_time = (Date.now() - t);
		console.log("Tick time:" + tick_time + " (" + 1000/tick_time + ")");
	},
	handleEvent: function(e) 
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
					this.equipItem(inv);
				}.bind(this));
				break;
			case "u"://Use
				new ItemSelect(this, function(index) {
					var inv = this.inventory[index];
					this.useItem(inv);
				}.bind(this));
				break;
			case "i"://Inventory
				new ItemSelect(this, function(index) {
					var inv = this.inventory[index];
					switch(inv.type)
					{
					case EquipmentHandItem:
					case EquipmentBodyItem:
					case EquipmentHeadItem:
						this.equipItem(inv);
						break;
					case UsableItem:
						this.useItem(inv);
						break;
					case MiscItem:
					default:
						game.draw();
						break;
					}
				}.bind(this));
				break;
			case "c"://Craft
				new CraftSelect(this, function(create_name)
				{
					this.craftItem(create_name);
				}.bind(this));
				break;
			case "l":
				new MessageBox(this, game.messageLog.join("\n"), game.messageLog.length * 10);
				break;
			case "?"://Help
				new MessageBox(this, HelpText);
				break;
			case "^"://Toggle debug mode.
				game.debug = !game.debug;
				if (game.debug)
				{
					new Knife(this.x, this.y);
					new PieceOfBone(this.x, this.y).amount = 10;
					new AstralShard(this.x, this.y).amount = 10;
					new SpiderSilk(this.x, this.y).amount = 10;
					new Altar(this.x + 1, this.y);
					new Workbench(this.x - 1, this.y);
				}
				game.draw();
				break;
			default:
				console.log("Unhandled key pressed: " + String.fromCharCode(e.charCode));
				return;
			}
			break;
		}
		e.preventDefault();
	},
	equipItem: function(inv)
	{
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
	},
	useItem: function(inv)
	{
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
	},
	countItem: function(item_constructor)
	{
		var amount = 0;
		for(var n=0; n<this.inventory.length; n++)
		{
			if (this.inventory[n] instanceof item_constructor)
				amount += this.inventory[n].amount;
		}
		return amount;
	},
	craftItem: function(item_name)
	{
		for(var requirement_name in CraftRecipes[item_name])
		{
			var requirement = window[requirement_name]
			var amount = CraftRecipes[item_name][requirement_name];
			if (requirement.prototype instanceof Item)
			{
				for(var n=0; n<this.inventory.length; n++)
				{
					if (this.inventory[n] instanceof requirement)
					{
						var take = Math.min(amount, this.inventory[n].amount)
						this.inventory[n].amount -= take;
						amount -= take;
						if (this.inventory[n].amount < 1)
						{
							this.inventory.splice(n, 1);
							n--;
						}
					}
				}
			}
		}
		var item = new window[item_name](this.x, this.y);
		item.postCraft(this);
		item.pickup(this);
		game.message("You craft a " + item_name);
		this.executeAction(5.0);
	},
	move: function(x, y)
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
				game.message("Your way is blocked by a " + game.map[pos].static_object.getName());
				return
			}
			game.message("Your way is blocked");
		}
	},
	updateStats: function()
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
	},
	takeDamage: function(damage_amount, source)
	{
		if (game.map[p(this.x, this.y)].floor != Corpse)
			game.map[p(this.x, this.y)].floor = Blood;
		damage_amount -= this.protection;
		if (damage_amount < 1)
			damage_amount = 1;
		
		for(var n=0; n<this.equipment.length; n++)
			if (this.equipment[n] != null)
				this.equipment[n].takeDamage(this, damage_amount, source);
		
		this.hp -= damage_amount;
		if (this.hp < 1)
		{
			game.map[p(this.x, this.y)].floor = Corpse;
			game.removeActor(this);
			game.engine.lock();
			game.draw();
		}
		
		return damage_amount;
	},
	gainExperience: function(amount)
	{
		this.experience += amount;
	},
});
