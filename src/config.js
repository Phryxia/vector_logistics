'use strict'

/**
 * Config는 원하는 군수세팅을 추상화한 클래스이다.
 */
class Config {
	constructor(cfg) {
		console.assert(cfg);

		// 군수를 받을 시각을 분(min)으로 나타낸 정수의 배열
		this.timeline   = ifndef(cfg.timeline, [0]).slice();

		// [인, 탄, 식, 부, 쾌속수복, 쾌속제조, 인형제조, 장비제조, 구매토큰]의 가중치
		this.ratio      = ifndef(cfg.ratio, [1, 1, 1, 0.5, 0, 0, 0, 0, 0]).slice();

		// 군수를 받는 간격의 최소 시간. 단위는 분(min)
		this.min_time   = ifndef(cfg.min_time, 0);

		// 군수를 받는 간격의 최대 시간. 단위는 분(min)
		this.max_time   = ifndef(cfg.max_time, 1439);

		// 군수를 매일 받는다고 가정하는지 여부. 2021년 기준으로 true로 고정
		this.daily_loop = ifndef(cfg.daily_loop, true);

		// 군수 작전 지역의 최솟값. 0지 개방시 0, 그렇지 않으면 1.
		this.min_level  = ifndef(cfg.min_level, 0);

		// 군수 작전 지역의 최댓값.
		this.max_level  = cfg.max_level;
	}

	/**
	 * 이 Config의 사본을 반환한다.
	 */
	copy() {
		return new Config(this);
	}

	/**
	 * 이 Config의 timeline을 반환하며, 반환 값의 수정이 원본에 반영된다.
	 */
	get_timeline() {
		return this.timeline;
	}

	/**
		timeline을 tl로 설정한다. 이때 인자가 복제되어 설정된다.
	*/
	set_timeline(tl) {
		console.assert(tl && tl.length > 0);
		this.timeline = tl.slice();
	}

	/**
		이 config의 자원 최적화 비율 벡터를 반환한다.
		do_normalize가 true이면 인탄식부 비율이 [0, 1] 사이가 되도록 정규화한다.
		만약 비율이 [0, 0, 0, 0]이면 do_normalize를 무시한다.
	*/
	get_ratio(do_normalize) {
		let denom = 1;
		if (do_normalize) {
			denom = this.ratio[0] + this.ratio[1] 
				+ this.ratio[2] + this.ratio[3];
			denom = denom > 0 ? denom : 1;
		}
		let out = this.ratio.slice();
		out[0] /= denom;
		out[1] /= denom;
		out[2] /= denom;
		out[3] /= denom;
		return out;
	}

	/**
	 * 자원 최적화 비율에서 idx번째 값을 value로 바꾼다.
	 * 
	 * @param {*} idx 음이 아닌 정수
	 * @param {*} value 음이 아닌 실수
	 */
	set_ratio(idx, value) {
		console.assert(0 <= idx && idx < this.ratio.length);
		console.assert(0 <= value);
		this.ratio[idx] = value;
	}

	/**
	 * 군수를 받는 간격의 최소 시간을 반환한다.
	 * 단위는 분(min)이다.
	 */
	get_min_time() {
		return this.min_time;
	}

	/**
	 * 군수를 받는 간격의 최소 시간을 설정한다.
	 * 단위는 분(min)이다.
	 * @param {number} t 
	 */
	set_min_time(t) {
		console.assert(0 <= t && t <= 1440);
		this.min_time = t;
	}

	/**
	 * 군수를 받는 간격의 최대 시간을 반환한다.
	 * 단위는 분(min)이다.
	 */
	get_max_time() {
		return this.max_time;
	}

	/**
	 * 군수를 받는 간격의 최대 시간을 설정한다.
	 * 단위는 분(min)이다.
	 * @param {number} t 
	 */
	set_max_time(t) {
		console.assert(0 <= t && t <= 1440);
		this.max_time = t;
	}

	/**
	 * 매일 반복 여부를 반환한다.
	 */
	get_daily_loop() {
		return this.daily_loop;
	}

	/**
	 * 매일 반복 여부를 설정한다.
	 * @param {boolean}} tf 
	 */
	set_daily_loop(tf) {
		this.daily_loop = tf;
	}

