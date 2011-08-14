var Habracleaner = {
	prefs: null,
	stylesheet: '',
	
	setupOptions: function ()
	{
		Habracleaner.options['rules-authors'] = Habracleaner.prefs.getCharPref('rules-authors');
		Habracleaner.options['rules-tags'] = Habracleaner.prefs.getCharPref('rules-tags');
		Habracleaner.options['rules-blogs'] = Habracleaner.prefs.getCharPref('rules-blogs');
		Habracleaner.options['blind'] = Habracleaner.prefs.getBoolPref('blind');
	},
	
	observe: function (subject, topic, data)
	{
		if (topic == 'nsPref:changed')
			Habracleaner.setupOptions();
	},
	
	contentLoad: function (e)
	{
		var unsafeWin = e.target.defaultView;
		
		if (unsafeWin.wrappedJSObject)
			unsafeWin = unsafeWin.wrappedJSObject;
		
		var unsafeLoc = new XPCNativeWrapper(unsafeWin, 'location').location;
		var href = new XPCNativeWrapper(unsafeLoc, 'href').href;
		
		if (/^https?:\/\/habrahabr\.ru\/(page.*|new\/.*)?$/.test(href))
		{
			var safeWin = new XPCNativeWrapper(unsafeWin);
			var sandbox = new Components.utils.Sandbox(safeWin);
			sandbox.window = safeWin;
			sandbox.document = sandbox.window.document;
			sandbox.options = Habracleaner.options;
			sandbox.stylesheetContent = Habracleaner.stylesheet;
			sandbox.__proto__ = sandbox.window;
			
			try
			{
				Components.utils.evalInSandbox('(function(){' + HabracleanerScript + '})()', sandbox);
			}
			catch (e)
			{
				// nothing
			}
		}
	},
	
	onLoad: function ()
	{
		Habracleaner.prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('extensions.habracleaner.');
		Habracleaner.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		Habracleaner.prefs.addObserver('', Habracleaner, false);
		Habracleaner.options = {};
		
		Habracleaner.setupOptions();
		
		var request = new XMLHttpRequest();
		request.open('GET', 'chrome://habracleaner/content/css/hide.css', false);
		request.send(null);
		Habracleaner.stylesheet = request.responseText;
		
		var appcontent = window.document.getElementById('appcontent');
		
		if (appcontent)
			appcontent.addEventListener('DOMContentLoaded', Habracleaner.contentLoad, false);
	},
	
	onUnLoad: function ()
	{
		Habracleaner.prefs.removeObserver('', Habracleaner);
		
		var appcontent = window.document.getElementById('appcontent');
		
		window.removeEventListener('load', Habracleaner.onLoad, false);
		window.removeEventListener('unload', Habracleaner.onUnLoad, false);
		
		if (appcontent)
			appcontent.removeEventListener('DOMContentLoaded', Habracleaner.contentLoad, false);
	}
};

window.addEventListener('load', Habracleaner.onLoad, false);
window.addEventListener('unload', Habracleaner.onUnLoad, false);
