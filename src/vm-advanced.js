import { Util } from './util.js';
import { Config } from './config.js';
import { LanguageManager } from './lang.js';
import { Algorithm } from './kriss_vector.js';

// VMAdvanced는 고급설정 UI를 담당하는 뷰입니다.
// VMAdvanced는 Config로 통신하며 다른 클래스에 종속되지 않습니다.
// TODO: 함수이름 다 고쳤으면;;
export class VMAdvanced {
	// ConfigController cfgctr
	constructor() {
		// Load DOM
		this.ratio = [
			document.getElementById('in-manpower'),
			document.getElementById('in-ammo'),
			document.getElementById('in-ration'),
			document.getElementById('in-parts'),
			document.getElementById('in-restore'),
			document.getElementById('in-manufacture'),
			document.getElementById('in-doll'),
			document.getElementById('in-equipment'),
			document.getElementById('in-gatcha')
		];
		this.min_time   = document.getElementById('in-mintime');
		this.max_time   = document.getElementById('in-maxtime');
		this.open_zero  = document.getElementById('in-zero');
		this.open_level = document.getElementById('in-map');
		this.timeline   = document.getElementById('tb-timeline');

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
		};
		for(let i = 0; i < 4; ++i)
			this.ratio[i].onchange = this.auto_fix_float;

		// Minimum time
		this.auto_fix_time = function(evt) {
			let s = evt.srcElement.value;
			if(evt.srcElement.pvalue === undefined) {
				evt.srcElement.pvalue = evt.srcElement.defaultValue;
			}
			if(s.match(/^[0-9]{1,2}$/) != null) {
				// when minute is ommited, add them.
				evt.srcElement.value = s + ':00';
			} else if(!Util.is_valid_hhmm(s)) {
				// when it is invalid value, rollback the value.
				evt.srcElement.value = evt.srcElement.pvalue;
			}
			evt.srcElement.pvalue = evt.srcElement.value;
		};
		//this.min_time.onchange = this.auto_fix_time;
		//this.max_time.onchange = this.auto_fix_time;

		// 최소주기 입력기
		new Picker(this.min_time, {
			format: 'HH:mm',
			headers: true,
			text: { title: '' }
		});

		// 최대주기 입력기
		new Picker(this.max_time, {
			format: 'HH:mm',
			headers: true,
			text: { title: '' }
		});

