'use strict';

(function() {
	// Initialize Result Table
	let tr, td;
	let table = document.getElementById('tb-result');
	for(let n = 0; n < 9; ++n) {
		tr = table.insertRow(-1);
		for(let i = 0; i < table.rows[0].cells.length; ++i) {
			tr.insertCell(-1);
		}
	}

	// Load cookie
	/*
	let json_string;
	let cookie = null;
	if(window.location.origin.match(/^file:/) != null) {
		json_string = window.localStorage.getItem('cookie');
	} else {
		json_string = document.cookie;
	}
	try {
		cookie = JSON.parse(json_string);
	}
	catch(err) {
	}*/

	// Initialize 
	let cookie_mng = new CookieManager();
	let config_ctr = new ConfigController();
	let preset_ctr = new PresetController(config_ctr, cookie_mng);
	let algorithm_ctr = new AlgorithmController(config_ctr, new Algorithm());

	// Default setting
	/*
	if(cookie == null) {
		preset_ctr.add_preset(new Preset('직장인', new Config({
			'timeline': [7 * 60, 12 * 60, 18 * 60, 21 * 60, 23 * 60],
			'ratio': [1, 1, 1, 0.5, 0, 0, 0, 0, 0],
			'min_time': 0,
			'max_time': 1440,
			'daily_loop': true,
			'min_level': 0,
			'max_level': 11
		})));
	}*/
	//preset_ctr.set_current(0);
	//config_ctr.update_dom();

	cookie_mng.load_snapshot(preset_ctr);
})();