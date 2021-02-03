import { Util } from './util.js';
import { LanguageManager } from './lang.js';

/**
 * 최적화 알고리즘에 관련된 클래스
 */
export class Algorithm {
	constructor() {
		// [작전명, 소요시간, [인, 탄, 식, 부, 쾌속수복, 쾌속제조, 인형제조, 장비제조, 구매토큰]]
		// thank you for: https://tempkaridc.github.io/gf/js/GF.js and 밐붕이
		this.V = null;

		// 랭크 알고리즘에 코사인 유사도를 얼마나 반영할 지의 상수
		this.lambda = 80000;
	}

	/**
	 * /src/operation.json에서 불러온 데이터의 .data를 넣으면 됨
	 * @param {*} V 
	 */
	init(V) {
		this.V = V;
	}

	/**
		g	a kriss vector
		r 	yet another kriss vector
		bnd masking length. default is g.length.

		return 
	*/
	inner(g, r, bnd) {
		bnd = (bnd === undefined ? g.length : bnd);
		let sum = 0;
		for(let i = 0; i < bnd; ++i) {
			sum += g[i] * r[i];
		}
		return sum;
	}

	/**
		return [list[k], k] which minimize fn(list[k], k).
		it costs O(n * alpha) where alpha is maximum time
		complexity of evaluating an element.
	*/
	argmin(list, fn) {
		if(list.length == 0) {
			throw 'empty list cannot be evaluated'
		}
		let minval = null;
		let minidx = null;
		for(let i = 0; i < list.length; ++i) {
			let temp = fn(list[i], i);
			if(minval === null || minval > temp) {
				minval = temp;
				minidx = i;
			}
		}
		return [list[minidx], minidx];
	}

	/**
		return [count, period] when given logistic support(having its
		period as p) starts to loop. For general purpose, use output
		like count/period.

		For example, let p = 7 and T = [6, 10, 20].
		By starting 6, orbit is formed as [6, 20, 10, 20, 10, 20, ...].
		Therefore efficiency of this is 2 supports per day.

		Note that every arbitrary start point and period
		always converge into loop. This is because every receive
		time point is connected to other one.
	*/
	efficiency(p, T, do_loop) {
		// 24 hour * 60 min
		let tl = 1440;
		let Tp = T.slice();
		if(do_loop) {
			// create second day's time.
			// this is because some very long logistic support
			// can cross a day. For example, consider 10 hours
			// support which has been started at 18:00. The arrival
			// is 28:00 = 4:00 of the next day.
			let len = Tp.length;
			for(let i = 0; i < len; ++i) {
				Tp.push(Tp[i] + tl);
			}
		} else {
			// When loop is disabled, the order of timeline
			// should be cared. When T[k] > T[k + 1], this
			// means that it is the next day's time.
			let bias = 0;
			for(let i = 0; i < Tp.length; ++i) {
				if(i > 0 && Tp[i - 1] >= Tp[i] + bias) {
					bias += tl;
				}
				Tp[i] += bias;
			}
		}

		// simulate the loop
		let tc = Tp[0]; // time current
		let orbit = [];
		while(orbit.indexOf(tc) == -1) {
			orbit.push(tc);

			// Find the next arrival.
			let feasible = Tp.filter(t => tc + p <= t && t <= tc + tl);
			if(feasible.length == 0) {
				break;
			}
			tc = this.argmin(feasible, function(el, idx) { return el + p; })[0];
			if(do_loop) {
				tc = tc % tl;
			}
		}

		if(do_loop) {
			// At this point, tc is the start point of loop.
			// Now, let's count the days of loop. Since maximum logistic
			// period is 24 hours, receive interval cannot be longer than 48 hours.
			//
			// So if orbit[k] > orbit[k + 1], it must cost one day between two points.
			// More interesting fact is, it's converse is also true.
			//
			// ex) orbit = [18:00, 10:00, 16:00] -> cost two days
			let day = 1;
			for(let i = orbit.indexOf(tc); i < orbit.length - 1; ++i) {
				if(orbit[i] > orbit[i + 1]) {
					day += 1;
				}
			}
			return [orbit.length - orbit.indexOf(tc), day];
		} else {
			// When daily repeat is disabled, first element of
			// the orbit doesn't represent 'arrival time'.
			return [orbit.length - 1, 1];
		}
	}

