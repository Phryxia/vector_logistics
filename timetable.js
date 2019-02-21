'use strict'

// Frequently used DOM
let DOM_TB_CONFIG = document.getElementById('tb-config');
let DOM_TB_TIMELINE = document.getElementById('tb-timeline');
let DOM_TB_RESULT = document.getElementById('tb-result');

function assert(cond) {
	if(!cond) {
		throw 'assertion failed';
	}
}

/**
	Give special ability to input_dom:

	when cond(input_dom.value) is false, backup value
	would be restored on given input dom.
*/
function invalid_input_protect(input_dom, cond) {
	input_dom.onmousedown = function(evt) {
		evt.toElement._last_val = evt.toElement.value;
	};
	input_dom.onchange = function(evt) {
		if(!cond(evt.srcElement.value)) {
			evt.srcElement.value = evt.srcElement._last_val;
		}
	};
}

/**
*/
function is_valid_float_string(s) {
	return s.match(/^[0-9]+(\.[0-9]+)?$/) != null;
};

/**
	Convert minute-specified integer into
	hh:mm string.
*/
function integer_to_hhmm(t) {
	return Math.floor(t / 60).toString().padStart(2, '0') + ':' + (t % 60).toString().padStart(2, '0');
}

/**
	Convert hh:mm string into minute-specified integer
*/
function hhmm_to_integer(s) {
	let tokens = s.split(':');
	return 60 * parseInt(tokens[0]) + parseInt(tokens[1]);
}

/**
	Test whether s is valid time format string.
	This accept h:m, h:mm, hh:m, hh:mm
*/
function is_valid_hhmm(s) {
	return s !== null && s !== undefined
		&& s.match(/^[0-9]{1,2}:[0-9]{1,2}$/) != null
		&& hhmm_to_integer(s) < 1440;
}

/**
	Search the record number of given HTMLTableRowElement
	If there is no such element, null will be returned
*/
function index_of(table, tr_elem) {
	for(let i = 0; i < table.rows.length; ++i) {
		if(table.rows[i] === tr_elem) {
			return i;
		}
	}
	return null;
}

/**
	Get given position's HTMLTableCell
*/
function getCell(table, r, c) {
	assert(table != null);
	assert(r >= 0);
	assert(c >= 0);
	return table.rows[r].cells[c];
}

/**
	table 	HTMLTableElement
	r 	row index >= 0
*/
function addRow(table, r) {
	assert(table != null);
	assert(r >= -1 || r === undefined);
	r = (r === undefined ? -1 : r);

	// insert HTMLTableRowElement
	let tr = table.insertRow(r);
	
	// create time input box
	let td = tr.insertCell(-1);
	let input = document.createElement('input');
	input.type = 'text';
	input.defaultValue = '00:00';
	input.size = 14;
	invalid_input_protect(input, is_valid_hhmm);
	td.appendChild(input);

	// create add button
	td = tr.insertCell(-1);
	input = document.createElement('button');
	input.innerHTML = '+';
	input.style.width = '100%';
	input.onmouseup = function(e) {
		addRow(table, index_of(table, e.toElement.parentNode.parentNode) + 1);
	};
	td.appendChild(input);

	// create delete button
	td = tr.insertCell(-1);
	input = document.createElement('button');
	input.innerHTML = '-';
	input.style.width = '100%';
	input.onmouseup = function(e) {
		delRow(table, index_of(table, e.toElement.parentNode.parentNode));
	};
	td.appendChild(input);

	// if there are more than two records in table,
	// first row's delete button must be disabled.
	// therefore we should enable it.
	getCell(table, 1, 2).childNodes[0].disabled = table.rows.length <= 2;
}

/**
	Delete the given row's record
	If r is undefined, last row will be deleted
*/
function delRow(table, r) {
	assert(table != null);
	assert(r >= -1 || r === undefined);
	r = (r === undefined ? -1 : r);

	// delete the row
	table.deleteRow(r);
	
	// if there is only one record, disable delete button
	if(table.rows.length == 2) {
		getCell(table, 1, 2).childNodes[0].disabled = true;
	}
}

/**
	T 	list of minute-metric time. (ex: [60, 120, 150, 1320])
	table HTMLTableElement
*/
function timeline_to_table(T, table) {
	// Append row if it is not enough
	let m = 0;
	while(T.length > table.rows.length - 1) {
		addRow(table, -1);
	}

	// remove rows if it is not necessary
	while(T.length < table.rows.length - 1) {
		delRow(table);
	}

	// write each cell's contents
	T.forEach(function(t, idx) {
		getCell(table, idx + 1, 0).childNodes[0].value = integer_to_hhmm(t);
	});
}

