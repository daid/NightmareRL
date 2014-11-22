var Zombie = function(x, y) {
	MonsterBase.call(this, x, y);
	
	this.hp = 10;
	this.protection = 0;
	this.melee_damage = "1d3";
	this.melee_accuracy = 7;
	this.melee_attack_delay = 1.5;
	
	this.move_delay = 1.2;
	this.name = "Zombie";
}
Zombie.extend(MonsterBase);
Zombie.prototype.act = function()
{
	if (game.map[p(this.x, this.y)].player_visible)
	{
		if (this.aiMoveToPlayer())
			return;
	}
	if (this.aiRandomWalk())
		return;
	
	game.scheduler.setDuration(this.move_delay);
}
Zombie.prototype.getGlyph = function() { return "ZDDD"; }

var GiantSpider = function(x, y) {
	MonsterBase.call(this, x, y);
	
	this.hp = 8;
	this.protection = 0;
	this.melee_damage = "1d4";
	this.melee_accuracy = 8;
	this.melee_attack_delay = 1.0;
	
	this.move_delay = 1.0;
	this.name = "Giant spider";
}
GiantSpider.extend(MonsterBase);
GiantSpider.prototype.act = function()
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
}
GiantSpider.prototype.getGlyph = function() { return "sFE7"; }

var Ghost = function(x, y) {
	MonsterBase.call(this, x, y);
	
	this.hp = 3;
	this.protection = 5;
	this.melee_damage = "1";
	this.melee_accuracy = 10;
	this.melee_attack_delay = 3.0;
	
	this.move_delay = 2.0;
	this.name = "Ghost";
	
	this.move_area = null;
}
Ghost.extend(MonsterBase);
Ghost.prototype.act = function()
{
	var pos = p(this.x, this.y);
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
	
	game.scheduler.setDuration(this.move_delay);
}
Ghost.prototype.getGlyph = function() { return "gFFF"; }
