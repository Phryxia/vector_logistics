'use strict';
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

Config.CONTRACTION_IGNORE = 0;
Config.CONTRACTION_LOW    = 100;
Config.CONTRACTION_MID    = 250;
Config.CONTRACTION_HIGH   = 1000;

Config.DEFAULT_CONFIG = new Config({
	'timeline': [0],
	'ratio': [1, 1, 1, 0.5, 
		Config.CONTRACTION_IGNORE, 
		Config.CONTRACTION_IGNORE,
		Config.CONTRACTION_IGNORE, 
		Config.CONTRACTION_IGNORE, 
		Config.CONTRACTION_IGNORE],
	'min_time': 0,
	'max_time': 1440,
	'daily_loop': true,
	'min_level': 0,
	'max_level': 11
});

class ConfigController {
	/**
		You MUST assign Config to this object
		before you use this.
	*/
	constructor() {
		// Load DOM
		this.dom = {
			ratio: {
				manpower   : document.getElementById('in-manpower'),
				ammo       : document.getElementById('in-ammo'),
				ration     : document.getElementById('in-ration'),
				parts      : document.getElementById('in-parts'),
				restore    : document.getElementById('in-restore'),
				manufacture: document.getElementById('in-manufacture'),
				doll       : document.getElementById('in-doll'),
				equipment  : document.getElementById('in-equipment'),
				gatcha     : document.getElementById('in-gatcha')
			},
			min_time   : document.getElementById('in-mintime'),
			max_time   : document.getElementById('in-maxtime'),
			daily_loop : document.getElementById('in-loop'),
			open_zero  : document.getElementById('in-zero'),
			open_level : document.getElementById('in-map'),
			timeline   : document.getElementById('tb-timeline')
		};
		this.config = null;

		// Set DOM's callback
		let cfgctr = this;

		// Optimization Ratio
		this.auto_fix_float = function(evt) {
			if(evt.srcElement.pvalue === undefined) {
				evt.srcElement.pvalue = evt.srcElement.defaultValue;
			}
			let new_val = parseFloat(evt.srcElement.value);
			if(isNaN(new_val) || new_val < 0) {
				evt.srcElement.value = evt.srcElement.pvalue;
			}
			evt.srcElement.pvalue = evt.srcElement.value;
			cfgctr.update_config();
		};
		this.dom.ratio.manpower.onchange = this.auto_fix_float;
		this.dom.ratio.ammo.onchange     = this.auto_fix_float;
		this.dom.ratio.ration.onchange   = this.auto_fix_float;
		this.dom.ratio.parts.onchange    = this.auto_fix_float;

		// Minimum time
		this.auto_fix_time = function(evt) {
			let s = evt.srcElement.value;
			if(evt.srcElement.pvalue === undefined) {
				evt.srcElement.pvalue = evt.srcElement.defaultValue;
			}
			if(s.match(/^[0-9]{1,2}$/) != null) {
				// when minute is ommited, add them.
				evt.srcElement.value = s + ':00';
			} else if(!is_valid_hhmm(s)) {
				// when it is invalid value, rollback the value.
				evt.srcElement.value = evt.srcElement.pvalue;
			}
			evt.srcElement.pvalue = evt.srcElement.value;
			cfgctr.update_config();
		};
		this.dom.min_time.onchange = this.auto_fix_time;
		this.dom.max_time.onchange = this.auto_fix_time;

		// Select, Checkbox ... etc.
		this.auto_fix_simple = function(evt) {
			cfgctr.update_config();
		};
		this.dom.ratio.restore.onchange     = this.auto_fix_simple;
		this.dom.ratio.manufacture.onchange = this.auto_fix_simple;
		this.dom.ratio.doll.onchange        = this.auto_fix_simple;
		this.dom.ratio.equipment.onchange   = this.auto_fix_simple;
		this.dom.ratio.gatcha.onchange      = this.auto_fix_simple;
		//this.dom.daily_loop.onchange        = this.auto_fix_simple;
		this.dom.open_zero.onchange         = this.auto_fix_simple;
		this.dom.open_level.onchange        = this.auto_fix_simple;
	}

	/**
		this returns copied version
	*/
	get_current_config() {
		return this.config.copy();
	}

	/**
		Assign current handling config as following
	*/
	assign_config(config) {
		assert(!!config && config instanceof Config);
		this.config = config;
		this.update_dom();
	}

	/**
		Read data from DOM and put it to current handling Config
	*/
	update_config() {
		assert(!!this.config);
		let cfgctr = this;

		// config table
		Object.keys(cfgctr.dom.ratio).forEach(function(key, idx) {
			cfgctr.config.set_ratio(idx, parseFloat(cfgctr.dom.ratio[key].value));
		});
		for(let idx = 4; idx < 9; ++idx) {
			this.config.set_ratio(idx, this.__intensity_to_float(this.config.get_ratio(false)[idx]));
		}
		this.config.set_min_time(hhmm_to_integer(this.dom.min_time.value));
		this.config.set_max_time(hhmm_to_integer(this.dom.max_time.value));
		//this.config.set_daily_loop(this.dom.daily_loop.checked);
		this.config.set_daily_loop(true);
		this.config.set_min_level(this.dom.open_zero.checked ? 0 : 1);
		this.config.set_max_level(this.dom.open_level.selectedIndex + 1);

		// timeline table
		let T = [];
		for(let r = 0; r < this.dom.timeline.rows.length; ++r) {
			T[r] = hhmm_to_integer(this.__tb_dom(r, 0).childNodes[0].value);
		}
		this.config.set_timeline(T);
		//this.update_dom();
	}

