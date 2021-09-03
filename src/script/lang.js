import qs from 'querystring'

const languages = ['ko', 'en', 'jp', 'tw', 'ch']

function getLanguageFromQuery() {
  const query = qs.parse(window.location.search.substring(1))
  return query.lang
}

function getBrowserLanguage() {
  return navigator?.language?.split('-')[0] ?? 'ko'
}

function loadLanguageIdFromBrowser() {
  const lang = getLanguageFromQuery() || getBrowserLanguage()
  return languages.indexOf(lang)
}

async function loadLanguageIdFromLocalStorage() {
  try {
    return (await localforage.getItem('lang')) ?? -1
  } catch {
    return -1
  }
}

export class LanguageManager {
  constructor() {
    // JSON 데이터
    this.words = null

    // 현재 언어 설정
    this.language_id = 0

    // 언어 변경 버튼 리스너 등록
    for (let id = 0; id < languages.length; ++id) {
      document.getElementById(`lang-sel-${id}`).onclick = () => {
        this.changeLanguage(id)
      }
    }

    window.onpopstate = () => {
      this.changeLanguage(loadLanguageIdFromBrowser(), true)
    }
  }

  /**
   * /src/localization.json에서 불러온 JSON 데이터를 그대로 넣으면 됨
   * @param {*} words
   */
  init(words) {
    this.words = words
    this.initLanguage()
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
   * @param {number} languageId
   */
  changeLanguage(languageId, isReplaced) {
    this.language_id = languageId

    // 언어 관련 DOM에 있는 텍스트를 전부 바꾼다.
    for (let id = 0; id < this.words.length; ++id) {
      try {
        const $doms = document.querySelectorAll(`[data-lang="lang-${id}"]`)
        $doms.forEach((dom) => {
          dom.innerHTML = this.get_word(id)
        })
      } catch (err) {
        console.log('[ERROR] changeLanguage: there is no name lang-' + id)
      }
    }

    // save language selection
    localforage.setItem('lang', languageId)

    const languageName = languages[languageId]
    if (isReplaced) {
      window.history.replaceState(
        null,
        `lang-${languageName}`,
        `?lang=${languageName}`
      )
    } else {
      window.history.pushState(
        null,
        `lang-${languageName}`,
        `?lang=${languageName}`
      )
    }
  }

  async initLanguage() {
    let languageId = await loadLanguageIdFromLocalStorage()

    if (languageId === -1) languageId = loadLanguageIdFromBrowser()

    this.changeLanguage(languageId, true)
  }
}
