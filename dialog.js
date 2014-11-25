var DialogBase = function(player)
{
	this._player = player;
	
	window.removeEventListener("keydown", this._player);
	window.removeEventListener("keypress", this._player);
	window.addEventListener("keydown", this);
	window.addEventListener("keypress", this);
}.extend(Object, {
	drawBox: function(x, y, w, h)
	{
		for(var n=1;n<h;n++)
		{
			for(var m=1;m<w;m++)
				game.display.draw(x+m, y+n, " ");
			game.display.draw(x, y+n, "|");
			game.display.draw(x+w-1, y+n, "|");
		}
		for(var n=0;n<w;n++)
		{
			game.display.draw(x+n, y, "-");
			game.display.draw(x+n, y+h-1, "-");
		}
		game.display.draw(x, y, "/");
		game.display.draw(x+w-1, y, "\\");
		game.display.draw(x, y+h-1, "\\");
		game.display.draw(x+w-1, y+h-1, "/");
	},
	drawOptions: function(options)
	{
		var x = 3;
		var y = 3;
		var width = 60;
		var height = 4;
		for(var n=0; n<options.length; n++)
		{
			height += game.display.drawText(x + 2 + 3, y + 2, options[n], width - 7, 0);
		}
		this.drawBox(x, y, width, height);
		var line_nr = y + 2;
		for(var n=0; n<options.length; n++)
		{
			game.display.draw(x + 2 + 1, line_nr, ')');
			if (n < 9)
				game.display.draw(x + 2, line_nr, String(n + 1));
			else if (n == 9)
				game.display.draw(x + 2, line_nr, '0');
			else
				game.display.draw(x + 2, line_nr, String.fromCharCode(87 + n));
			line_nr += game.display.drawText(x + 2 + 3, line_nr, options[n], width - 7);
		}
	},
	handleEvent: function(e)
	{
		console.log(e.type, e.keyCode, e.charCode);
		if (e.type == "keydown" && e.keyCode == ROT.VK_ESCAPE)
		{
			this.release();
			game.draw();
		}
		if (e.type == "keypress")
		{
			if (e.charCode >= 49 && e.charCode <= 57)
				this.selectOption(e.charCode - 49);
			if (e.charCode == 48)
				this.selectOption(9);
			if (e.charCode >= 97 && e.charCode <= 122)
				this.selectOption(e.charCode - 97 + 10);
			if (e.charCode >= 65 && e.charCode <= 90)
				this.selectOption(e.charCode - 65 + 10);
		}
	},
	selectOption: function(index)
	{
		console.log(index);
	},
	release: function()
	{
		window.addEventListener("keydown", this._player);
		window.addEventListener("keypress", this._player);
		window.removeEventListener("keydown", this);
		window.removeEventListener("keypress", this);
	}
});

var MessageBox = function(player, message)
{
	DialogBase.call(this, player);
	
	var lines = game.display.drawText(5, 5, message, 56, 0);
	this.drawBox(3, 3, 60, lines + 4);
	game.display.drawText(5, 5, message, 56);
}.extend(DialogBase, {
	handleEvent: function(e) 
	{
		if (e.type == "keypress")
		{
			this.release();
			game.draw();
		}
	}
});

var ItemSelect = function(player, callback)
{
	if (player.inventory.length < 1)
	{
		new MessageBox(player, "Your inventory is empty.");
		return;
	}
		
	this._callback = callback;
	DialogBase.call(this, player);

	this._player.inventory.sort(function(a, b) { if (a.type != b.type) return a.type - b.type; return a.getName().localeCompare(b.getName()); });
	var options = [];
	for(var n=0; n<player.inventory.length; n++)
	{
		var inv = this._player.inventory[n];
		var name = inv.getName();
		if (inv.stack_size > 1)
			name = inv.amount + "x " + name;
		name = "%c{#"+inv.getGlyph().slice(1, 4)+"}" + inv.getGlyph()[0] + "%c{} " + name;
		options.push(name);
	}
	this.drawOptions(options);
}.extend(DialogBase, {
	selectOption: function(index)
	{
		if (index < this._player.inventory.length)
		{
			this.release();
			this._callback(index);
		}
	}
});

var CraftSelect = function(player, callback)
{
	var options = []
	var full_options = []
	for(var name in CraftRecipes)
	{
		var can_craft = true;
		var full_option = name + " (";
		for(var requirement_name in CraftRecipes[name])
		{
			var requirement = window[requirement_name]
			if (requirement.prototype instanceof Item)
			{
				if (CraftRecipes[name][requirement_name] > 1)
					full_option += CraftRecipes[name][requirement_name] + "x ";
				full_option += requirement_name;
				full_option += ", ";
				if (player.countItem(requirement) < CraftRecipes[name][requirement_name])
				{
					can_craft = false;
					break;
				}
			}else if (requirement.prototype instanceof StaticObject)
			{
				var deltas = ROT.DIRS[8];
				var found = false;
				for(var n=0; n<deltas.length; n++)
				{
					var pos = p(player.x + deltas[n][0], player.y + deltas[n][1]);
					if (pos in game.map && game.map[pos].static_object != null && game.map[pos].static_object instanceof requirement)
					{
						found = true;
					}
				}
				if (!found)
				{
					can_craft = false;
					break;
				}
			}else{
				console.log("Unknown craft requirement: ", name, "needs", requirement_name);
			}
		}
		if (can_craft)
		{
			full_option = full_option.slice(0, full_option.length - 2) + ")";
			full_options.push(full_option);
			options.push(name);
		}
	}
	
	if (options.length < 1)
	{
		new MessageBox(player, "You do not meet the requirements to craft anything right now.\n\n(Tip: Crafting requires a workbench or an altar)");
		return;
	}
	this._options = options;
	this._callback = callback;
	
	DialogBase.call(this, player);
	this.drawOptions(full_options);
}.extend(DialogBase, {
	selectOption: function(index)
	{
		if (index < this._options.length)
		{
			this.release();
			this._callback(this._options[index]);
		}
	}
});