	/**
		V	list of logistic support infos
		r 	optimization resource ratio

		return Vp: list of [v∈V, p(v)∈Z] where p(v) is priority of v
	*/
	profile(V, r, T, do_loop) {
		let eff;
		if(this.inner(r, r) == 0) {
			V = V.map(v => [v, (eff = this.efficiency(v[1], T, do_loop), 
				this.inner(v[2], v[2]) * eff[0] / eff[1]), eff[0], eff[1]]);
		} else {
			V = V.map(v => [v, (eff = this.efficiency(v[1], T, do_loop), 
				this.inner(v[2], r) * eff[0] / eff[1]), eff[0], eff[1]]);
		}
		return V.filter(vp => vp[2] > 0);
	}

	/**
		V	list of logistic support infos
		p(v) 	priority of v

		return sorted Vp using similarity vector as r.
		Vp	list of [v∈V, p(v)∈Z]
	*/
	sort(Vp) {
		return Vp.sort(function(a, b) {
			return b[1] - a[1];
		});
	}

	/**
		Let s := v1 + v2 + ... + v4
		Maximize ||proj(s, r)|| + λ * cos θ 
		where θ is angle between s, r

		optimize2(config) 함수는 nC4개의 군수 조합을 전수검사하여
		수정된 목적함수를 최적화하여, 상위 k개의 조합을 반환한다.
		시간 복잡도는 O(n^4)이다.

		Output: [v1, v2, v3, v4]
		where vk ∈ Vf
	*/
	optimize2(config) {
		let self = this;
		let r = config.get_ratio(true);
		let Vf = this.V.filter(function(v) {
			// Get the level of given logistic support
			let lv = parseInt(v[0].match(/^[0-9]{1,2}/)[0]);

			return config.get_min_time() <= v[1] && v[1] <= config.get_max_time()
				&& config.get_min_level() <= lv && lv <= config.get_max_level();
		});

		let eff;
		Vf = Vf.map(v => [
			v, 
			(eff = this.efficiency(v[1], config.get_timeline(), config.get_daily_loop()), 
			this._mult(v[2], eff[0] / eff[1])), 
			eff[0], 
			eff[1]
		]);

		// about ratio mode
		let is_zero_rate;
		if(this.inner(r, r, 4) == 0) {
			is_zero_rate = true;
			r[0] = r[1] = r[2] = r[3] = 1;
		}
		else {
			is_zero_rate = false;
		}

		let best_group = [[null, 0], [null, 0], [null, 0], [null, 0]];	
		this._optimize2(Vf, r, is_zero_rate, [], best_group);

		// return best selection
		best_group = best_group.filter(g => g[0] != null);
		best_group = best_group.sort((ga, gb) => gb[1] - ga[1]);
		return best_group.map(g => (g[0].map(idx => Vf[idx])));
	}