		// Repeat-adding
		document.getElementById('bt-repeat-add').onclick = (evt) => {
			// ask user when to start repeat
			let stime = Util.ask_via_prompt(Util.is_valid_hhmm, 
				LanguageManager.instance.get_word(17),
				LanguageManager.instance.get_word(18), '00:00');
			if(stime == null)
				return;
			stime = Util.hhmm_to_integer(stime);

			let itime = Util.ask_via_prompt(Util.is_valid_hhmm, 
				LanguageManager.instance.get_word(19),
				LanguageManager.instance.get_word(20), '1:00');
			if(itime == null)
				return;
			itime = Util.hhmm_to_integer(itime);

			let etime = Util.ask_via_prompt(tstr => {
					return Util.is_valid_hhmm(tstr) 
						&& Util.hhmm_to_integer(tstr) >= stime;
				}, 
				LanguageManager.instance.get_word(21),
				LanguageManager.instance.get_word(18), '12:00');
			if(etime == null)
				return;
			etime = Util.hhmm_to_integer(etime);

			// This code is based on __tb_addRow's 추가 button's callback
			// I don't have idea to clean up these into a new function right now
			// if button is clicked, new row is added
			while(stime <= etime && stime < 1440) {
				this.__tb_addRow(-1).cells[0].childNodes[0].value = Util.integer_to_hhmm(stime);
				stime += itime;
			}
		};
	}

	init(max_level) {
		for (let lv = 1; lv <= max_level; ++lv) {
			const option = document.createElement('option');
			option.value = `${lv}`;
			option.innerText = `${lv}`;
	
			if (lv == max_level)
				option.selected = true;
	
			this.open_level.appendChild(option);
		}
	}

	/**
	 * cfg를 UI에 적용시킨다.
	 * @param {Config} cfg 
	 */
	update(cfg) {
		// config table
		for(let idx = 0; idx < 4; ++idx)
			this.ratio[idx].value = cfg.ratio[idx];
		for(let idx = 4; idx < 9; ++idx)
			this.ratio[idx].value = this.__float_to_intensity(cfg.ratio[idx]);
		this.min_time.value = Util.integer_to_hhmm(cfg.min_time);
		this.max_time.value = Util.integer_to_hhmm(cfg.max_time);
		this.open_zero.checked = (cfg.min_level == 0);
		this.open_level.selectedIndex = cfg.max_level - 1;

		//timeline table
		// Append row if it is not enough
		let m = 0;
		while(cfg.timeline.length > this.timeline.rows.length) {
			this.__tb_addRow();
		}

		// remove rows if it is not necessary
		while(cfg.timeline.length < this.timeline.rows.length) {
			this.__tb_delRow();
		}

		// write each cell's contents
		cfg.timeline.forEach((t, idx) => {
			this.__tb_dom(idx, 0).childNodes[0].value = Util.integer_to_hhmm(t);
		});
	}

	// UI 정보를 읽어서 Config로 반환한다.
	fetch() {
		let precfg = {
			ratio: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			daily_loop: true
		};

		// config table
		for(let idx = 0; idx < 4; ++idx)
			precfg.ratio[idx] = parseFloat(this.ratio[idx].value);
		for(let idx = 4; idx < 9; ++idx) {
			precfg.ratio[idx] = this.__intensity_to_float(this.ratio[idx].value);
		}
		precfg.min_time = Util.hhmm_to_integer(this.min_time.value);
		precfg.max_time = Util.hhmm_to_integer(this.max_time.value);
		precfg.min_level = (this.open_zero.checked ? 0 : 1);
		precfg.max_level = (this.open_level.selectedIndex + 1);

		// timeline table
		precfg.timeline = [];
		for(let r = 0; r < this.timeline.rows.length; ++r) {
			precfg.timeline[r] = Util.hhmm_to_integer(this.__tb_dom(r, 0).childNodes[0].value);
		}

		return new Config(precfg);
	}

	__tb_dom(r, c) {
		console.assert(r >= 0);
		if(c === undefined)
			return this.timeline.rows[r];
		else {
			console.assert(c >= 0);
			return this.timeline.rows[r].cells[c];
		}
	}

	__tb_index_of(tr_dom) {
		console.assert(tr_dom);
		for(let i = 0; i < this.timeline.rows.length; ++i)
			if(this.__tb_dom(i) === tr_dom)
				return i;
		return null;
	}

	/**
		return added <tr> element
	*/
	__tb_addRow(r) {
		r = Util.ifndef(r, -1);
		console.assert(r >= -1);

		// insert HTMLTableRowElement
		let tr = this.timeline.insertRow(r);
		tr.style.width = '100%';
		
		
		let td = tr.insertCell(-1);
		td.style.display = 'flex';
		td.style.width = '100%';
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
				title: ''
			}
		});
		td.appendChild(input);

		// create add button
		input = document.createElement('button');
		input.setAttribute('data-lang', 'lang-12');
		input.className = 'cfg_elem_sub stdButton';
		input.style.width = '50px';
		input.innerHTML = LanguageManager.instance.get_word(12);
		input.onmouseup = (evt) => {
			// if button is clicked, new row is added
			let addr = this.__tb_index_of(evt.toElement.parentNode.parentNode) + 1;
			this.__tb_addRow(addr);

			// if new row is added, it automatically select new one.
			this.__tb_dom(addr, 0).childNodes[0].select();
		};
		td.appendChild(input);

		// create delete button
		input = document.createElement('button');
		input.setAttribute('data-lang', 'lang-13');
		input.className = 'cfg_elem_sub stdButton';
		input.style.width = '50px';
		input.innerHTML = LanguageManager.instance.get_word(13);
		input.onmouseup = (evt) => {
			let addr = this.__tb_index_of(evt.toElement.parentNode.parentNode);
			this.__tb_delRow(addr);
		};
		td.appendChild(input);

		// if there are more than two records in table,
		// first row's delete button must be disabled.
		// therefore we should enable it.
		this.__tb_dom(0, 0).childNodes[2].disabled = (this.timeline.rows.length <= 1);
		return tr;
	}

	__tb_delRow(r) {
		r = Util.ifndef(r, -1);
		console.assert(r >= -1);

		// delete the row
		this.timeline.deleteRow(r);
		
		// if there is only one record, disable delete button
		this.__tb_dom(0, 0).childNodes[2].disabled = (this.timeline.rows.length <= 1);
	}

	__intensity_to_float(s) {
		console.assert(s !== undefined);
		switch(parseInt(s)) {
			case 0: return Algorithm.CONTRACTION_IGNORE;
			case 1: return Algorithm.CONTRACTION_LOW;
			case 2: return Algorithm.CONTRACTION_MID;
			case 3: return Algorithm.CONTRACTION_HIGH;
			default: throw 'illegal state';
		}
	}

	__float_to_intensity(x) {
		console.assert(x >= 0);
		if(x <= Algorithm.CONTRACTION_IGNORE)
			return 0;
		else if(x <= Algorithm.CONTRACTION_LOW)
			return 1;
		else if(x <= Algorithm.CONTRACTION_MID)
			return 2;
		else if(x <= Algorithm.CONTRACTION_HIGH)
			return 3;
		else
			throw 'illegal parameter ' + x;
	}
}