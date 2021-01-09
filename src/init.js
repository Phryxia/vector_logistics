'use strict';

Config.DEFAULT_CONFIG = new Config({
	'timeline': [0],
	'ratio': [1, 1, 1, 0.5, 
		Algorithm.CONTRACTION_IGNORE, 
		Algorithm.CONTRACTION_IGNORE,
		Algorithm.CONTRACTION_IGNORE, 
		Algorithm.CONTRACTION_IGNORE, 
		Algorithm.CONTRACTION_IGNORE],
	'min_time': 0,
	'max_time': 1440,
	'daily_loop': true,
	'min_level': 0,
	'max_level': 11
});

LanguageManager.instance = new LanguageManager(() => {
	// 언어 모듈이 완전히 로드된 이후에 초기화를 실행한다.
	document.cookie_mng = new CookieManager();
	
	let cfgctr = new ConfigController();
	
	let preset_ctr = new PresetController(cfgctr, document.cookie_mng);
	
	let algorithm_ctr = new AlgorithmController(cfgctr, new Algorithm());

	// 저장된 설정 불러오기
	document.cookie_mng.load_snapshot(cfgctr, preset_ctr);
});