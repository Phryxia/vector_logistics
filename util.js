'use strict'

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
}