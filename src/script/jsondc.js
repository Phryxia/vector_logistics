/**
 * JSONDC는 JSON 파일을 불러오고 라이프사이클을 통제하는 역할을 하는 클래스
 */
export class JSONDC {
  /**
   * JSON 파일을 읽어 작전 정보를 가져옵니다. Promise임.
   */
  load_json(path) {
    return new Promise((resolve, reject) => {
      let xreq = new XMLHttpRequest()
      xreq.addEventListener('load', function () {
        try {
          resolve(JSON.parse(this.responseText))
        } catch (error) {
          console.log('[JSONDC::load_json] Fail to load json file from ' + path)
          reject(null)
        }
      })
      xreq.open('GET', path)
      xreq.send()
    })
  }
}
