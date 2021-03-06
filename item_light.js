var ElectricalLightbringerBase = function(x, y)
{
	Item.call(this, x, y);
	
	this.charge = 100;
	if (ROT.RNG.getPercentage() < 30)
		this.charge = ROT.RNG.getUniformInt(60, 100)
	if (ROT.RNG.getPercentage() < 10)
		this.charge = 0.0;
	this.use_factor = 0.5;
	this.base_name = "Unknown";
	this.light_range = 10;
}.extend(Item, {
	getName: function()
	{
		if (this.charge >= 95)
			return this.base_name + " (full)";
		if (this.charge >= 85)
			return this.base_name + " (slightly used)";
		if (this.charge >= 50)
			return this.base_name + " (used)";
		if (this.charge >= 30)
			return this.base_name + " (slightly dimmed)";
		if (this.charge >= 10)
			return this.base_name + " (dimmed)";
		if (this.charge > 0)
			return this.base_name + " (running low)";
		return this.base_name + " (empty)";
	},
	updatePlayerWhenEquiped: function(player)
	{
		if (this.charge > 0)
		{
			var range = this.light_range;
			if (this.charge < 50)
				range--;
			if (this.charge < 30)
				range--;
			if (this.charge < 10)
				range = Math.floor(range / 2);
			if (player.light_range < range)
				player.light_range = range;
		}
	},
	tickWhenEquiped: function(player, duration)
	{
		this.charge -= duration * this.use_factor;
		if (this.charge < 0.0)
			this.charge = 0.0;
	}
});

var FlashLight = function(x, y)
{
	ElectricalLightbringerBase.call(this, x, y);
	
	this.use_factor = 0.5;
	this.base_name = "Flashlight";
	this.light_range = 9;
	this.type = EquipmentHandItem;
}.extend(ElectricalLightbringerBase, {
	getGlyph: function() { return "/AAA"; },
	updatePlayerWhenEquiped: function(player)
	{
		ElectricalLightbringerBase.prototype.updatePlayerWhenEquiped.call(this, player);
		player.melee_damage = "1d4";
	},
});

var HeadLight = function(x, y)
{
	ElectricalLightbringerBase.call(this, x, y);
	
	this.use_factor = 0.3;
	this.base_name = "HeadLight";
	this.light_range = 5;
	this.type = EquipmentHeadItem;
}.extend(ElectricalLightbringerBase, {
	getGlyph: function() { return "*CC2"; },
	postCraft: function(player) { this.charge = 100; },
});

var Batteries = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = UsableItem;
	this.amount = 4;
	this.stack_size = 12;
}.extend(Item, {
	getGlyph: function() { return "\"22C"; },
	getName: function() { return "Battery"; },
	useItem: function(player)
	{
		for(var n=0; n<player.equipment.length; n++)
		{
			var inv = player.equipment[n];
			if (inv instanceof ElectricalLightbringerBase && inv.charge < 95)
			{
				inv.charge = 100;
				game.message("You put a new battery in your " + inv.getName());
				this.amount --;
				return 1.5;
			}
		}
		game.message("You have nothing sensible to put a battery into.");
		return 0;
	},
});
