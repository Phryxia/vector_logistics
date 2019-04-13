'use strict'

/**
	Apply special ability to given input_dom:
	- If input_dom has hh or h, it is automatically
	  transform into hh:00
	- If input_dom has invalid hh:mm value,
	  backup value will be applied.
*/
// function auto_time_correction(input_dom) {
// 	assert(input_dom.type == 'text');
// 	input_dom.onmousedown = function(evt) {
// 		evt.toElement._last_val = evt.toElement.value;
// 	};
// 	input_dom.onchange = function(evt) {
// 		let s = evt.srcElement.value;
// 		if(s.match(/^[0-9]{1,2}$/) != null) {
// 			// when minute is ommited, add them.
// 			evt.srcElement.value = s + ':00';
// 		} else if(!is_valid_hhmm(s)) {
// 			// when it is invalid value, rollback the value.
// 			evt.srcElement.value = evt.srcElement._last_val;
// 		}
// 	};
// }

/**
	Search the record number of given HTMLTableRowElement
	If there is no such element, null will be returned
*/
// function index_of(table, tr_elem) {
// 	for(let i = 0; i < table.rows.length; ++i) {
// 		if(table.rows[i] === tr_elem) {
// 			return i;
// 		}
// 	}
// 	return null;
// }

/**
	Get given position's HTMLTableCell
*/
// function getCell(table, r, c) {
// 	assert(table != null);
// 	assert(r >= 0);
// 	assert(c >= 0);
// 	return table.rows[r].cells[c];
// }

/**
	table 	HTMLTableElement
	r 	row index >= 0
*/
// function addRow(table, r) {
// 	assert(table != null);
// 	assert(r >= -1 || r === undefined);
// 	r = (r === undefined ? -1 : r);

// 	// insert HTMLTableRowElement
// 	let tr = table.insertRow(r);
	
// 	// create time input box
// 	let td = tr.insertCell(-1);
// 	let input = document.createElement('input');
// 	input.type = 'text';
// 	input.defaultValue = '00:00';
// 	input.size = 14;
// 	//auto_time_correction(input);
// 	td.appendChild(input);

// 	// create add button
// 	td = tr.insertCell(-1);
// 	input = document.createElement('button');
// 	input.innerHTML = '+';
// 	input.style.width = '100%';
// 	input.onmouseup = function(e) {
// 		let addr = index_of(table, e.toElement.parentNode.parentNode) + 1;
// 		addRow(table, addr);

// 		// Select added row's time input
// 		getCell(table, addr, 0).childNodes[0].select();
// 	};
// 	td.appendChild(input);

// 	// create delete button
// 	td = tr.insertCell(-1);
// 	input = document.createElement('button');
// 	input.innerHTML = '-';
// 	input.style.width = '100%';
// 	input.onmouseup = function(e) {
// 		delRow(table, index_of(table, e.toElement.parentNode.parentNode));
// 	};
// 	td.appendChild(input);

// 	// if there are more than two records in table,
// 	// first row's delete button must be disabled.
// 	// therefore we should enable it.
// 	getCell(table, 1, 2).childNodes[0].disabled = table.rows.length <= 2;
// }

/**
	Delete the given row's record
	If r is undefined, last row will be deleted
*/
// function delRow(table, r) {
// 	assert(table != null);
// 	assert(r >= -1 || r === undefined);
// 	r = (r === undefined ? -1 : r);

// 	// delete the row
// 	table.deleteRow(r);
	
// 	// if there is only one record, disable delete button
// 	if(table.rows.length == 2) {
// 		getCell(table, 1, 2).childNodes[0].disabled = true;
// 	}
// }

/**
	T 	list of minute-metric time. (ex: [60, 120, 150, 1320])
	table HTMLTableElement
*/
// function timeline_to_table(T, table) {
// 	// Append row if it is not enough
// 	let m = 0;
// 	while(T.length > table.rows.length - 1) {
// 		addRow(table, -1);
// 	}

// 	// remove rows if it is not necessary
// 	while(T.length < table.rows.length - 1) {
// 		delRow(table);
// 	}

// 	// write each cell's contents
// 	T.forEach(function(t, idx) {
// 		getCell(table, idx + 1, 0).childNodes[0].value = integer_to_hhmm(t);
// 	});
// }

/**
	table: HTMLTableElement
*/
// function table_to_timeline(table) {
// 	let T = [];
// 	for(let r = 1; r < table.rows.length; ++r) {
// 		try {
// 			T[r - 1] = hhmm_to_integer(getCell(table, r, 0).childNodes[0].value);
// 		}
// 		catch(e) {
// 			console.log(e);
// 		}
// 	}
// 	return T;
// }

/**
	Return special drop's image dom string.
*/
function special_drop_img(category) {
	let out = '<img width="20px" src="';
	switch(category) {
		case 0: out += './img/quick_reinforce.png'; break;
		case 1: out += './img/quick_develop.png'; break;
		case 2: out += './img/iop_contract.png'; break;
		case 3: out += './img/equip_contract.png'; break;
		case 4: out += './img/furniture_coin.png'; break;
		default: throw 'illegal special drop category: ' + category; break;
	}
	out += '" />';
	return out;
}