	/**
	 * DFS로 탐색을 하는 재귀함수.
	 * @param {*} Vf 
	 * @param {*} r 
	 * @param {boolean} is_zero_rate 
	 * @param {*} path 
	 * @param {*} best_group 
	 */
	_optimize2(Vf, r, is_zero_rate, path, best_group) {
		console.assert(Vf != null);
		console.assert(r != null);
		console.assert(path != null);
		console.assert(best_group != null);

		// update score
		if(path.length >= 4) {
			// compute current score
			let vsum = [];
			for(let i = 0; i < r.length; ++i) {
				vsum[i] = 0.0;
				for(let n = 0; n < 4; ++n)
					vsum[i] += Vf[path[n]][1][i];
			}

			// check whether some basic resources are
			// zero... (mathematically they are not bad
			// but sementically, they are undesirabled)
			for(let d = 0; d < 4; ++d) {
				if(r[d] > 0 && vsum[d] == 0)
					return;
			}

			let score = this.__score(vsum, r, is_zero_rate);

			// replace worst combination
			let min_idx = -1;
			for(let i = 0; i < best_group.length; ++i) {
				if(best_group[i][0] == null) {
					min_idx = i;
					break;
				}
				else if(best_group[i][1] < score && (
					min_idx == -1 || best_group[min_idx][1] > best_group[i][1])) {
					min_idx = i;
				}
			}

			// override current option
			if(min_idx != -1) {
				best_group[min_idx][0] = path.slice();
				best_group[min_idx][1] = score;
			}
		} else {
			// traverse state space
			let sidx;
			if(path.length == 0)
				sidx = 0;
			else
				sidx = path[path.length - 1] + 1;
			for(let i = sidx; i < Vf.length; ++i) {
				path.push(i);
				this._optimize2(Vf, r, is_zero_rate, path, best_group);
				path.pop();
			}
		}
	}

	/**
	 * 군수작전벡터 v와 최적화벡터 r의 유사도를 반환한다.
	 * @param {number[]}} v 
	 * @param {number[]} r 
	 * @param {boolean} is_zero_rate 
	 */
	__score(v, r, is_zero_rate) {
		if(is_zero_rate) {
			return this.inner(r, v);
		} else {
			// 최적화 비율에서 0인 항목을 제거한 벡터 u, s를 만든다.
			// 예컨데 인탄식부 최적화 비율이 0 0 1 1 이면, 식량과 부품만을 고려한다.
			let u = [];
			let s = [];
			let bnd = 0;
			for(let d = 0; d < r.length; ++d) {
				if(r[d] > 0) {
					u.push(v[d]);
					s.push(r[d]);
					if(d < 4)
						++bnd;
				}
			}

			// 군수작전벡터에서 해당 자원이 0인 경우
			if(this.inner(u, u) == 0)
				return 0;
			// 두 벡터의 내적 + 코사인 유사도 * lambda를 반환한다.
			else {
				let score_len = this.inner(u, s);
				let score_cos = this.inner(u, s, bnd)
					/ Math.sqrt(this.inner(u, u, bnd));
				return score_len + this.lambda * score_cos;
			}	
		}		
	}

	/*
		Input
			c ∈ R
			v ∈ R^n
		
		Output
			c * v (this doesn't change original one)
	*/
	_mult(v, c) {
		let out = [];
		for(let i = 0; i < v.length; ++i)
			out[i] = c * v[i];
		return out;
	}
}

// 쾌속제조 등 계약권의 가중치를 얼마나 줄 것인지에 대한 상수
Algorithm.CONTRACTION_IGNORE = 0;
Algorithm.CONTRACTION_LOW    = 800;
Algorithm.CONTRACTION_MID    = 1400;
Algorithm.CONTRACTION_HIGH   = 2000;

/**
 * 최적화 알고리즘을 돌리고 그에 관련된 뷰를 조작한다.
 */
export class AlgorithmController {
	/**
	 * @param {ConfigController} cfgctr 
	 * @param {Algorithm} algorithm 
	 */
	constructor(cfgctr, algorithm) {
		this.cfgctr = cfgctr;
		this.algorithm = algorithm;
		this.resultView = new ResultView();

		// 계산 버튼을 누르면 알고리즘이 계산을 한다.
		document.getElementById('bt-compute').onclick = (evt) => {
			this.run();
		};
	}

	/**
	 * 현재 ConfigController가 가지고 있는 Config로 알고리즘을 수행한다.
	 */
	run() {
		let result_groups = this.algorithm.optimize2(this.cfgctr.fetch());
		this.resultView.update(result_groups);
	
		// 스크롤!
		document.querySelector('#div-result').scrollIntoView({ behavior: 'smooth' });
	}
}

