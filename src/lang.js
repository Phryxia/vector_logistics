'use strict';

/**
 * 언어에 관련된 클래스이다.
 */
class LanguageManager {
	/**
	 * callback: JSON 파일 로드가 완료되면 실행시킬 콜백함수
	 * @param {() => void} callback 
	 */
	constructor(callback) {
		// 현재 언어 설정
		this.language_id = LanguageManager.KO;

		// 언어 변경 버튼 리스너 등록
		for (let id = 0; id < 5; ++id) {
			document.getElementById(`lang-sel-${id}`).onclick = () => {
				LanguageManager.instance.change_language(id);
			};
		}

		this.load_words()
			.then((val) => {
				this.words = val;
				callback();
			});
	}

	/**
	 * JSON 파일을 읽어옵니다.
	 */
	load_words() {
		return new Promise((resolve, reject) => {
			let xreq = new XMLHttpRequest();
			xreq.addEventListener('load', function() {
				try {
					resolve(JSON.parse(this.responseText));
				}
				catch (error) {
					console.log('[LanguageManager::load_words] Fail to load json file');
					reject([]);
				}
			});
			xreq.open('GET', '/src/localization.json');
			xreq.send();
		});
	}
	
	/**
	 * 현재 Language로 word_id를 표현할 문장을 반환한다.
	 * @param {number} word_id 
	 */
	get_word(word_id) {
		return this.words[word_id][this.language_id];
	}
	
	/**
	 * 현재 Language를 lang_id로 바꾼다.
	 * @param {number} lang_id 
	 */
	change_language(lang_id) {
		this.language_id = lang_id;

		// 언어 관련 DOM에 있는 텍스트를 전부 바꾼다.
		for (let id = 0; id < this.words.length; ++id) {
			try {
				document.getElementsByName('lang-' + id).forEach(dom => {
					dom.innerHTML = this.get_word(id);
				});
			}
			catch (err) {
				console.log('[ERROR] change_language: there is no name lang-' + id);
			}
		}

		// save language selection
		localforage.setItem('lang', this.language_id);
	}
}

LanguageManager.KO = 0;
LanguageManager.EN = 1;
LanguageManager.JP = 2;
LanguageManager.TW = 3;
LanguageManager.CH = 4;