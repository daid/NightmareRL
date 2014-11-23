var EquipmentHandItem = 0;
var EquipmentBodyItem = 1;
var EquipmentHeadItem = 2;
var UsableItem = 3;
var MiscItem = 4;
var Item = function(x, y)
{
	this.x = x;
	this.y = y;
	
	this.amount = 1;
	this.stack_size = 1;
	this.type = MiscItem;
	
	if (this.x != null && p(this.x, this.y) in game.map)
		game.map[p(this.x, this.y)].items.push(this);
}
Item.prototype.getGlyph = function() { return "?080"; }
Item.prototype.getName = function() { return "???"; }
Item.prototype.updatePlayerWhenEquiped = function(player) { }
Item.prototype.tickWhenEquiped = function(player, delay) { }
Item.prototype.takeDamage = function(player, damage_amount, source) { }
Item.prototype.useItem = function(player) { return -1; }

Item.prototype.pickup = function(player)
{
	var added = 0;
	for(var n=0; n<player.inventory.length; n++)
	{
		var inv = player.inventory[n];
		if (Object.getPrototypeOf(inv) == Object.getPrototypeOf(this))
		{
			var add = this.amount;
			if (add > inv.stack_size - inv.amount)
				add = inv.stack_size - inv.amount;
			if (add > 0)
			{
				this.amount -= add;
				inv.amount += add;
				added += add;
			}
		}
	}
	
	if (this.amount > 0)
	{
		if (player.inventory.length >= player.max_inventory_size)
		{
			return added;
		}
		player.inventory.push(this);
	}

	var pos = p(this.x,this.y);
	game.map[pos].items.remove(this);
	
	this.x = null;
	this.y = null;
	return added + this.amount;
}
Item.prototype.drop = function(player)
{
	this.x = player.x;
	this.y = player.y;
	
	player.inventory.remove(this);
	game.map[p(this.x, this.y)].items.push(this);
}