/**
 * 결과를 보여주는 뷰이다.
 */
export class ResultView {
	constructor() {
		// 표 DOM들을 가지고 있는 루트 div
		this.root_dom = document.getElementById('div-result');
		this.root_dom.className = 'uiblock hide';

		// 표 DOM. 이후 값을 업데이트 할 때 필요
		this.table_doms = [];

		// 표 개수
		this.K = 4;
	}

	init() {
		// 4개의 표를 사전에 만들어둔다.
		for (let k = 0; k < this.K; ++k) {
			// 표
			let tb = this.createTable();

			// 표 제목
			let tbtitle = document.createElement('h2');
			tbtitle.setAttribute('data-lang', 'lang-22');
			tbtitle.setAttribute('id', `tbtitle-${k}`);
			tbtitle.innerHTML = LanguageManager.instance.get_word(22) + ' ' + (k+1);
			
			this.root_dom.appendChild(tbtitle);
			this.root_dom.appendChild(tb);
			this.root_dom.appendChild(document.createElement('br'));

			this.table_doms.push(tb);
		}
	}

	/**
	 * 작전 결과가 들어갈 표를 만들어 반환한다.
	 */
	createTable() {
		// create table dom
		let table = document.createElement('table');

		// create table head row
		let row = table.appendChild(document.createElement('tr'));
		for(let i = 0; i < 7; ++i)
			row.appendChild(document.createElement('th'))
				.style.width = '60px';

		// operation
		row.cells[0].setAttribute('data-lang', 'lang-23');
		
		// period
		row.cells[1].setAttribute('data-lang', 'lang-24');

		// resource & additional items
		for(let i = 2; i <= 6; ++i) {
			let txt;
			txt = row.cells[i].appendChild(document.createElement('text'));
			txt.setAttribute('data-lang', 'lang-' + (23 + i));
			txt = row.cells[i].appendChild(document.createElement('text'));
			txt.style.fontSize = '70%';
			txt.innerHTML = '/24h';
		}
		row.cells[6].style.width = '100px';

		// create record rows
		// last line is for summary
		for(let i = 0; i < 5; ++i) {
			row = table.appendChild(document.createElement('tr'));
			for(let c = 0; c < table.rows[0].cells.length; ++c) {
				let td = row.appendChild(document.createElement('td'));
			}

			if(i < 4)
			{
				// first line for hh:mm representation
				let div, txt;
				div = row.cells[1].appendChild(document.createElement('div'));
				div.appendChild(document.createElement('text'));
				
				// second line for interval representation
				div = row.cells[1].appendChild(document.createElement('div'));
				div.style.fontSize = '70%';
				
				txt = div.appendChild(document.createElement('text'));
				
				txt = div.appendChild(document.createElement('text'));
				txt.setAttribute('data-lang', 'lang-31');

				txt = div.appendChild(document.createElement('text'));
				txt.innerHTML = '/';
				
				txt = div.appendChild(document.createElement('text'));
				
				txt = div.appendChild(document.createElement('text'));
				txt.setAttribute('data-lang', 'lang-32');
			}

			// styling
			row.cells[0].style.textAlign = 'center';
			row.cells[1].style.textAlign = 'center';
			row.cells[2].style.paddingRight = '5px';
		}

		// summary line styling
		row.cells[0].setAttribute('data-lang', 'lang-30');
		row.cells[0].colSpan = '2';
		row.cells[1].style.textAlign = 'left';

		return table;
	}

