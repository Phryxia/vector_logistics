'use strict';

class Config {
	constructor(cfg) {
		cfg = ifndef(cfg, {});
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
		return new Config(this.cfg);
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
		assert(!!tl && tl.length > 0);
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
}

class ConfigController {
	/**
		You MUST assign Config to this object.
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
			if(isNaN(parseFloat(evt.srcElement.value))) {
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
		this.dom.daily_loop.onchange        = this.auto_fix_simple;
		this.dom.open_zero.onchange         = this.auto_fix_simple;
		this.dom.open_level.onchange        = this.auto_fix_simple;
	}

	/**
		Assign current handling config as following
	*/
	assign_config(config) {
		assert(!!config && config.__proto__ == Config.prototype);
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
		this.config.set_daily_loop(this.dom.daily_loop.selected);
		this.config.set_min_level(this.dom.open_zero.selected ? 0 : 1);
		this.config.set_max_level(this.dom.open_level.selectedIndex + 1);

		// timeline table
		let T = [];
		for(let r = 1; r < this.dom.timeline.rows.length; ++r) {
			try {
				T[r - 1] = hhmm_to_integer(this.dom.timeline.rows[r].cells[0].childNodes[0].value);
			} catch(err) {
			}
		}
		this.config.set_timeline(T);
	}

	/**
		Send data to DOM from current handling Config
	*/
	update_dom() {
		assert(!!this.config);
		let cfgctr = this;

		// config table
		Object.keys(cfgctr.dom.ratio).forEach(function(key, idx) {
			cfgctr.dom.ratio[key].value = cfgctr.config.get_ratio(false)[idx];
		});
		this.dom.min_time.value = integer_to_hhmm(this.config.get_min_time());
		this.dom.max_time.value = integer_to_hhmm(this.config.get_max_time());
		this.dom.daily_loop.selected = this.config.get_daily_loop();
		this.dom.open_zero.selected = this.config.get_min_level() == 0;
		this.dom.open_level.selectedIndex = this.config.get_max_level() - 1;

		//timeline table
		// Append row if it is not enough
		let tb = this.dom.timeline;
		let m = 0;
		while(this.config.get_timeline().length > tb.rows.length - 1) {
			this.__tb_addRow(tb);
		}

		// remove rows if it is not necessary
		while(this.config.get_timeline().length < tb.rows.length - 1) {
			this.__tb_delRow(tb);
		}

		// write each cell's contents
		this.config.get_timeline().forEach(function(t, idx) {
			tb.rows[idx + 1].cells[0].childNodes[0].value = integer_to_hhmm(t);
		});
	}

	__tb_index_of(tb, tr_dom) {
		for(let i = 0; i < tb.rows.length; ++i) {
			if(tb.rows[i] === tr_dom) {
				return i;
			}
		}
		return null;
	}

	__tb_addRow(tb, r) {
		r = ifndef(r, -1);
		assert(r >= -1);

		// insert HTMLTableRowElement
		let cfgctr = this;
		let tr = tb.insertRow(r);
		
		// create time input box
		let td = tr.insertCell(-1);
		let input = document.createElement('input');
		input.type = 'text';
		input.defaultValue = '00:00';
		input.size = 14;
		input.onchange = this.auto_fix_time;
		td.appendChild(input);

		// create add button
		td = tr.insertCell(-1);
		input = document.createElement('button');
		input.innerHTML = '+';
		input.style.width = '100%';
		input.onmouseup = function(evt) {
			// if button is clicked, new row is added
			let addr = cfgctr.__tb_index_of(tb, evt.toElement.parentNode.parentNode) + 1;
			cfgctr.__tb_addRow(tb, addr);
			cfgctr.update_config();

			// if new row is added, it automatically select new one.
			tb.rows[addr].cells[0].childNodes[0].select();
		};
		td.appendChild(input);

		// create delete button
		td = tr.insertCell(-1);
		input = document.createElement('button');
		input.innerHTML = '-';
		input.style.width = '100%';
		input.onmouseup = function(evt) {
			let addr = cfgctr.__tb_index_of(tb, evt.toElement.parentNode.parentNode);
			cfgctr.__tb_delRow(tb, addr);
			cfgctr.update_config();
		};
		td.appendChild(input);

		// if there are more than two records in table,
		// first row's delete button must be disabled.
		// therefore we should enable it.
		tb.rows[1].cells[2].childNodes[0].disabled = (tb.rows.length <= 2);
	}

	__tb_delRow(tb, r) {
		r = ifndef(r, -1);
		assert(r >= -1);

		// delete the row
		tb.deleteRow(r);
		
		// if there is only one record, disable delete button
		tb.rows[1].cells[2].childNodes[0].disabled = (tb.rows.length <= 2);
	}

	__intensity_to_float(s) {
		assert(s !== undefined);
		switch(parseInt(s)) {
			case 0: return 0.0;
			case 1: return 100.0;
			case 2: return 500.0;
			case 3: return 1000.0;
			default: throw 'illegal state';
		}
	}
}