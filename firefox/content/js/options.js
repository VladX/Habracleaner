(function(){

var $ = function (id)
{
	return document.getElementById(id);
}

var options = {
	_prefs: function ()
	{
		if (!this.hasOwnProperty('prefs'))
		{
			this.prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('extensions.habracleaner.');
			this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		}
	},
	
	saveString: function (id)
	{
		this._prefs();
		this.prefs.setCharPref(id, $(id).value);
	},
	
	saveBool: function (id, val)
	{
		this._prefs();
		this.prefs.setBoolPref(id, val);
	},
	
	restoreString: function (id)
	{
		this._prefs();
		$(id).value = this.prefs.getCharPref(id) ? this.prefs.getCharPref(id) : '';
	},
	
	restoreBool: function (id)
	{
		this._prefs();
		return this.prefs.getBoolPref(id);
	}
}

this.HabracleanerOptions = {
	save_options: function ()
	{
		options.saveString('rules-authors');
		options.saveString('rules-tags');
		options.saveString('rules-blogs');
		options.saveBool('blind', $('hide-type-blind').checked);
	},
	
	restore_options: function ()
	{
		$('rules-authors').addEventListener('change', this.save_options, false);
		$('rules-tags').addEventListener('change', this.save_options, false);
		$('rules-blogs').addEventListener('change', this.save_options, false);
		$('hide-type-blind').addEventListener('change', this.save_options, false);
		$('hide-type-full').addEventListener('change', this.save_options, false);
		window.addEventListener('unload', this.save_options, false);
		
		options.restoreString('rules-authors');
		options.restoreString('rules-tags');
		options.restoreString('rules-blogs');
		
		var blind = options.restoreBool('blind');
		
		if (blind == null)
			return null;
		else if (blind == true || blind == 'true')
		{
			$('hide-type-full').checked = false;
			$('hide-type-blind').checked = true;
		}
		else
		{
			$('hide-type-blind').checked = false;
			$('hide-type-full').checked = true;
		}
	}
}

})();
