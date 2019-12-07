'use strict'

class Config {
	constructor(cfg) {
		assert(!!cfg);
		this.timeline   = ifndef(cfg.timeline, [0]).slice();
		this.ratio      = ifndef(cfg.ratio, [1, 1, 1, 0.5, 0, 0, 0, 0, 0]).slice();
		this.min_time   = ifndef(cfg.min_time, 0);
		this.max_time   = ifndef(cfg.max_time, 1440);
		this.daily_loop = ifndef(cfg.daily_loop, true);
		this.min_level  = ifndef(cfg.min_level, 0);
		this.max_level  = ifndef(cfg.max_level, 11);
	}

	/**
		Return the copy of this Config
	*/
	copy() {
		return new Config(this);
	}

	/**
		This always return the original.
	*/
	get_timeline() {
		return this.timeline;
	}

	/**
		This always copy the original.
	*/
	set_timeline(tl) {
		assert(!!tl);
		assert(tl.length > 0);
		this.timeline = tl.slice();
	}

	/**
		This always copy the original.
		If do_normalize == true, first four element
		is divided by their sum. If their sum is zero
		nothing will be happend.
	*/
	get_ratio(do_normalize) {
		let denom = 1;
		if(!!do_normalize) {
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

	set_ratio(idx, value) {
		assert(0 <= idx && idx < this.ratio.length);
		assert(0 <= value);
		this.ratio[idx] = value;
	}

	get_min_time() {
		return this.min_time;
	}

	set_min_time(t) {
		assert(0 <= t && t <= 1440);
		this.min_time = t;
	}

	get_max_time() {
		return this.max_time;
	}

	set_max_time(t) {
		assert(0 <= t && t <= 1440);
		this.max_time = t;
	}

	get_daily_loop() {
		return this.daily_loop;
	}

	set_daily_loop(tf) {
		this.daily_loop = tf;
	}

	get_min_level() {
		return this.min_level;
	}

	set_min_level(lv) {
		assert(0 <= lv && lv <= 11);
		this.min_level = Math.min(lv, this.max_level);
	}

	get_max_level() {
		return this.max_level;
	}

	set_max_level(lv) {
		assert(0 <= lv && lv <= 11);
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

class ConfigController {
	/**
		You MUST assign Config to this object
		before you use this.
	*/
	constructor() {
		this.mode = 0;
		this.vms = [new VMEasy(), new VMAdvanced()];
		this.div = [document.getElementById('easy_config'),
			document.getElementById('advanced_config')];
		this.btn = [document.getElementById('mode-sel-0'),
			document.getElementById('mode-sel-1')];
		this.btn[0].onclick = (evt) => {
			this.set_mode(0);
		};
		this.btn[1].onclick = (evt) => {
			this.set_mode(1);
		};
	}

	update(cfg) {
		return this.vms[this.mode].update(cfg);
	}

	fetch() {
		return this.vms[this.mode].fetch();
	}

	set_mode(mode) {
		if(mode == null)
			mode = 0;

		// 간편모드 -> 고급모드로 갈때는 데이터가 보존된다.
		// 그러나 고급모드 -> 간편모드로 갈 경우, 고급모드로
		// 다시 돌아올 때 일부 데이터가 망가지므로 경고한다.
		if(this.mode == 1 && mode == 0)
			if(!window.confirm(get_word(43)))
				return;

		// dom 적용
		this.div[mode].style.display = 'block';
		this.div[1 - mode].style.display = 'none';
		// this.btn[mode].style.color = '#000000';
		// this.btn[1 - mode].style.color = '#DDDDDD';
		this.vms[mode].update(this.vms[1 - mode].fetch());

		// LocalDB에 저장하기
		this.mode = mode;
		localforage.setItem('mode', mode)
		.then(val => {
		})
		.catch(err => {
			console.log(err);
		});
	}
}