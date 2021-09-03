import { Util } from './util.js'
import { Config } from './config.js'
import { Algorithm } from './kriss_vector.js'

// VMEasy는 간편설정 UI를 담당하는 뷰모델입니다.
// VMEasy는 Config로 통신하며 다른 클래스에 종속되지 않습니다.
export class VMEasy {
  constructor() {
    // [인, 탄, 식, 부,
    //  쾌속수복, 쾌속제조, 인형, 장비, 토큰
    //  기상시각, 취침시각, 0지개방]
    this.inputs = document
      .getElementById('easy_config')
      .querySelectorAll('input')
    this.open_level = document.getElementById('in-map-easy')

    // 버튼 입력기
    let btfn = (evt) => {
      if (evt.target.checked) this.__set_button_state(evt.target, 0)
      else this.__set_button_state(evt.target, 1)
    }
    for (let i = 0; i < 9; ++i) {
      this.inputs[i].checked = false
      this.inputs[i].onclick = btfn
    }

    // 기상시각 입력기
    new Picker(this.inputs[9], {
      format: 'HH:mm',
      headers: true,
      text: {
        title: '',
      },
    })

    // 취침시각 입력기
    new Picker(this.inputs[10], {
      format: 'HH:mm',
      headers: true,
      text: {
        title: '',
      },
    })

    // 최소주기 입력기
    new Picker(this.inputs[11], {
      format: 'HH:mm',
      headers: true,
      text: { title: '' },
    })

    // 최대주기 입력기
    new Picker(this.inputs[12], {
      format: 'HH:mm',
      headers: true,
      text: { title: '' },
    })
  }

  init(max_level) {
    for (let lv = 1; lv <= max_level; ++lv) {
      const option = document.createElement('option')
      option.value = `${lv}`
      option.innerText = `${lv}`

      if (lv === max_level) option.selected = true

      this.open_level.appendChild(option)
    }
  }

  /**
   * cfg를 UI에 적용한다.
   * @param {Config} cfg
   */
  update(cfg) {
    // 최적화하려는 자원 비가 0이 아니면 하이라이트한다.
    for (let i = 0; i < 9; ++i) {
      this.__set_button_state(this.inputs[i], cfg.ratio[i])
    }

    // 원래 수면시간은 timeline으로부터 추정하는 것이 불가능하다.
    // 그렇다고 이상한 값을 넣어놓으면 문제가 생기므로, 가장 간격이
    // 긴 두 시각을 수면시각으로 반영한다.
    if (cfg.timeline.length == 0) {
      this.inputs[9].value = '00:00'
      this.inputs[10].value = '00:00'
    } else if (cfg.timeline.length == 1) {
      this.inputs[9].value = Util.integer_to_hhmm(cfg.timeline[0])
      this.inputs[10].value = this.inputs[9].value
    } else {
      let maxidx = -1
      let maxitv = -1
      for (let i = 0; i < cfg.timeline.length; ++i) {
        let newitv =
          cfg.timeline[(i + 1) % cfg.timeline.length] -
          cfg.timeline[i] +
          1440 * Math.floor((i + 1) / cfg.timeline.length)
        if (maxitv < newitv) {
          maxidx = i
          maxitv = newitv
        }
      }
      this.inputs[10].value = Util.integer_to_hhmm(cfg.timeline[maxidx])
      this.inputs[9].value = Util.integer_to_hhmm(
        cfg.timeline[(maxidx + 1) % cfg.timeline.length]
      )
    }

    // 최소주기/최대주기를 config에서 불러온다.
    this.inputs[11].value = Util.integer_to_hhmm(cfg.min_time)
    this.inputs[12].value = Util.integer_to_hhmm(cfg.max_time)

    // 전역 정보를 반영한다.
    this.open_level.selectedIndex = cfg.max_level - 1
    this.inputs[13].checked = cfg.min_level === 0
  }

  // UI 정보를 읽어서 Config로 반환한다.
  fetch() {
    let precfg = {}

    // 인탄식부의 비율을 설정한다.
    // 만약 부품이 단독으로 들어있는 경우 비율을 1로 정하며
    // 부품과 다른 자원이 섞여있는 경우 부품비는 0.5로 정한다.
    precfg.ratio = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    let partonly = true
    for (let i = 0; i < 4; ++i) {
      if (this.inputs[i].checked) {
        if (i < 3 || partonly) {
          partonly = false
          precfg.ratio[i] = 1
        } else {
          precfg.ratio[i] = 0.5
        }
      }
    }

    // 기타 계약권의 비율을 설정한다.
    for (let i = 4; i < 9; ++i)
      if (this.inputs[i].checked) precfg.ratio[i] = Algorithm.CONTRACTION_MID

    // 시간표를 만든다. 기상시각 ~ 취침시각 이내로 1시간 반복.
    precfg.timeline = []
    let time = Util.hhmm_to_integer(this.inputs[9].value)
    let etime = Util.hhmm_to_integer(this.inputs[10].value)
    let flag = etime == time
    if (etime <= time) etime += 1440
    while (time <= etime) {
      // 취침시각과 기상시각이 같은 경우, 잠을 자지
      // 않는다고 가정한다. 이때 같은 시각이 두 번
      // 나오게 되는데 이를 막기 위함이다.
      if (flag && time == etime) break
      precfg.timeline.push(time % 1440)
      time += 60
    }
    precfg.timeline.sort((a, b) => {
      return a - b
    })

    // 최소주기/최대주기를 설정한다.
    precfg.min_time = Util.hhmm_to_integer(this.inputs[11].value)
    precfg.max_time = Util.hhmm_to_integer(this.inputs[12].value)

    // 전역 레벨을 설정한다.
    precfg.max_level = this.open_level.selectedIndex + 1
    precfg.min_level = this.inputs[13].checked ? 0 : 1

    return new Config(precfg)
  }

  __set_button_state(bt, val) {
    if (val == 0) {
      bt.checked = false
      bt.style.backgroundColor = VMEasy.COLOR_IDLE
    } else {
      bt.checked = true
      bt.style.backgroundColor = VMEasy.COLOR_SELECTED
    }
  }
}

VMEasy.COLOR_IDLE = '#FFFFFF'
VMEasy.COLOR_SELECTED = '#FDB300'
