export class Util {
  static ifndef(x, alt) {
    return x === undefined ? alt : x
  }

  /**
		Convert minute-specified integer into
		hh:mm string.
	*/
  static integer_to_hhmm(t) {
    return (
      Math.floor(t / 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      (t % 60).toString().padStart(2, '0')
    )
  }

  /**
		Convert hh:mm string into minute-specified integer
	*/
  static hhmm_to_integer(s) {
    let tokens = s.split(':')
    return 60 * parseInt(tokens[0]) + parseInt(tokens[1])
  }

  /**
		Test whether s is valid time format string.
		This accept h:m, h:mm, hh:m, hh:mm
		Also, mm should be smaller than 60.
	*/
  static is_valid_hhmm(s) {
    return (
      s !== null &&
      s !== undefined &&
      s.match(/^[0-9]{1,2}:[0-9]{1,2}$/) != null &&
      parseInt(s.match(/[0-9]{1,2}$/)[0]) < 60
    )
  }

  /**
		Ask user to give some input.
		It repeats until predicate(input) to be true
		or user/browser terminate the message.
		If user/browser terminate it, null will be returned.
	*/
  static ask_via_prompt(predicate, msg_init, msg_retry, default_val) {
    // ask user when to start repeat
    let out = window.prompt(msg_init, default_val)

    // if user give illegal string, do once again
    let pass = false
    while (out !== null && !predicate(out))
      out = window.prompt(msg_retry, default_val)

    return out
  }
}
