'use strict';
/**
	Preset's config should not be modified.
	That's why get_config return the copies.
*/
class Preset {
	constructor(name, config) {
		this.name = ifndef(name, '-');
		this.config = !!config ? config : new Config();
	}

	get_name() {
		return this.name;
	}

	get_config() {
		return this.config.copy();
	}
}

/**
	PresetController controls in-preset element.
	This connects followings:

	Config <-> ConfigController <-> PresetController
*/
class PresetController {
	constructor(cfgctr) {
		assert(!!cfgctr && cfgctr.__proto__ == ConfigController.prototype);
		this.cfgctr = cfgctr;
		this.presets = [new Preset()];
		this.dom = document.getElementById('in-preset');
		this.dom.preset_ctr = this;
		this.dom.onchange = function(evt) {
			evt.srcElement.preset_ctr.set_current(evt.srcElement.selectedIndex);
		};
		this.button_add = document.getElementById('bt-preset-add');
		// wip: add config controller
		// this.button_add.onclick = function(evt) {
		// 	add_preset()
		// };
		this.button_del = document.getElementById('bt-preset-del');
		this.update_dom();
	}

	/**
		Get current selected preset object
	*/
	get_current() {
		return this.presets[this.dom.selectedIndex];
	}

	/**
		Set current preset as given index and update ConfigController.
	*/
	set_current(idx) {
		assert(0 <= idx && idx < this.dom.options.length);
		this.dom.selectedIndex = idx;
		this.cfgctr.assign_config(this.get_current().get_config());
	}

	add_preset(preset) {
		assert(!!preset);
		this.presets.push(preset);
		this.update_dom();
	}

	update_dom() {
		let dom = this.dom;
		while(dom.options.length < this.presets.length) {
			dom.add(document.createElement('option'));
		}
		while(dom.options.length > this.presets.length) {
			dom.remove(dom.options.length - 1);
		}
		this.presets.forEach(function(preset, idx) {
			dom.options[idx].text = preset.name;
		});
	}
}