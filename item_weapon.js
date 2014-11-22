var Knife = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHandItem;
}
Knife.extend(Item);
Knife.prototype.getGlyph = function() { return "-CCC"; }
Knife.prototype.getName = function() { return "Knife"; }
Knife.prototype.updatePlayerWhenEquiped = function(player)
{
	player.melee_damage = "1d6";
	player.melee_accuracy++;
}

var Sword = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHandItem;
}
Sword.extend(Item);
Sword.prototype.getGlyph = function() { return "\\CCC"; }
Sword.prototype.getName = function() { return "Sword"; }
Sword.prototype.updatePlayerWhenEquiped = function(player)
{
	player.melee_damage = "2d6";
}
