'use strict';
/**
	Preset's config should not be modified.
	That's why get_config return the copies.
*/
class Preset {
	constructor(name, config) {
		assert(!!name && !!config);
		this.name = name;
		this.config = config;
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
		this.presets = [new Preset('-', Config.DEFAULT_CONFIG)];
		this.dom = document.getElementById('in-preset');
		this.dom.preset_ctr = this;
		this.dom.onchange = function(evt) {
			evt.srcElement.preset_ctr.set_current(evt.srcElement.selectedIndex);
		};

		// closure
		this.button_add = document.getElementById('bt-preset-add');
		this.button_add.preset_ctr = this;
		this.button_add.onclick = function(evt) {
			// get preset ctr
			let preset_ctr = evt.srcElement.preset_ctr;
			if(!preset_ctr)
				console.log('[PresetController::button_add.onclick] there is no preset_ctr on add button');

			// get input string from window.prompt
			let preset_name = window.prompt('프리셋 이름을 입력하세요.', '크리스 벡터');
			
			// if user pressed 'cancel' button, do nothing.
			if(preset_name === null)
				return;

			// if user give illegal string, do once again
			while(preset_name === '') {
				preset_name = window.prompt('이름은 최소 1글자 이상이어야 합니다.', '크리스 벡터');
				if(preset_name === null)
					return;
			}

			// browser may block the prompt so error can be happened
			if(preset_name !== '')
				preset_ctr.add_preset(new Preset(preset_name, preset_ctr.cfgctr.get_current_config()));


		};
		this.button_del = document.getElementById('bt-preset-del');
		this.button_del.preset_ctr = this;
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
		console.log('[PresetController::add_preset] new preset added');
		console.log(this.presets);
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