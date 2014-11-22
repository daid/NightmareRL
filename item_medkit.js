var Medkit = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = UsableItem;
	this.amount = 1;
	this.stack_size = 1;
}
Medkit.extend(Item);
Medkit.prototype.getGlyph = function() { return "+C22"; }
Medkit.prototype.getName = function() { return "Medkit"; }
Medkit.prototype.useItem = function(player)
{
	if (player.hp < player.maxhp)
	{
		game.message("You use the medkit to heal ourself.");
		player.hp += Math.floor(player.maxhp / 2);
		if (player.hp > player.maxhp)
			player.hp = player.maxhp;
		this.amount --;
		return 2.5;
	}
	game.message("You have no wounds...");
	return 0;
}
