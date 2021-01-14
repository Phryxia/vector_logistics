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

LanguageManager.instance = new LanguageManager();
CookieManager.instance = new CookieManager();

const jsondc = new JSONDC();
const algorithm = new Algorithm();

const cfgctr = new ConfigController();

// 군수작전 데이터를 불러오고 난 뒤 행동
jsondc.load_json('/src/operations.json')
.then((operations) => {
	algorithm.init(operations.data);

	// 군수작전을 모두 로드한 이후에 거쳐야 할 일들
	const lv_selector_easy_dom = document.getElementById('in-map-easy');
	const lv_selector_advanced_dom = document.getElementById('in-map');
	
	// 최대 군수작전이 몇 지역인지 계산
	let max_lv = 0;
	for (let op of algorithm.V) {
		const op_lv = parseInt(op[0].split('-')[0]);
		max_lv = Math.max(max_lv, op_lv);
	}

	cfgctr.vms[0].init(max_lv);
	cfgctr.vms[1].init(max_lv);
});

// 언어 데이터를 불러오고 난 뒤 행동
jsondc.load_json('/src/localization.json')
.then((words) => {
	LanguageManager.instance.init(words);

	const preset_ctr = new PresetController(cfgctr, CookieManager.instance);
	
	const algorithm_ctr = new AlgorithmController(cfgctr, algorithm);

	// 저장된 설정 불러오기
	CookieManager.instance.load_snapshot(cfgctr, preset_ctr);
});