import { Config } from './config.js'
import { LanguageManager } from './lang.js'
import { CookieManager } from './cookie.js'
import { JSONDC } from './jsondc.js'
import { Algorithm, AlgorithmController } from './kriss_vector.js'
import { ConfigController } from './config.js'
import { PresetController } from './presets.js'
import '../styles/style.css'

Config.DEFAULT_CONFIG = new Config({
  timeline: [0],
  ratio: [
    1,
    1,
    1,
    0.5,
    Algorithm.CONTRACTION_IGNORE,
    Algorithm.CONTRACTION_IGNORE,
    Algorithm.CONTRACTION_IGNORE,
    Algorithm.CONTRACTION_IGNORE,
    Algorithm.CONTRACTION_IGNORE,
  ],
  min_time: 0,
  max_time: 1439,
  daily_loop: true,
  min_level: 0,
})

LanguageManager.instance = new LanguageManager()
CookieManager.instance = new CookieManager()

const jsondc = new JSONDC()
const algorithm = new Algorithm()

const cfgctr = new ConfigController()
const preset_ctr = new PresetController(cfgctr)
const algorithm_ctr = new AlgorithmController(cfgctr, algorithm)

// 군수작전 데이터를 불러오고 난 뒤 행동
jsondc.load_json('/operations.json').then((operations) => {
  algorithm.init(operations.data)

  // 최대 군수작전이 몇 지역인지 계산
  let max_lv = 0
  for (let op of algorithm.V) {
    const op_lv = parseInt(op[0].split('-')[0])
    max_lv = Math.max(max_lv, op_lv)
  }

  // 최대 군수작전 지역을 디폴트값으로 설정함
  Config.DEFAULT_CONFIG.max_level = max_lv

  // 얘는 군수작전 데이터에 의존하기 때문에 따로 초기화해줘야 한다.
  cfgctr.vms[0].init(max_lv)
  cfgctr.vms[1].init(max_lv)
})

// 언어 데이터를 불러오고 난 뒤 행동
jsondc.load_json('/localization.json').then((words) => {
  LanguageManager.instance.init(words)

  // 얘는 Language Model에 의존하기 때문에 따로 초기화해줘야 한다.
  algorithm_ctr.resultView.init()

  // 저장된 설정 불러오기
  CookieManager.instance.load_snapshot(cfgctr, preset_ctr)
})
