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
		this.selected_index = 0;

		// preset selecting droplist
		this.dom = document.getElementById('in-preset');
		this.dom.preset_ctr = this;
		this.dom.onchange = function(evt) {
			let preset_ctr = evt.srcElement.preset_ctr;
			preset_ctr.set_current(preset_ctr.dom.selectedIndex);
		};

		// preset add button
		this.button_add = document.getElementById('bt-preset-add');
		this.button_add.preset_ctr = this;
		this.button_add.onclick = function(evt) {
			// get preset ctr
			let preset_ctr = evt.srcElement.preset_ctr;
			assert(!!preset_ctr, '[PresetController::button_add.onclick] there is no preset_ctr on add button');
			
			// get input string from window.prompt
			let preset_name = window.prompt('프리셋 이름을 입력하세요.', '크리스 벡터');

			// if user give illegal string, do once again
			while(preset_name !== null && preset_name === '')
				preset_name = window.prompt('이름은 최소 1글자 이상이어야 합니다.', '크리스 벡터');

			// browser may block the prompt so error can be happened
			if(preset_name !== null && preset_name != '')
			{
				// generally, add_preset doesn't select the brand-new added
				// options. but most desirable ux is selecting it.
				preset_ctr.selected_index = preset_ctr.presets.length;
				preset_ctr.add_preset(new Preset(preset_name, preset_ctr.cfgctr.get_current_config()));
			}
		};

		// preset delete button
		this.button_del = document.getElementById('bt-preset-del');
		this.button_del.preset_ctr = this;
		this.button_del.onclick = function(evt) {
			// get preset ctr
			let preset_ctr = evt.srcElement.preset_ctr;
			assert(!!preset_ctr, '[PresetController::button_add.onclick] there is no preset_ctr on add button');
			
			if(window.confirm('정말로 삭제하시겠습니까?'))
				preset_ctr.del_preset(preset_ctr.dom.selectedIndex);
		};

		// refresh first
		this.update_dom();
	}

	/**
		Return currently selected preset.
		If there is no such preset, return null.
	*/
	get_current() {
		if(this.selected_index >= 0)
			return this.presets[this.selected_index];
		else
			return null;
	}

	/**
		Set current preset as idx-th preset
		and synchronize config DOM
		and refresh DOM.
	*/
	set_current(idx) {
		assert(0 <= idx && idx < this.presets.length);
		this.selected_index = idx;
		this.cfgctr.assign_config(this.get_current().get_config());
		this.update_dom();
	}

	/**
		Add given preset to the last of preset options
		and refresh DOM.
	*/
	add_preset(preset) {
		assert(!!preset);
		this.presets.push(preset);
		this.update_dom();
	}

	/**
		Delete idx-th preset from current preset options
		and select nothing
		and refresh DOM.

		Note that delete doesn't change current config DOM.
	*/
	del_preset(idx) {
		assert(0 <= idx && idx < this.dom.options.length);
		this.selected_index = -1;
		this.presets = this.presets.slice(0, idx).concat(this.presets.slice(idx + 1));
		this.update_dom();
	}

	/**
		Update DOM so that they display current selected preset.
	*/
	update_dom() {
		// insert new options if presets is large than current options.
		while(this.dom.options.length < this.presets.length) {
			this.dom.add(document.createElement('option'));
		}

		// otherwise remove options.
		while(this.dom.options.length > this.presets.length) {
			this.dom.remove(this.dom.options.length - 1);
		}

		// rewrite option's display name
		let self = this;
		this.presets.forEach(function(preset, idx) {
			self.dom.options[idx].text = preset.name;
		});

		// rewrite selected index
		this.dom.selectedIndex = this.selected_index;

		// lock the button when there is only one preset
		// or lock the button when selected index is zero (=default preset)
		// note that unselected version is also exist.
		this.button_del.disabled = (this.dom.selectedIndex <= 0)
		                        || (this.presets.length <= 1);
		this.button_del.style.visibility = (this.button_del.disabled
			                             ? 'hidden' : 'visible');
	}
}