/**
	Display the result on given table dom.
*/
function Vp_to_result_table(Vp, table, do_loop) {
	table.style.display = 'block';
	for(let n = 0; n < 8; ++n) {
		if(!!Vp[n]) {
			let v = Vp[n][0];
			let rate = Vp[n][2] / Vp[n][3];
			getCell(table, n + 1, 0).innerHTML = v[0];
			getCell(table, n + 1, 1).innerHTML = integer_to_hhmm(v[1]);
			if(do_loop) {
				getCell(table, n + 1, 2).innerHTML = Vp[n][2] + '회/' + Vp[n][3] + '일';
			} else {
				getCell(table, n + 1, 2).innerHTML = Vp[n][2] + '회';
			}
			getCell(table, n + 1, 3).innerHTML = v[2][0] * rate;
			getCell(table, n + 1, 4).innerHTML = v[2][1] * rate;
			getCell(table, n + 1, 5).innerHTML = v[2][2] * rate;
			getCell(table, n + 1, 6).innerHTML = v[2][3] * rate;

			// quick restoration
			getCell(table, n + 1, 7).innerHTML = '';
			for(let i = 0; i < 5; ++i) {
				if(v[2][4 + i] > 0) {
					getCell(table, n + 1, 7).innerHTML += special_drop_img(i);
				}
			}
		} else {
			// When there is no result
			for(let i = 0; i < 8; ++i) {
				getCell(table, n + 1, i).innerHTML = '-';
			}
		}
	}
}

/**
	Map the weight of special drops into number.
*/


/**
	Read resource ratio from document
	and return a ratio vector.
*/
// function load_ratio_vector() {
// 	// normalize
// 	let mp = parseFloat(document.getElementById('in-manpower').value);
// 	let am = parseFloat(document.getElementById('in-ammo').value);
// 	let mr = parseFloat(document.getElementById('in-ration').value);
// 	let pt = parseFloat(document.getElementById('in-parts').value);
// 	let sum = mp + am + mr + pt;

// 	// when every ratio is equal to zero, protect to divide by 0
// 	if(sum == 0) {
// 		sum = 1;
// 	}

// 	// apply special drops
// 	let qrs = intensity_to_float(document.getElementById('in-restore').value);
// 	let qmn = intensity_to_float(document.getElementById('in-manufacture').value);
// 	let dct = intensity_to_float(document.getElementById('in-doll').value);
// 	let ect = intensity_to_float(document.getElementById('in-equipment').value);
// 	let gch = intensity_to_float(document.getElementById('in-gatcha').value);
// 	return [mp/sum, am/sum, mr/sum, pt/sum, qrs, qmn, dct, ect, gch];
// }

// function config_to_dom(config) {
// 	timeline_to_table(config.timeline, document.getElementById('tb-timeline'))
// 	document.getElementById('in-manpower').value = config.ratio[0];
// 	document.getElementById('in-ammo').value = config.ratio[1];
// 	document.getElementById('in-ration').value = config.ratio[2];
// 	document.getElementById('in-parts').value = config.ratio[3];
// 	document.getElementById('in-restore').value = config.ratio[4];
// 	document.getElementById('in-manufacture').value = config.ratio[5];
// 	document.getElementById('in-doll').value = config.ratio[6];
// 	document.getElementById('in-equipment').value = config.ratio[7];
// 	document.getElementById('in-gatcha').value = config.ratio[8];
// 	document.getElementById('in-mintime').value = integer_to_hhmm(config.min_time);
// 	document.getElementById('in-maxtime').value = integer_to_hhmm(config.max_time);
// 	document.getElementById('in-loop').checked = config.daily_loop;
// 	document.getElementById('in-zero').value = config.min_level == 0;
// 	document.getElementById('in-map').value = config.max_level;
// }

// function dom_to_config() {
// 	return {
// 		'timeline': table_to_timeline(document.getElementById('tb-timeline')),
// 		'ratio': load_ratio_vector(),
// 		'min_time': hhmm_to_integer(document.getElementById('in-mintime').value),
// 		'max_time': hhmm_to_integer(document.getElementById('in-maxtime').value),
// 		'daily_loop': document.getElementById('in-loop').checked,
// 		'min_level': document.getElementById('in-zero').checked ? 0 : 1,
// 		'max_level': parseInt(document.getElementById('in-map').value)
// 	}
// }

function run() {
	// let config = dom_to_config();

	// Warning for non daily loop.
	if(!config.daily_loop && config.timeline.length <= 1) {
		alert('매일 반복을 하지 않을 경우, 첫 일정은 출발시각으로 간주됩니다.\n\n'
				+'최소 2개 이상의 일정을 입력해주세요.');
	}

	// Compute and display the result
	Vp_to_result_table(optimize(config), document.getElementById('tb-result'), config.daily_loop);

	// Save current config as cookie
	if(window.location.origin.match(/^file:/) != null) {
		window.localStorage.setItem('cookie', JSON.stringify(config));
	} else {
		document.cookie = JSON.stringify(config);
	}
}