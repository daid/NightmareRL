var MonsterBase = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.hp = 10;
	this.protection = 0;
	this.melee_damage = "1d2";
	this.melee_accuracy = 10;
	this.melee_attack_delay = 1.0;
	
	this.move_delay = 1.0;
	this.name = "Unknown";
	this.spawn_score = 1;
	
	game.addActor(this);
}.extend(Actor, {
	act: function()
	{
		if (this.aiMoveToPlayer())
			return;
		if (this.aiRandomWalk())
			return;
		
		game.scheduler.setDuration(this.move_delay);
	},
	aiMoveToPlayer: function()
	{
		var pd = game.map[p(this.x, this.y)].player_distance;
		var deltas = ROT.DIRS[8];
		var new_x = this.x;
		var new_y = this.y;
		
		if (pd < 2.0)
		{
			this.meleeAttackEnemy(game.player);
			return true;
		}
		
		for(var n=0; n<deltas.length; n++)
		{
			var x = this.x + deltas[n][0];
			var y = this.y + deltas[n][1];
			if (p(x, y) in game.map && game.map[p(x, y)].player_distance < pd && game.spaceIsFree(x, y))
			{
				new_x = x;
				new_y = y;
				pd = game.map[p(x, y)].player_distance;
			}
		}
		
		if (new_x != this.x || new_y != this.y)
		{
			if (new_x != this.x && new_y != this.y)
				game.scheduler.setDuration(this.move_delay * 1.2);
			else
				game.scheduler.setDuration(this.move_delay);
			game.moveActor(this, new_x, new_y);
			return true;
		}
		return false;
	},

	aiFleeFromPlayer: function()
	{
		var pd = game.map[p(this.x, this.y)].player_distance;
		var deltas = ROT.DIRS[8];
		var new_x = this.x;
		var new_y = this.y;

		for(var n=0; n<deltas.length; n++)
		{
			var x = this.x + deltas[n][0];
			var y = this.y + deltas[n][1];
			if (p(x, y) in game.map && game.map[p(x, y)].player_distance > pd && game.spaceIsFree(x, y))
			{
				new_x = x;
				new_y = y;
				pd = game.map[p(x, y)].player_distance;
			}
		}
		
		if (new_x != this.x || new_y != this.y)
		{
			if (new_x != this.x && new_y != this.y)
				game.scheduler.setDuration(this.move_delay * 1.2);
			else
				game.scheduler.setDuration(this.move_delay);
			game.moveActor(this, new_x, new_y);
			return true;
		}
		return false;
	},

	aiRandomWalk: function()
	{
		var deltas = ROT.DIRS[8];

		var options = [];
		for(var n=0; n<deltas.length; n++)
		{
			var x = this.x + deltas[n][0];
			var y = this.y + deltas[n][1];
			if (p(x, y) in game.map && game.spaceIsFree(x, y))
			{
				options.push(n);
			}
		}
		var n = options.random();
		if (n === null)
			return false;

		var new_x = this.x + deltas[n][0];
		var new_y = this.y + deltas[n][1];
		
		if (new_x != this.x && new_y != this.y)
			game.scheduler.setDuration(this.move_delay * 1.2);
		else
			game.scheduler.setDuration(this.move_delay);
		game.moveActor(this, new_x, new_y);
		return true;
	},

	meleeAttackEnemy: function(player)
	{
		var hit_roll = rollDie("3d6");
		if (hit_roll <= player.melee_accuracy)
		{
			var damage = player.takeDamage(rollDie(this.melee_damage), this);
			if (player.hp < 1)
				game.message("The " + this.name + " kills you...");
			else
				game.message("The " + this.name + " hits you for " + damage + " damage");
		}else{
			game.message("The " + this.name + " attacks you but missed.");
		}

		game.scheduler.setDuration(this.melee_attack_delay);
	},

	playerBump: function(player)
	{
		var hit_roll = rollDie("3d6");
		if (hit_roll <= player.melee_accuracy)
		{
			var damage = this.takeDamage(rollDie(player.melee_damage), player);
			if (this.hp < 1)
				game.message("You kill the " + this.name);
			else
				game.message("You hit the " + this.name + " for " + damage + " damage");
		}else{
			game.message("You miss the " + this.name);
		}
		return player.melee_attack_delay;
	},

	takeDamage: function(damage_amount, source)
	{
		damage_amount -= this.protection;
		if (damage_amount < 1)
			damage_amount = 1;
		
		this.hp -= damage_amount;
		if (this.hp < 1)
		{
			game.removeActor(this);
			this.died(source);
		}
		
		return damage_amount;
	},
	
	died: function(source)
	{
	},
});