	/**
		Send data to DOM from current handling Config
	*/
	update_dom() {
		assert(!!this.config);
		let cfgctr = this;

		// config table
		Object.keys(cfgctr.dom.ratio).forEach(function(key, idx) {
			if(idx >= 4)
				cfgctr.dom.ratio[key].value = cfgctr.__float_to_intensity(cfgctr.config.get_ratio(false)[idx]);
			else
				cfgctr.dom.ratio[key].value = cfgctr.config.get_ratio(false)[idx];
		});
		this.dom.min_time.value = integer_to_hhmm(this.config.get_min_time());
		this.dom.max_time.value = integer_to_hhmm(this.config.get_max_time());
		//this.dom.daily_loop.checked = this.config.get_daily_loop();
		this.dom.open_zero.checked = (this.config.get_min_level() == 0);
		this.dom.open_level.selectedIndex = this.config.get_max_level() - 1;

		//timeline table
		// Append row if it is not enough
		let m = 0;
		while(this.config.get_timeline().length > this.dom.timeline.rows.length) {
			this.__tb_addRow();
		}

		// remove rows if it is not necessary
		while(this.config.get_timeline().length < this.dom.timeline.rows.length) {
			this.__tb_delRow();
		}

		// write each cell's contents
		this.config.get_timeline().forEach(function(t, idx) {
			cfgctr.__tb_dom(idx, 0).childNodes[0].value = integer_to_hhmm(t);
		});
	}

	__tb_dom(r, c) {
		assert(r >= 0);
		if(c === undefined)
			return this.dom.timeline.rows[r];
		else {
			assert(c >= 0);
			return this.dom.timeline.rows[r].cells[c];
		}
	}

	__tb_index_of(tr_dom) {
		assert(!!tr_dom);
		for(let i = 0; i < this.dom.timeline.rows.length; ++i)
			if(this.__tb_dom(i) === tr_dom)
				return i;
		return null;
	}

	__tb_addRow(r) {
		r = ifndef(r, -1);
		assert(r >= -1);

		// insert HTMLTableRowElement
		let cfgctr = this;
		let tr = this.dom.timeline.insertRow(r);
		tr.style.width = '100%';
		
		
		let td = tr.insertCell(-1);
		td.style.display = 'flex';
		td.style.width = '100%';
		//td.style.height = '100%';
		td.style.height = '25px';

		// time input
		let input = document.createElement('input');
		input.className = 'time_input';
		input.style.marginLeft = '5px';
		input.style.marginRight = '5px';
		input.style.height = '100%';
		input.type = 'text';
		input.defaultValue = '00:00';
		input.onchange = this.auto_fix_time;
		new Picker(input, {
			format: 'HH:mm',
			headers: true,
			text: {
				title: '군수 받을 시각을 입력하세요'
			}
		});
		td.appendChild(input);

		// create add button
		input = document.createElement('button');
		input.className = 'cfg_elem_sub';
		input.style.width = '50px';
		input.innerHTML = '추가';
		input.onmouseup = function(evt) {
			// if button is clicked, new row is added
			let addr = cfgctr.__tb_index_of(evt.toElement.parentNode.parentNode) + 1;
			cfgctr.__tb_addRow(addr);
			cfgctr.update_config();

			// if new row is added, it automatically select new one.
			cfgctr.__tb_dom(addr, 0).childNodes[0].select();
		};
		td.appendChild(input);

		// create delete button
		input = document.createElement('button');
		input.className = 'cfg_elem_sub';
		input.style.width = '50px';
		input.innerHTML = '삭제';
		input.onmouseup = function(evt) {
			let addr = cfgctr.__tb_index_of(evt.toElement.parentNode.parentNode);
			cfgctr.__tb_delRow(addr);
			cfgctr.update_config();
		};
		td.appendChild(input);

		// if there are more than two records in table,
		// first row's delete button must be disabled.
		// therefore we should enable it.
		this.__tb_dom(0, 0).childNodes[2].disabled = (this.dom.timeline.rows.length <= 1);
	}

	__tb_delRow(r) {
		r = ifndef(r, -1);
		assert(r >= -1);

		// delete the row
		this.dom.timeline.deleteRow(r);
		
		// if there is only one record, disable delete button
		this.__tb_dom(0, 0).childNodes[2].disabled = (this.dom.timeline.rows.length <= 1);
	}

	__intensity_to_float(s) {
		assert(s !== undefined);
		switch(parseInt(s)) {
			case 0: return Config.CONTRACTION_IGNORE;
			case 1: return Config.CONTRACTION_LOW;
			case 2: return Config.CONTRACTION_MID;
			case 3: return Config.CONTRACTION_HIGH;
			default: throw 'illegal state';
		}
	}

	__float_to_intensity(x) {
		assert(x >= 0);
		if(x <= Config.CONTRACTION_IGNORE)
			return 0;
		else if(x <= Config.CONTRACTION_LOW)
			return 1;
		else if(x <= Config.CONTRACTION_MID)
			return 2;
		else if(x <= Config.CONTRACTION_HIGH)
			return 3;
		else
			throw 'illegal parameter ' + x;
	}
}