/**
	table: HTMLTableElement
*/
function table_to_timeline(table, T) {
	for(let r = 1; r < table.rows.length; ++r) {
		try {
			T[r - 1] = hhmm_to_integer(getCell(table, r, 0).childNodes[0].value);
		}
		catch(e) {
			console.log(e);
		}
	}
}

let TIMELINE = [0];

/**
	Apply some protection event listener
*/
function init_config_table(table) {
	invalid_input_protect(document.getElementById('in-mintime'), is_valid_hhmm);
	invalid_input_protect(document.getElementById('in-maxtime'), is_valid_hhmm);
	invalid_input_protect(document.getElementById('in-manpower'), is_valid_float_string);
	invalid_input_protect(document.getElementById('in-ammo'), is_valid_float_string);
	invalid_input_protect(document.getElementById('in-ration'), is_valid_float_string);
	invalid_input_protect(document.getElementById('in-parts'), is_valid_float_string);
}

/**
	Initialize timeline edit table
*/
function init_timeline_table(table) {
	timeline_to_table(TIMELINE, table);
}

/**
	Create the result table.
*/
function init_result_table(table) {
	let tr, td;
	for(let n = 0; n < 9; ++n) {
		tr = table.insertRow(-1);
		for(let i = 0; i < table.rows[0].cells.length; ++i) {
			tr.insertCell(-1);
		}
	}
}

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
function intensity_to_float(s) {
	assert(!!s);
	if(s == 'low') {
		return 100.0;
	} else if(s == 'mid') {
		return 500.0;
	} else if(s == 'high') {
		return 1000.0;
	} else {
		return 0.0;
	}
}

/**
	Read resource ratio from document
	and return a ratio vector.
*/
function load_ratio_vector() {
	// normalize
	let mp = parseFloat(document.getElementById('in-manpower').value);
	let am = parseFloat(document.getElementById('in-ammo').value);
	let mr = parseFloat(document.getElementById('in-ration').value);
	let pt = parseFloat(document.getElementById('in-parts').value);
	let sum = mp + am + mr + pt;

	// when every ratio is equal to zero, protect to divide by 0
	if(sum == 0) {
		sum = 1;
	}

	// apply special drops
	let qrs = intensity_to_float(document.getElementById('in-restore').value);
	let qmn = intensity_to_float(document.getElementById('in-manufacture').value);
	let dct = intensity_to_float(document.getElementById('in-doll').value);
	let ect = intensity_to_float(document.getElementById('in-equipment').value);
	let gch = intensity_to_float(document.getElementById('in-gatcha').value);
	return [mp/sum, am/sum, mr/sum, pt/sum, qrs, qmn, dct, ect, gch];
}

init_config_table(DOM_TB_CONFIG);
init_timeline_table(DOM_TB_TIMELINE);
init_result_table(DOM_TB_RESULT);

/**
	If compute button is clicked then efficiency is
	computed.
*/
document.getElementById('bt-compute').onmouseup = function(e) {
	// Load user defined timeline
	table_to_timeline(DOM_TB_TIMELINE, TIMELINE);

	// Rectify logstics support list
	let mintime = hhmm_to_integer(document.getElementById('in-mintime').value);
	let maxtime = hhmm_to_integer(document.getElementById('in-maxtime').value);
	let minlevel = document.getElementById('in-zero').checked ? 0 : 1;
	let maxlevel = parseInt(document.getElementById('in-map').value);
	let Vf = V.filter(function(v) {
		// Get the level of given logistic support
		let lv = parseInt(v[0].match(/^[0-9]{1,2}/)[0]);
		return mintime <= v[1] && v[1] <= maxtime && minlevel <= lv && lv <= maxlevel;
	});

	// Load resource ratio vector
	let r = load_ratio_vector();
	let do_loop = document.getElementById('in-loop').checked;
	let Vp = sort(profile(Vf, r, TIMELINE, do_loop));
	Vp_to_result_table(Vp, DOM_TB_RESULT, do_loop);
};

/**
	Preset
*/
document.getElementById('in-preset').onchange = function(e) {
	switch(parseInt(e.srcElement.value)) {
		case 1: 
			TIMELINE = [7*60+30, 8*60+30, 13*60, 18*60, 22*60];
			break;
		case 2:
			TIMELINE = [8*60, 8*60+50, 12*60, 17*60+30, 0];
			break;
		case 3:
			TIMELINE = [];
			for(let h = 12; h < 24; ++h) {
				TIMELINE.push(h * 60);
			}
			break;
		case 4:
			TIMELINE = [6*60, 12*60+30, 18*60+30, 22*60];
			break;
		case 5:
			TIMELINE = [6*60, 12*60+30, 17*60+30, 22*60, 1*60];
			break;
		case 6:
			TIMELINE = [0, 7*60];
			break;
		default:
			TIMELINE = [0];
			break;
	}
	timeline_to_table(TIMELINE, document.getElementById('tb-timeline'));
};