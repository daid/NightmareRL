var Actor = function(x, y) {
	this.x = x;
	this.y = y;
	
	game.addActor(this);
}
Actor.prototype.act = function()
{
	game.scheduler.setDuration(100);
}
Actor.prototype.getGlyph = function()
{
	return "?F00";
}
Actor.prototype.playerBump = function()
{
	return -1;
}