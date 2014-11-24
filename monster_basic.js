var Zombie = function(x, y) {
	MonsterBase.call(this, x, y);
	
	this.hp = 15;
	this.protection = 0;
	this.melee_damage = "1d3";
	this.melee_accuracy = 7;
	this.melee_attack_delay = 1.5;
	
	this.move_delay = 1.5;
	this.name = "Zombie";
	this.spawn_score = 2;
}.extend(MonsterBase, {
	getGlyph: function() { return "zDDD"; },
	act: function()
	{
		if (game.map[p(this.x, this.y)].player_visible)
		{
			if (this.aiMoveToPlayer())
				return;
		}
		if (this.aiRandomWalk())
			return;
		
		game.scheduler.setDuration(this.move_delay);
	},
	takeDamage: function(damage_amount, source)
	{
		if (game.map[p(this.x, this.y)].floor != Corpse)
			game.map[p(this.x, this.y)].floor = Blood;
		return MonsterBase.prototype.takeDamage.call(this, damage_amount, source);
	},
	died: function(source)
	{
		game.map[p(this.x, this.y)].floor = Corpse;
		if (ROT.RNG.getPercentage() < 20)
			new PieceOfBone(this.x, this.y).amount = ROT.RNG.getUniformInt(1, 2);
	},
});

var GiantSpider = function(x, y) {
	MonsterBase.call(this, x, y);
	
	this.hp = 8;
	this.protection = 0;
	this.melee_damage = "1d4";
	this.melee_accuracy = 8;
	this.melee_attack_delay = 1.0;
	
	this.move_delay = 1.0;
	this.name = "Giant spider";
	this.spawn_score = 3;
}.extend(MonsterBase, {
	act: function()
	{
		var pos = p(this.x, this.y);
		if (game.map[pos].player_visible && game.map[pos].player_distance < 5)
		{
			if (this.aiMoveToPlayer())
				return;
		}
		if (ROT.RNG.getPercentage() < 15)
			if (this.aiRandomWalk())
				return;
		
		game.scheduler.setDuration(this.move_delay);
	},
	getGlyph: function() { return "sFE7"; },
	died: function(source)
	{
		if (game.map[p(this.x, this.y)].floor != Corpse)
			game.map[p(this.x, this.y)].floor = Blood;
		if (ROT.RNG.getPercentage() < 30)
			new SpiderSilk(this.x, this.y).amount = ROT.RNG.getUniformInt(1, 2);
	},
});

var Ghost = function(x, y) {
	MonsterBase.call(this, x, y);
	
	this.hp = 3;
	this.protection = 5;
	this.melee_damage = "1";
	this.melee_accuracy = 10;
	this.melee_attack_delay = 3.0;
	
	this.move_delay = 2.0;
	this.name = "Ghost";
	this.state = "wander";
	
	this.move_area = null;
	this.spawn_score = 2;
}.extend(MonsterBase, {
	act: function()
	{
		var pos = p(this.x, this.y);
		switch(this.state)
		{
		case "want_to_flee":
			this.state = "flee";
		case "wander":
			if (game.map[pos].player_visible)
			{
				if (this.aiMoveToPlayer())
					return;
			}
			
			var delta = ROT.DIRS[8].random();
			var new_x = this.x + delta[0];
			var new_y = this.y + delta[1];
			if (this.move_area == null || (new_x >= this.move_area[0] && new_x < this.move_area[0] + this.move_area[2] && new_y >= this.move_area[1] && new_y < this.move_area[1] + this.move_area[3]))
			{
				if (game.moveActor(this, new_x, new_y))
				{
					if (new_x != this.x && new_y != this.y)
						game.scheduler.setDuration(this.move_delay * 1.2);
					else
						game.scheduler.setDuration(this.move_delay);
				}
			}
			break;
		case "flee":
			this.move_delay = 1.0;
			var pd = game.map[pos].player_distance;
			if (pd < 5)
				if (this.aiFleeFromPlayer())
					return;
			this.move_delay = 2.0;
			this.state = "wander";
			game.scheduler.setDuration(0.1);
			return;
		}
		
		game.scheduler.setDuration(this.move_delay);
	},
	aiMoveToPlayer: function()
	{
		var dx = game.player.x - this.x;
		var dy = game.player.y - this.y;
		
		if (Math.abs(dx) < 2 && Math.abs(dy) < 2)
		{
			this.meleeAttackEnemy(game.player);
			return true;
		}
		
		var new_x = this.x + Math.sign(dx);
		var new_y = this.y + Math.sign(dy);
		var pos = p(new_x, new_y);
		if (game.moveActor(this, new_x, new_y))
		{
			if (new_x != this.x && new_y != this.y)
				game.scheduler.setDuration(this.move_delay * 1.2);
			else
				game.scheduler.setDuration(this.move_delay);
			return true;
		}
		return MonsterBase.prototype.aiMoveToPlayer.call(this);
	},
	getGlyph: function()
	{
		if (this.state == "wander")
			return "gFFF";
		return "gAAA";
	},
	takeDamage: function(damage_amount, source)
	{
		if (this.state == "wander")
			this.state = "want_to_flee";
		return MonsterBase.prototype.takeDamage.call(this, damage_amount, source);
	},
	died: function(source)
	{
		if (ROT.RNG.getPercentage() < 50)
			new AstralShard(this.x, this.y).amount = ROT.RNG.getUniformInt(1, 2);
	},
});