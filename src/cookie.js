import { Config } from './config.js';
import { Preset } from './presets.js';
import { LanguageManager } from './lang.js';

/**
	CookieManager capsulate data IO between
	application and cookie.

	Also CookieManager hold locale information

	since localforage.js is asynchronous
	we have to handle callback to await it.
*/
export class CookieManager {
	/**
	 * 로컬에 저장된 설정을 혀재 세션의 presetController에 불러온다.
	 * @param {ConfigController} cfgctr  
	 * @param {PresetController} prsctr 
	 */
	load_snapshot(cfgctr, prsctr) {
		this.cfgctr = cfgctr;
		this.prsctr = prsctr;
		
		this.__load_cookie();
	}

	/**
		현재 세션의 presetController의 설정을 로컬에 저장한다.
		@param {PresetController} prsctr
	*/
	save_snapshot(prsctr) {
		this.prsctr = prsctr;
		this.__save_cookie(JSON.stringify({
			presets: prsctr.presets,
			selected_index: prsctr.selected_index
		}));
	}

	/**
		JSONString을 localforage를 사용하여 로컬에 저장한다.

		(추후 object로 변경될 예정이다)
	*/
	__save_cookie(pure_json_str) {
		localforage.setItem('json_string', pure_json_str).catch(function(err) {
			console.log(err);
		});
		localforage.setItem('lang', this.lang)
			.catch(err => {
				console.log(err);
			});
	}

	/**
		localforage에서 저장된 정보를 불러온 뒤, 현재 세션의 preset
		Controller에 적용한다.

		만약 도중 에러가 발생할 경우, __reset_cookie()를 호출한다.
	*/
	__load_cookie() {
		localforage.getItem('json_string')
		.then((val) => {
			this.loaded_cookie = val;
			this.__apply_cookie();
		}).catch((err) => {
			// error recvoery
			console.log(err);
			this.__reset_cookie();
		});

		// language setting
		localforage.getItem('lang')
		.then(val => {
			if(val == null)
				LanguageManager.instance.change_language(LanguageManager.KO);
			else
				LanguageManager.instance.change_language(val);
		})
		.catch(err => {
			LanguageManager.instance.change_language(LanguageManager.KO);
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
				// 모드에 관련해서: v1.0.0 이후로 추가된 값이라, 그 이전 버전의 유저들의 경우 모드값이 비어있다.
				// 그래서 최대한 자세하게 복원하기 위해 기본값을 고급모드로 설정한다.
				obj.presets[i] = new Preset(obj.presets[i].name, new Config(obj.presets[i].config), obj.presets[i].mode !== undefined ? obj.presets[i].mode : 1);
			
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