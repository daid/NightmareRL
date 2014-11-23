var Medkit = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = UsableItem;
	this.amount = 1;
	this.stack_size = 1;
}.extend(Item, {
	getGlyph: function() { return "+C22"; },
	getName: function() { return "Medkit"; },
	useItem: function(player)
	{
		if (player.hp < player.maxhp)
		{
			game.message("You use the medkit to heal ourself.");
			player.hp += Math.floor(player.maxhp / 2);
			if (player.hp > player.maxhp)
				player.hp = player.maxhp;
			this.amount --;
			return 3.5;
		}
		game.message("You have no wounds...");
		return 0;
	},
});

var Bandage = function(x, y)
{
	Item.call(this, x, y);
	
	this.type = UsableItem;
	this.amount = 1;
	this.stack_size = 1;
}.extend(Item, {
	getGlyph: function() { return "/C22"; },
	getName: function() { return "Bandage"; },
	useItem: function(player)
	{
		if (player.hp < player.maxhp)
		{
			game.message("You use the bandage to heal ourself.");
			player.hp += Math.floor(player.maxhp / 4);
			if (player.hp > player.maxhp)
				player.hp = player.maxhp;
			this.amount --;
			return 2.5;
		}
		game.message("You have no wounds...");
		return 0;
	},
});
