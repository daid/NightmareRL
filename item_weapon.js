var Knife = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHandItem;
}.extend(Item, {
	getGlyph: function() { return "-CCC"; },
	getName: function() { return "Knife"; },
	updatePlayerWhenEquiped: function(player)
	{
		player.melee_damage = "1d6";
		player.melee_accuracy++;
	},
});

var Sword = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHandItem;
}.extend(Item, {
	getGlyph: function() { return "\\CCC"; },
	getName: function() { return "Sword"; },
	updatePlayerWhenEquiped: function(player)
	{
		player.melee_damage = "2d6";
	},
});

var GlowingDagger = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHandItem;
}.extend(Item, {
	getGlyph: function() { return "-99D"; },
	getName: function() { return "Glowing dagger"; },
	updatePlayerWhenEquiped: function(player)
	{
		player.melee_damage = "1d6+1";
		player.melee_accuracy++;
		if (player.light_range < 3)
			player.light_range = 3;
	},
});
