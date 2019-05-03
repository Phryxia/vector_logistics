'use strict';

(function() {
	// Initialize 
	document.cookie_mng = new CookieManager();
	let config_ctr = new ConfigController();
	let preset_ctr = new PresetController(config_ctr, document.cookie_mng);
	let algorithm_ctr = new AlgorithmController(config_ctr, new Algorithm());

	document.cookie_mng.load_snapshot(preset_ctr);
})();