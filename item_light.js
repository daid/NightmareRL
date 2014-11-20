var FlashLight = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHandItem;
}
FlashLight.extend(Item);
FlashLight.prototype.getGlyph = function() { return "/AAA"; }
FlashLight.prototype.getName = function() { return "Flashlight"; }
FlashLight.prototype.updatePlayerWhenEquiped = function(player) {
	if (player.light_range < 8)
		player.light_range = 8;
}

var HeadLight = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHeadItem;
}
HeadLight.extend(Item);
HeadLight.prototype.getGlyph = function() { return "*CC2"; }
HeadLight.prototype.getName = function() { return "HeadLight"; }
HeadLight.prototype.updatePlayerWhenEquiped = function(player) {
	if (player.light_range < 5)
		player.light_range = 5;
}
