var Zombie = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.hp = 10;
	this.protection = 0;
	this.melee_damage = "1d3";
	this.melee_accuracy = 7;
	this.melee_attack_delay = 1.5;
	
	this.move_delay = 1.2;
	this.name = "Zombie";
	
	game.addActor(this);
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
	this.x = x;
	this.y = y;
	
	this.hp = 8;
	this.protection = 0;
	this.melee_damage = "1d4";
	this.melee_accuracy = 8;
	this.melee_attack_delay = 1.0;
	
	this.move_delay = 1.0;
	this.name = "Giant spider";
	
	game.addActor(this);
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
