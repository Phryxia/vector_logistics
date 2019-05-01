'use strict';

(function() {
	// Initialize Result Table
	// let tr, td;
	// let table = document.getElementById('tb-result');
	// for(let n = 0; n < 8; ++n) {
	// 	tr = table.insertRow(-1);
	// 	for(let i = 0; i < table.rows[0].cells.length; ++i) {
	// 		td = tr.insertCell(-1);

	// 		if(0 <= i && i <= 2)
	// 			td.align = 'center';
	// 	}
	// }

	// Initialize 
	let cookie_mng = new CookieManager();
	let config_ctr = new ConfigController();
	let preset_ctr = new PresetController(config_ctr, cookie_mng);
	let algorithm_ctr = new AlgorithmController(config_ctr, new Algorithm());

	cookie_mng.load_snapshot(preset_ctr);
})();