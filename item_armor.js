var BodyArmor = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentBodyItem;
	this.health = 100;
}
BodyArmor.extend(Item);
BodyArmor.prototype.getGlyph = function() { return "&448"; }
BodyArmor.prototype.getName = function() { return "BodyArmor [2] (" + Math.floor(this.health) + "%)"; }
BodyArmor.prototype.updatePlayerWhenEquiped = function(player)
{
	if (this.health > 0)
		player.protection += 2;
}
BodyArmor.prototype.takeDamage = function(player, damage_amount, source)
{
	this.health -= (damage_amount + 2) * 100 / player.maxhp;
	if (this.health < 0)
		this.health = 0;
}

var Helmet = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentHeadItem;
	this.health = 100;
}
Helmet.extend(Item);
Helmet.prototype.getGlyph = function() { return "^448"; }
Helmet.prototype.getName = function() { return "Helmet [1] (" + Math.floor(this.health) + "%)"; }
Helmet.prototype.updatePlayerWhenEquiped = function(player)
{
	if (this.health > 0)
		player.protection += 1;
}
Helmet.prototype.takeDamage = function(player, damage_amount, source)
{
	this.health -= (damage_amount + 1) * 100 / player.maxhp;
	if (this.health < 0)
		this.health = 0;
}
