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