	/**
	 * result_groups 정보를 뷰에 갱신한다.
	 * @param {*} result_groups 
	 */
	update(result_groups) {
		// 표들이 보이게 만듦
		this.root_dom.className = 'uiblock transition';
		
		// 각각의 조합에 대하여 표를 업데이트한다.
		for(let k = 0; k < this.K; ++k) {
			// 조합의 수가 꼭 4개가 아닐 수 있다.
			if (result_groups[k]) {
				this.updateTable(result_groups[k], k);
				document.getElementById('tbtitle-' + k).style.display = 'block';
				this.table_doms[k].style.display = 'block';
			}
			else {
				document.getElementById('tbtitle-' + k).style.display = 'none';
				this.table_doms[k].style.display = 'none';
			}
		}
	}

	/**
	 * table_id번째 표에 result_groups 정보를 덮어쓴다.
	 * @param {*} result_groups 
	 * @param {number} table_id 
	 */
	updateTable(result_groups, table_id) {
		let tb = this.table_doms[table_id];

		// 자원 합 구할 배열
		let vsum = [0, 0, 0, 0];

		for(let n = 0; n < 4; ++n) {
			let tr = tb.rows[n + 1];

			// 소린이의 경우 4개짜리 유효한 작전 조합이 없을 수도 있다.
			// 그래서 3개짜리나 2개짜리가 들어올 가능성을 대비하여 if문이 있음.
			let group = result_groups[n];
			if (group) {
				// 군수작전벡터
				let operation = group[0];

				// 하루에 군수를 받는 횟수
				let rate = group[2] / group[3];

				// 작전명
				tr.cells[0].innerHTML = operation[0];
				
				// 작전주기
				tr.cells[1]
					.childNodes[0]
					.childNodes[0]
					.innerHTML = Util.integer_to_hhmm(operation[1]);

				// 작전 빈도 (분자)
				tr.cells[1]
					.childNodes[1]
					.childNodes[0]
					.innerHTML = group[2] + '';

				// 작전 빈도 (분모)
				tr.cells[1]
					.childNodes[1]
					.childNodes[3]
					.innerHTML = group[3] + '';

				// 자원
				let resource = operation[2];

				for(let t = 0; t < 4; ++t) {
					tr.cells[2 + t].innerHTML = Math.floor(resource[t] * rate);
					vsum[t] += resource[t] * rate;
				}

				// 기타 재화 (계약권 등)
				tr.cells[6].innerHTML = '';
				let first = true;

				for(let i = 0; i < 5; ++i) {
					// i번째 기타 재화가 존재하는 경우
					if(resource[4 + i] > 0) {
						// 재화가 2개 이상인 경우 'or' 문구 추가해준다.
						if(first)
							first = false;
						else
							tr.cells[6].innerHTML += '<font size="1"> or </font>';

						// 그림 추가
						tr.cells[6].innerHTML += this.createSpecialDropImage(i);
					}
				}

				// 기타 재화가 존재할 경우 하루에 몇 개 벌어오는지
				if(!first)
					tr.cells[6].innerHTML += '<span class=\'smalltext\'>x' + group[2] + '</span>';
			} else {
				// When there is no result
				for(let i = 0; i < 7; ++i)
					tr.cells[i].innerHTML = '-';
			}
		}

		// 자원 합
		for(let t = 0; t < 4; ++t)
			tb.rows[5].cells[1 + t].innerHTML = Math.floor(vsum[t]);
	}

	/**
	 * 기타도구(제조계약 등) 이미지 태그를 반환한다.
	 * category 0: 쾌속수복
	 *          1: 쾌속제조
	 *          2: 인형제조계약
	 *          3: 장비제조계약
	 *          4: 토큰
	 * @param {number} category 
	 */
	createSpecialDropImage(category) {
		let out = '<img width="20px" src="';
		switch(category) {
			case 0: out += './img/quick_reinforce.png'; break;
			case 1: out += './img/quick_develop.png'; break;
			case 2: out += './img/iop_contract.png'; break;
			case 3: out += './img/equip_contract.png'; break;
			case 4: out += './img/furniture_coin.png'; break;
			default: throw 'illegal special drop category: ' + category;
		}
		out += '" />';
		return out;
	}
}