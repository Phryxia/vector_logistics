'use strict';

/**
	CookieManager capsulate data IO between
	application and cookie.
*/
class CookieManager {
	load_snapshot(prsctr) {
		assert(!!prsctr && prsctr.__proto__ == PresetController.prototype);
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
		assert(!!prsctr && prsctr.__proto__ == PresetController.prototype);
		this.__save_cookie(JSON.stringify({
			presets: prsctr.presets,
			selected_index: prsctr.selected_index
		}));
	}

	__save_cookie(str) {
		if(window.location.origin.match(/^file:/) != null)
			window.localStorage.setItem('cookie', str);
		else
			document.cookie = str;
	}

	__load_cookie() {
		if(window.location.origin.match(/^file:/) != null)
			return window.localStorage.getItem('cookie');
		else
			return document.cookie;
	}
}