	/**
	 * 최소 작전 지역의 번호를 반환한다.
	 */
	get_min_level() {
		return this.min_level;
	}

	/**
	 * 최소 작전 지역의 번호를 설정한다.
	 * 만약 최대 작전 지역의 번호보다 클 경우, 최대 작전 지역 번호로 설정한다.
	 * @param {number}} lv 
	 */
	set_min_level(lv) {
		console.assert(0 <= lv);
		this.min_level = Math.min(lv, this.max_level);
	}

	/**
	 * 최대 작전 지역의 번호를 반환한다.
	 */
	get_max_level() {
		return this.max_level;
	}

	/**
	 * 최대 작전 지역의 번호를 설정한다.
	 * 만약 최소 작전 지역의 번호보다 작을 경우, 최소 작전 지역 번호로 설정한다.
	 * @param {number} lv 
	 */
	set_max_level(lv) {
		console.assert(0 <= lv);
		this.max_level = Math.max(lv, this.min_level);
	}

	/**
		WARNING
		any modification (except addition) may cause
		serious side effect to users.

		THINK ONE MORE TIME before you change the sturcture.
	*/
	/**
		Return the object representation of this preset.
	*/
	toJSON() {
		return {
			timeline 	: this.timeline,
			ratio 		: this.ratio,
			min_time 	: this.min_time,
			max_time 	: this.max_time,
			daily_loop 	: this.daily_loop,
			min_level 	: this.min_level,
			max_level 	: this.max_level
		};
	}
}

/**
 * Config를 설정할 수 있는 컨트롤러로 뷰와 연결돼 있다.
 */
class ConfigController {
	constructor() {
		// 0: 간편모드, 1: 고급모드
		this.mode = 0;

		// 간편모드 뷰, 고급 모드 뷰
		this.vms = [new VMEasy(), new VMAdvanced()];

		// 간편모드 HTMLElement, 고급모드 HTMLElement
		this.div = [document.getElementById('easy_config'),
			document.getElementById('advanced_config')];
		
		// 간편모드 버튼, 고급 모드 버튼
		this.btn = [document.getElementById('mode-sel-0'),
			document.getElementById('mode-sel-1')];

		// 간편모드 버튼을 클릭하면 간편모드로 변환한다.
		this.btn[0].onclick = (evt) => {
			this.set_mode(0);
		};

		// 고급모드 버튼을 클릭하면 고급모드로 변환한다.
		this.btn[1].onclick = (evt) => {
			this.set_mode(1);
		};
	}

	/**
	 * 현재 편집 중인 Config를 cfg로 덮어씌운다.
	 * @param {Config} cfg 
	 */
	update(cfg) {
		return this.vms[this.mode].update(cfg);
	}

	/**
	 * 뷰에서 편집 중인 Config를 해석하여 반환한다.
	 */
	fetch() {
		return this.vms[this.mode].fetch();
	}

	/**
	 * 간편모드 설정은 mode = 0, 고급모드 설정은 mode = 1
	 * 고급모드 -> 간편모드로 변환되는 경우 Config의 일부 변수가 변경될 수 있다.
	 * @param {number} mode
	 * @param {boolean} no_alert 프리셋을 선택해서 모드가 1->0으로 바뀌는 경우엔 경고를 출력하지 말아야함. no_alert = true면 경고를 출력하지 않음.
	 */
	set_mode(mode, no_alert) {
		if(mode == null)
			mode = 0;

		// 간편모드 -> 고급모드로 갈때는 데이터가 보존된다.
		// 그러나 고급모드 -> 간편모드로 갈 경우, 고급모드로
		// 다시 돌아올 때 일부 데이터가 망가지므로 경고한다.
		if(!no_alert && this.mode == 1 && mode == 0)
			if(!window.confirm(LanguageManager.instance.get_word(43)))
				return;

		// dom 적용
		// TODO: 뷰로 옮길 수 없을까?
		this.div[mode].style.display = 'block';
		this.div[1 - mode].style.display = 'none';
		this.vms[mode].update(this.vms[1 - mode].fetch());

		this.mode = mode;
	}
}