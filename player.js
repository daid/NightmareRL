var Player = function(x, y) {
	Actor.call(this, x, y);
}
Player.extend(Actor);

Player.prototype.act = function()
{
	game.engine.lock();
	game.draw();
	window.addEventListener("keydown", this);
}
Player.prototype.getGlyph = function()
{
	return "@FFF";
}
Player.prototype.executeAction = function(duration)
{
	t = Date.now();
	game.scheduler.setDuration(duration);
	window.removeEventListener("keydown", this);
	game.engine.unlock();
	tick_time = (Date.now() - t);
	console.log("Tick time:" + tick_time + " (" + 1000/tick_time + ")");
}
Player.prototype.handleEvent = function(e) 
{
	switch(e.keyCode)
	{
	case ROT.VK_PERIOD:
		//Wait action.
		this.executeAction(1);
		break;
	case ROT.VK_UP:
		this.move(this.x, this.y - 1);
		break;
	case ROT.VK_DOWN:
		this.move(this.x, this.y + 1);
		break;
	case ROT.VK_LEFT:
		this.move(this.x - 1, this.y);
		break;
	case ROT.VK_RIGHT:
		this.move(this.x + 1, this.y);
		break;
	}
},
Player.prototype.move = function(x, y)
{
	if (game.spaceIsFree(x, y))
	{
		game.moveActor(this, x, y);
		this.executeAction(1);
	}else{
		var pos = p(x, y);
		if (pos in game.map && game.map[pos].actor != null)
		{
			var bump_result = game.map[pos].actor.playerBump();
			if (bump_result > 0)
			{
				this.executeAction(bump_result);
				return;
			}
		}
		if (pos in game.map && game.map[pos].fixture != null)
		{
			var bump_result = game.map[pos].fixture.playerBump();
			if (bump_result > 0)
			{
				this.executeAction(bump_result);
				return;
			}
		}
		game.message("Your way is blocked");
	}
}
