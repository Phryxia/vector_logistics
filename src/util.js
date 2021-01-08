'use strict'

// TODO: console.assert로 다 바꿀 것
function assert(cond, msg) {
	if(!cond) {
		if(!msg)
			msg = 'assertion failed';
		throw msg;
	}
}

function ifndef(x, alt) {
	return x === undefined ? alt : x;
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
	Also, mm should be smaller than 60.
*/
function is_valid_hhmm(s) {
	return s !== null && s !== undefined
		&& s.match(/^[0-9]{1,2}:[0-9]{1,2}$/) != null
		&& parseInt(s.match(/[0-9]{1,2}$/)[0]) < 60;
}

/**
	Ask user to give some input.
	It repeats until predicate(input) to be true
	or user/browser terminate the message.
	If user/browser terminate it, null will be returned.
*/
function ask_via_prompt(predicate, msg_init, msg_retry, default_val) {
	// ask user when to start repeat
	let out = window.prompt(msg_init, default_val);
	
	// if user give illegal string, do once again
	let pass = false;
	while(out !== null && !predicate(out))
		out = window.prompt(msg_retry, default_val);

	return out;
}