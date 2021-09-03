/**
 * 언어에 관련된 클래스이다.
 */
export class LanguageManager {
  constructor() {
    // JSON 데이터
    this.words = null

    // 현재 언어 설정
    this.language_id = LanguageManager.KO

    // 언어 변경 버튼 리스너 등록
    for (let id = 0; id < 5; ++id) {
      document.getElementById(`lang-sel-${id}`).onclick = () => {
        LanguageManager.instance.change_language(id)
      }
    }
  }

  /**
   * /src/localization.json에서 불러온 JSON 데이터를 그대로 넣으면 됨
   * @param {*} words
   */
  init(words) {
    this.words = words
  }

  /**
   * 현재 Language로 word_id를 표현할 문장을 반환한다.
   * @param {number} word_id
   */
  get_word(word_id) {
    return this.words[word_id][this.language_id]
  }

  /**
   * 현재 Language를 lang_id로 바꾼다.
   * @param {number} lang_id
   */
  change_language(lang_id) {
    this.language_id = lang_id

    // 언어 관련 DOM에 있는 텍스트를 전부 바꾼다.
    for (let id = 0; id < this.words.length; ++id) {
      try {
        const $doms = document.querySelectorAll(`[data-lang=lang-${id}`)
        $doms.forEach((dom) => {
          dom.innerHTML = this.get_word(id)
        })
      } catch (err) {
        console.log('[ERROR] change_language: there is no name lang-' + id)
      }
    }

    // save language selection
    localforage.setItem('lang', this.language_id)
  }
}

LanguageManager.KO = 0
LanguageManager.EN = 1
LanguageManager.JP = 2
LanguageManager.TW = 3
LanguageManager.CH = 4
