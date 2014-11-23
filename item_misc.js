var AstralShard = function(x, y)
{
	Item.call(this, x, y);
	
	this.amount = 1;
	this.stack_size = 20;
}.extend(Item, {
	getGlyph: function() { return "'66C"; },
	getName: function() { return "Astral shard"; },
});

var SpiderSilk = function(x, y)
{
	Item.call(this, x, y);
	
	this.amount = 1;
	this.stack_size = 20;
}.extend(Item, {
	getGlyph: function() { return "'FFF"; },
	getName: function() { return "Spider silk"; },
});

var PieceOfBone = function(x, y)
{
	Item.call(this, x, y);
	
	this.amount = 1;
	this.stack_size = 20;
}.extend(Item, {
	getGlyph: function() { return "'FC6"; },
	getName: function() { return "Piece of bone"; },
});
