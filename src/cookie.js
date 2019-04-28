'use strict';

/**
	CookieManager capsulate data IO between
	application and cookie.
*/
class CookieManager {
	/**
		로컬에 저장된 설정을 혀재 세션의 presetController에 불러온다.
	*/
	load_snapshot(prsctr) {
		assert(!!prsctr && prsctr instanceof PresetController);
		this.prsctr = prsctr;
		let success = true;
		let obj = null;
		// load JSON object
		this.__load_cookie();
	}

	/**
		현재 세션의 presetController의 설정을 로컬에 저장한다.
	*/
	save_snapshot(prsctr) {
		assert(!!prsctr && prsctr instanceof PresetController);
		this.prsctr = prsctr;
		this.__save_cookie(JSON.stringify({
			presets: prsctr.presets,
			selected_index: prsctr.selected_index
		}));
	}

	// is_local() {
	// 	return window.location.origin.match(/^file:/) != null;
	// }

	/**
		JSONString을 localforage를 사용하여 로컬에 저장한다.

		(추후 object로 변경될 예정이다)
	*/
	__save_cookie(pure_json_str) {
		localforage.setItem('json_string', pure_json_str).catch(function(err) {
			console.log(err);
		});
	}

	/**
		localforage에서 저장된 정보를 불러온 뒤, 현재 세션의 preset
		Controller에 적용한다.

		만약 도중 에러가 발생할 경우, __reset_cookie()를 호출한다.
	*/
	__load_cookie() {
		let self = this;
		localforage.getItem('json_string').then(function(val) {
			self.loaded_cookie = val;
			self.__apply_cookie();
		}).catch(function(err) {
			// error recvoery
			console.log(err);
			self.__reset_cookie();
		});
	}

	/**
		__load_cookie()에서 호출된 localforage의 비동기 처리완료
		콜백 함수다.

		만약 도중 에러가 발생할 경우, __reset_cookie()를 호출한다.
	*/
	__apply_cookie() {
		let obj = null;
		try {
			obj = JSON.parse(this.loaded_cookie);
		}
		catch(e) {
			console.log(e);
		}

		if(obj !== null) {
			// morph generic Object into valid Config and Preset
			for(let i = 0; i < obj.presets.length; ++i)
				obj.presets[i] = new Preset(obj.presets[i].name, new Config(obj.presets[i].config));
			
			// apply to PresetController
			this.prsctr.override_presets(obj.presets, obj.selected_index);
		} else {
			// just use default preset.
			this.__reset_cookie();
		}
	}

	/**
		기본 프리셋을 presetController에 로드시킨다.
	*/
	__reset_cookie() {
		this.prsctr.set_current(0);
	}
}