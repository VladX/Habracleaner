var $ = function (id)
{
	return document.getElementById(id);
}

var saveopt = function (id)
{
	localStorage[id] = $(id).value;
}

var restoreopt = function (id)
{
	$(id).value = localStorage[id] ? localStorage[id] : '';
}

function save_options ()
{
	saveopt('rules-authors');
	saveopt('rules-tags');
	saveopt('rules-blogs');
	localStorage['blind'] = $('hide-type-blind').checked;
}

function restore_options ()
{
	$('rules-authors').addEventListener('change', save_options, false);
	$('rules-tags').addEventListener('change', save_options, false);
	$('rules-blogs').addEventListener('change', save_options, false);
	$('hide-type-blind').addEventListener('change', save_options, false);
	$('hide-type-full').addEventListener('change', save_options, false);
	window.addEventListener('unload', save_options, false);
	
	restoreopt('rules-authors');
	restoreopt('rules-tags');
	restoreopt('rules-blogs');
	
	if (localStorage['blind'] == null)
		return null;
	else if (localStorage['blind'] == true || localStorage['blind'] == 'true')
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
