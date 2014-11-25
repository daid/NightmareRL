var ArmorBase = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = EquipmentBodyItem;
	this.health = 100;
	this.protection = 1;
}.extend(Item, {
	updatePlayerWhenEquiped: function(player)
	{
		player.protection += this.protection;
	},
	takeDamage: function(player, damage_amount, source)
	{
		this.health -= damage_amount * 100 / player.maxhp;
		if (this.health <= 0)
		{
			this.health = 0;
			for(var n=0; n<player.equipment.length; n++)
				if (player.equipment[n] == this)
					player.equipment[n] = null;
			game.message("Your " + this.getName() + " is destroyed");
		}
	}
});

var BodyArmor = function(x, y)
{
	ArmorBase.call(this, x, y);
	
	this.type = EquipmentBodyItem;
	this.protection = 2;
}.extend(ArmorBase, {
	getGlyph: function() { return "&448"; },
	getName: function() { return "BodyArmor ["+this.protection+"] (" + Math.floor(this.health) + "%)"; },
});

var Helmet = function(x, y)
{
	ArmorBase.call(this, x, y);
	
	this.type = EquipmentHeadItem;
	this.protection = 1;
}.extend(ArmorBase, {
	getGlyph: function() { return "^448"; },
	getName: function() { return "Helmet ["+this.protection+"] (" + Math.floor(this.health) + "%)"; },
});
