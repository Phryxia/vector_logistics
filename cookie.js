'use strict';

/**
	CookieManager capsulate data IO between
	application and cookie.
*/
class CookieManager {
	load_snapshot(prsctr) {
		assert(!!prsctr && prsctr instanceof PresetController);
		let success = true;
		let obj = null;
		// load JSON object
		try {
			obj = JSON.parse(this.__load_cookie());
		}
		catch(e) {
			console.log(e);
		}

		if(obj !== null) {
			// morph generic Object into valid Config and Preset
			for(let i = 0; i < obj.presets.length; ++i)
				obj.presets[i] = new Preset(obj.presets[i].name, new Config(obj.presets[i].config));
			
			// apply to PresetController
			prsctr.override_presets(obj.presets, obj.selected_index);
		} else {
			// just use default preset.
			prsctr.set_current(0);
		}
	}

	save_snapshot(prsctr) {
		assert(!!prsctr && prsctr instanceof PresetController);
		this.__save_cookie(JSON.stringify({
			presets: prsctr.presets,
			selected_index: prsctr.selected_index
		}));
	}

	is_local() {
		return window.location.origin.match(/^file:/) != null;
	}

	__save_cookie(pure_json_str) {
		// append expiration date
		let str = '';
		let expire_date = new Date();
		expire_date.setTime(expire_date.getTime() + 3600 * 24 * 365);
		str += 'content=' + pure_json_str + ';';
		str += 'domain=krissvector.moe;';
		str += 'expires=' + expire_date.toGMTString() + ';';

		// escape
		str = encodeURIComponent(str);

		// set cookie
		if(window.location.origin.match(/^file:/) != null)
			window.localStorage.setItem('cookie', str);
		else
			document.cookie = str;
	}

	__load_cookie() {
		// load cookie
		let raw_str;
		if(window.location.origin.match(/^file:/) != null)
			raw_str = window.localStorage.getItem('cookie');
		else
			raw_str = document.cookie;

		// unescape
		raw_str = decodeURIComponent(raw_str);

		// parse
		let pairs = raw_str.split(';');
		if(pairs[0].indexOf('=') == -1)
			return "";
		else
			return pairs[0].substr(pairs[0].indexOf('=') + 1);
	}
}