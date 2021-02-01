'use strict';
/**
 * 프리셋을 모델링한 클래스다.
 * Preset 클래스는 Immutable로 간주한다.
 */
class Preset {
	constructor(name, config, mode) {
		console.assert(name && config);
		
		// 프리셋의 이름
		this.name = name;

		// 프리셋 내용
		this.config = config;

		// 기본모드 vs 고급모드 여부 (number 0 or 1)
		this.mode = mode;
	}

	get_name() {
		return this.name;
	}

	get_config() {
		return this.config.copy();
	}

	get_mode() {
		return this.mode;
	}

	toJSON() {
		return {
			name: this.name,
			config: this.config.toJSON(),
			mode: this.mode
		};
	}
}

/**
 * 프리셋 리스트를 관리하는 클래스이다.
 */
class PresetController {
	/**
	 * 
	 * @param {ConfigController} cfgctr 
	 */
	constructor(cfgctr) {
		console.assert(cfgctr && cfgctr instanceof ConfigController);
		this.cfgctr = cfgctr;
		this.presets = [new Preset('-', Config.DEFAULT_CONFIG, 0)];
		this.selected_index = 0;

		this.view = new PresetView(
			// select option을 선택했을 때 이벤트 핸들러
			(evt) => {
				this.set_current(evt.target.selectedIndex);
				CookieManager.instance.save_snapshot(this);
			},
			
			// 추가 버튼 이벤트 핸들러
			(evt) => {
				// get input string from window.prompt
				let preset_name = window.prompt(LanguageManager.instance.get_word(33), 'nice-name');

				// if user give illegal string, do once again
				let pass = false;
				while (preset_name !== null && !pass)
				{
					if (preset_name === '')
						preset_name = window.prompt(LanguageManager.instance.get_word(34), 'nice-name');
					else if (preset_name.includes(';'))
						preset_name = window.prompt(LanguageManager.instance.get_word(35), 'nice-name');
					else
						pass = true;
				}
					
				// browser may block the prompt so error can be happened
				if (preset_name !== null && preset_name != '')
				{
					// generally, add_preset doesn't select the brand-new added
					// options. but most desirable ux is selecting it.
					this.selected_index = this.presets.length;
					this.add_preset(new Preset(preset_name, this.cfgctr.fetch(), this.cfgctr.mode));
				}
			},
			
			// 삭제 버튼 이벤트 핸들러
			(evt) => {
				if (window.confirm('정말로 삭제하시겠습니까?'))
					this.del_preset(this.selected_index);
			});
	}

	/**
		Replace current presets array
		and select given option
		and refresh DOM.

		If there is no specified selected_index,
		or nothing has been selected before,
		0-th option will be selected.
	*/
	override_presets(presets, selected_index) {
		console.assert(presets);
		for(let i = 0; i < presets.length; ++i)
			if(!presets[i] || !(presets[i] instanceof Preset))
				throw '[PresetController::override_presets] illegal preset: ' + presets[i];

		// v1.0.0의 버그 수정코드: 디폴트 프리셋인 0번 프리셋은 모드가 0이어야 한다.
		// 그런데 v1.0.0에는 프리셋의 모드를 저장하지 않았기 때문에, 모드가 undefined이다.
		// 그래서 cookie::__apply_cookie에서 강제로 모드를 1로 설정하는 문제가 있다.
		presets[0].mode = 0;

		this.presets = presets;
		if(selected_index === undefined || selected_index < 0)
			selected_index = 0;
		this.set_current(selected_index);
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
		console.assert(0 <= idx && idx < this.presets.length);
		this.selected_index = idx;

		const current_preset = this.get_current();
		this.cfgctr.set_mode(current_preset.mode, true);
		this.cfgctr.update(current_preset.get_config());
		this.view.update(this.presets, this.selected_index);
	}

	/**
		Add given preset to the last of preset options
		and refresh DOM
		and update cookie.
	*/
	add_preset(preset) {
		console.assert(preset);
		this.presets.push(preset);
		this.view.update(this.presets, this.selected_index);
		CookieManager.instance.save_snapshot(this);
	}

	/**
		Delete idx-th preset from current preset options
		and select nothing
		and refresh DOM
		and update cookie.

		Note that deletion doesn't change current config DOM
		because users may modify something at that situation.
	*/
	del_preset(idx) {
		console.assert(0 <= idx && idx < this.presets.length);
		this.selected_index = -1;
		this.presets = this.presets.slice(0, idx).concat(this.presets.slice(idx + 1));
		this.view.update(this.presets, this.selected_index);
		CookieManager.instance.save_snapshot(this);
	}
}

class PresetView {
	/**
	 * 프리셋 선택을 바꿀 때 실행되어야 할 콜백을 주입해줘야 한다.
	 * @param {(evt) => void} onchange 
	 */
	constructor(onchange, onclickAdd, onclickDel) {
		this.selector = document.getElementById('in-preset');
		this.selector.onchange = onchange;

		// preset add button
		this.button_add = document.getElementById('bt-preset-add');
		this.button_add.onclick = onclickAdd;

		// preset delete button
		this.button_del = document.getElementById('bt-preset-del');
		this.button_del.onclick = onclickDel;
		
		// 반복일정추가 버튼을 찾아오셨나요?
		// vm-advanced.js로 가세요.
		// 디자인 문제로 버튼이 여기에 달려있을 뿐...
	}

	update(presets, selectedIndex) {
		// insert new options if presets is large than current options.
		while(this.selector.options.length < presets.length) {
			this.selector.add(document.createElement('option'));
		}

		// otherwise remove options.
		while(this.selector.options.length > presets.length) {
			this.selector.remove(this.selector.options.length - 1);
		}

		// rewrite option's display name
		presets.forEach((preset, idx) => {
			this.selector.options[idx].text = preset.name;
		});

		// rewrite selected index
		this.selector.selectedIndex = selectedIndex;

		// lock the button when there is only one preset
		// or lock the button when selected index is zero (=default preset)
		// note that unselected version is also exist.
		this.button_del.disabled = (selectedIndex <= 0) || (presets.length <= 1);
	}
}