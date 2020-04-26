
 var obj = (function(){
	if (!chrome.cookies) {
	  chrome.cookies = chrome.experimental.cookies;
	}
	
	function parseDomainFromUrl (url) {
		var idxDoubleSlash = url.indexOf('//')
		if (idxDoubleSlash < 0){
			console.log('error parsing domain from current url: ' + url)
			return
		}
		var idxDomainStarts = idxDoubleSlash + 2
		if (idxDomainStarts >= url.length){
			console.log('error parsing domain from current url: ' + url)
			return
		}
		var urlAfterDoubleSlash = url.substring(idxDomainStarts)
		var idxEndDomain = urlAfterDoubleSlash.indexOf('/')
		var domainName = ''
		if (idxEndDomain < 0){
			domainName = urlAfterDoubleSlash
		}else{
			domainName = urlAfterDoubleSlash.slice(0, idxEndDomain)
		}
		if (domainName.indexOf('.') != domainName.lastIndexOf('.')){
			domainName = domainName.slice(domainName.indexOf('.'))
		}
		return domainName
	}
	
	function getCookieUrl(cookie) {
		return "http" 
			+ (cookie.secure ? "s" : "") 
			+ "://" 
			+ cookie.domain 
			+ cookie.path;
	}
	
	function removeCookie(cookie) {
		chrome.cookies.remove({"url": getCookieUrl(cookie), "name": cookie.name});
	}
	
	function removeCookiesForTab(tab){
		var domainName = parseDomainFromUrl(tab.url)
		console.log('parsed domain name: ' + domainName)
		chrome.cookies.getAll({}, function(cookies) {
			cookies.filter(each => each.domain.endsWith(domainName)).forEach (function(cookie){
				removeCookie(cookie)
			})
		})
		chrome.tabs.reload(tab.id)
	}

	var returnObj = {
		removeCookiesForCurrentDomain: removeCookiesForTab
	}

	return returnObj;
})();
 
chrome.browserAction.onClicked.addListener(function(tab) {
	obj.removeCookiesForCurrentDomain(tab)
});
