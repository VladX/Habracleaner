var options = {};

var trim = function (string)
{
	return string ? string.trim() : '';
};

var getAuthorsBlacklist = function ()
{
	var rules = options['rules-authors'];
	
	if (!rules)
		return [];
	
	return rules.split(',').map(trim);
};

var getTagsBlacklist = function ()
{
	var rules = options['rules-tags'];
	
	if (!rules)
		return [];
	
	return rules.split(',').map(trim);
};

var getPosts = function ()
{
	var posts = document.getElementsByClassName('hentry');
	var r = [];
	
	for (var i = 0; i < posts.length; i++)
	{
		var author = posts[i].getElementsByClassName('author')[0];
		author = author ? trim(author.textContent) : '';
		
		var tags = posts[i].getElementsByClassName('tags')[0];
		tags = tags ? tags.textContent.split(',').map(trim) : [];
		
		var blog = posts[i].getElementsByClassName('blog')[0];
		var blogFullName = blog ? trim(blog.textContent) : '';
		var blogShortName = blog ? blog.href.replace(/^.+\/(?:blogs|company)\/([\w-]+).*$/i, '$1') : '';
		
		r.push({
			instance: posts[i],
			author: author,
			tags: tags,
			blog: {full: blogFullName, short: blogShortName}
		});
	}
	
	return r;
};

var hidePost = function (post)
{
	post.instance.className += ' habracleaner-hidden-post';
	
	if (options['blind'] == false || options['blind'] == 'false')
	{
		post.instance.innerHTML = '<div class="ufo-was-here" style="margin-top:0;margin-bottom:0;">НЛО прилетело и спрятало этот пост. <a href="#stub" onclick="this.parentNode.parentNode.innerHTML=unescape(\'' + escape(post.instance.innerHTML) + '\')">Показать</a>.</div>';
		post.instance.style.opacity = '1.0';
	}
};

var hide = function ()
{
	var posts = getPosts();
	var authors = getAuthorsBlacklist();
	var tags = getTagsBlacklist();
	var blogs = options['rules-blogs'];
	
	for (var i = 0; i < posts.length; i++)
	{
		var post = posts[i];
		
		if (authors.indexOf(post.author) != -1)
			hidePost(post);
		
		for (var k = 0; k < post.tags.length; k++)
		{
			if (tags.indexOf(post.tags[k]) != -1)
			{
				hidePost(post);
				break;
			}
		}
		
		if (blogs.indexOf(post.blog.full) != -1 || blogs.indexOf(post.blog.short) != -1)
			hidePost(post);
	}
};

chrome.extension.sendRequest({method: "getOptions"}, function(response) {
	options = response;
	hide();
});
