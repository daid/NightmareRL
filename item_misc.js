var AstralShard = function(x, y)
{
	Item.call(this, x, y);
	
	this.amount = 1;
	this.stack_size = 20;
}
AstralShard.extend(Item);
AstralShard.prototype.getGlyph = function() { return "'66C"; }
AstralShard.prototype.getName = function() { return "Astral shard"; }

var SpiderSilk = function(x, y)
{
	Item.call(this, x, y);
	
	this.amount = 1;
	this.stack_size = 20;
}
SpiderSilk.extend(Item);
SpiderSilk.prototype.getGlyph = function() { return "'FFF"; }
SpiderSilk.prototype.getName = function() { return "Spider silk"; }

var PieceOfBone = function(x, y)
{
	Item.call(this, x, y);
	
	this.amount = 1;
	this.stack_size = 20;
}
PieceOfBone.extend(Item);
PieceOfBone.prototype.getGlyph = function() { return "'FC6"; }
PieceOfBone.prototype.getName = function() { return "Piece of bone"; }
