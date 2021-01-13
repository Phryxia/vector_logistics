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
	
	let algorithm = new Algorithm((algorithm) => {
		// 군수작전을 모두 로드한 이후에 거쳐야 할 일들
		const lv_selector_easy_dom = document.getElementById('in-map-easy');
		const lv_selector_advanced_dom = document.getElementById('in-map');
		
		// 최대 군수작전이 몇 지역인지 계산
		let max_lv = 0;
		for (let op of algorithm.V) {
			const op_lv = parseInt(op[0].split('-')[0]);
			max_lv = Math.max(max_lv, op_lv);
		}

		// 최대 군수작전의 레벨만큼 option을 만듦
		for (let lv = 1; lv <= max_lv; ++lv) {
			const option = document.createElement('option');
			option.value = `${lv}`;
			option.innerText = `${lv}`;

			const option2 = document.createElement('option');
			option2.value = `${lv}`;
			option2.innerText = `${lv}`;

			if (lv == max_lv) {
				option.selected = true;
				option2.selected = true;
			}

			lv_selector_easy_dom.appendChild(option);
			lv_selector_advanced_dom.appendChild(option2);
		}
	});

	let algorithm_ctr = new AlgorithmController(cfgctr, algorithm);

	// 저장된 설정 불러오기
	document.cookie_mng.load_snapshot(cfgctr, preset_ctr);
});