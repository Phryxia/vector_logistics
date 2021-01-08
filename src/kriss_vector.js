'use strict';

/**
 * 최적화 알고리즘에 관련된 클래스
 */
class Algorithm {
	constructor() {
		// [작전명, 소요시간, [인, 탄, 식, 부, 쾌속수복, 쾌속제조, 인형제조, 장비제조, 구매토큰]]
		// thank you for: https://tempkaridc.github.io/gf/js/GF.js
		// and mikboongi
		//
		// region 12 reference: https://gall.dcinside.com/mgallery/board/view/?id=micateam&no=1362264
		// since it's not revised by me, information can be changed.
		// Note that probability of drop rate of 12 region hasn't been verified.
		this.V = [
			['0-1' , 50  , [0   , 145 , 145 , 0   , 0.5, 0.2, 0  , 0  , 0]],
			['0-2' , 180 , [550 , 0   , 0   , 350 , 0  , 0  , 0.5, 0  , 0]],
			['0-3' , 720 , [900 , 900 , 900 , 250 , 0.4, 0  , 0  , 0.4, 0]],
			['0-4' , 1440, [0   , 1200, 800 , 700 , 0  , 0  , 0  , 0  , 1]],
			['1-1' , 15  , [10  , 30  , 15  , 0   , 0  , 0  , 0  , 0  , 0]],
			['1-2' , 30  , [0   , 40  , 60  , 0   , 0  , 0  , 0  , 0  , 0]],
			['1-3' , 60  , [30  , 0   , 30  , 10  , 0.6, 0  , 0  , 0  , 0]],
			['1-4' , 120 , [160 , 160 , 0   , 0   , 0  , 0  , 0.2, 0  , 0]],
			['2-1' , 40  , [100 , 0   , 0   , 30  , 0  , 0  , 0  , 0  , 0]],
			['2-2' , 90  , [60  , 200 , 80  , 0   , 0.3, 0  , 0  , 0  , 0]],
			['2-3' , 240 , [10  , 10  , 10  , 230 , 0.5, 0.5, 0  , 0  , 0]],
			['2-4' , 360 , [0   , 250 , 600 , 60  , 0  , 0  , 0.8, 0  , 0]],
			['3-1' , 20  , [50  , 0   , 75  , 0   , 0  , 0  , 0  , 0  , 0]],
			['3-2' , 45  , [0   , 120 , 70  , 30  , 0  , 0  , 0  , 0  , 0]],
			['3-3' , 90  , [0   , 300 , 0   , 0   , 0.45, 0.4, 0  , 0  , 0]],
			['3-4' , 300 , [0   , 0   , 300 , 300 , 0  , 0  , 0.35, 0.4, 0]],
			['4-1' , 60  , [0   , 185 , 185 , 0   , 0  , 0  , 0  , 0.2, 0]],
			['4-2' , 120 , [0   , 0   , 0   , 210 , 0  , 0.5, 0  , 0  , 0]],
			['4-3' , 360 , [800 , 550 , 0   , 0   , 0.3, 0  , 0.7, 0  , 0]],
			['4-4' , 480 , [400 , 400 , 400 , 150 , 0  , 1  , 0  , 0  , 0]],
			['5-1' , 30  , [0   , 0   , 100 , 45  , 0  , 0  , 0  , 0  , 0]],
			['5-2' , 150 , [0   , 600 , 300 , 0   , 0.8, 0  , 0  , 0  , 0]],
			['5-3' , 240 , [800 , 400 , 400 , 0   , 0  , 0  , 0  , 0.5, 0]],
			['5-4' , 420 , [100 , 0   , 0   , 700 , 0  , 0  , 0.4, 0  , 0]],
			['6-1' , 120 , [300 , 300 , 0   , 100 , 0  , 0  , 0  , 0  , 0]],
			['6-2' , 180 , [0   , 200 , 550 , 100 , 0.5, 0.2, 0  , 0  , 0]],
			['6-3' , 300 , [0   , 0   , 200 , 500 , 0  , 0  , 0  , 0.6, 0]],
			['6-4' , 720 , [800 , 800 , 800 , 0   , 0  , 0  , 0  , 0  , 0.8]],
			['7-1' , 150 , [650 , 0   , 650 , 0   , 0  , 0  , 0  , 0  , 0]],
			['7-2' , 240 , [0   , 650 , 0   , 300 , 0.3, 0  , 0.7, 0  , 0]],
			['7-3' , 330 , [900 , 600 , 600 , 0   , 0  , 0  , 0  , 0.7, 0]],
			['7-4' , 480 , [250 , 250 , 250 , 600 , 0  , 0.8, 0  , 0  , 0]],
			['8-1' , 60  , [150 , 150 , 150 , 0   , 0  , 0  , 0  , 0.4, 0]],
			['8-2' , 180 , [0   , 0   , 0   , 450 , 0.8, 0  , 0  , 0  , 0]],
			['8-3' , 360 , [400 , 800 , 800 , 0   , 0.3, 0.6, 0  , 0  , 0]],
			['8-4' , 540 , [1500, 400 , 400 , 100 , 0  , 0  , 0.9, 0  , 0]],
			['9-1' , 30  , [0   , 0   , 100 , 50  , 0  , 0  , 0  , 0  , 0]],
			['9-2' , 90  , [180 , 0   , 180 , 100 , 0  , 0.25, 0  , 0  , 0]],
			['9-3' , 390 , [750 , 750 , 0   , 0   , 0  , 0  , 0.7, 0  , 0]],
			['9-4' , 630 , [500 , 900 , 900 , 0   , 0  , 0  , 0  , 1  , 0]],
			['10-1', 40  , [140 , 200 , 0   , 0   , 0  , 0  , 0  , 0  , 0]],
			['10-2', 100 , [0   , 240 , 180 , 0   , 0  , 0.25, 0.75, 0  , 0]],
			['10-3', 320 , [0   , 480 , 480 , 300 , 0.5, 0.3, 0  , 0  , 0]],
			['10-4', 600 , [660 , 660 , 660 , 330 , 0  , 0  , 0  , 0.9, 0]],
			['11-1', 240 , [350 , 1050, 0   , 0   , 0  , 0  , 0.5, 0.5, 0]],
			['11-2', 240 , [360 , 540 , 540 , 0   , 0  , 0  , 1  , 0  , 0]],
			['11-3', 480 , [0   , 750 , 1500, 250 , 0.5, 0  , 0  , 0  , 0]],
			['11-4', 600 , [0   , 1650, 0   , 900 , 0  , 1  , 0  , 0  , 0]],
			['12-1', 60  , [0   , 220 , 220 , 0   , 0  , 0  , 0  , 0.5, 0]],
			['12-2', 90  , [360 , 0   , 0   , 120 , 0  , 0  , 0  , 0  , 0]],
			['12-3', 540 , [800 , 1200, 1200, 0   , 0  , 1  , 0  , 0  , 0]],
			['12-4', 720 , [1800, 0   , 1800, 0   , 0  , 0  , 1  , 0  , 0]],
			['13-1', 180 , [0   , 0   , 1200, 0   , 0  , 1  , 0  , 0  , 0]],
			['13-2', 360 , [800 , 800 , 800 , 300 , 0  , 0  , 0  , 0  , 0]],
			['13-3', 1440, [0   , 4000, 0   , 1200, 0  , 0  , 0  , 1  , 0]],
			['13-4', 360 , [0   , 0   , 0   , 1000, 0  , 0  , 1  , 0  , 0]]
		];

		this.lambda = 80000;
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
		console.assert(config instanceof Config);
		
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
 * 이름이 Controller지만 사실 View와 붙어있는 몹쓸 클래스다.
 * TODO: 뷰를 뜯어낼 수 없을까?
 */
class AlgorithmController {
	constructor(cfgctr, algorithm) {
		console.assert(cfgctr instanceof ConfigController);
		console.assert(algorithm instanceof Algorithm);
		this.cfgctr = cfgctr;
		this.algorithm = algorithm;
		this.dom = {
			result: document.getElementById('div-result'),
			compute: document.getElementById('bt-compute'),
			tables: []
		};

		let algctr = this;
		this.dom.compute.onclick = function(evt) {
			algctr.run();
		};

		// create table
		this.K = 4;
		for(let k = 0; k < this.K; ++k) {
			let tb = this.__create_table();
			let tbtitle = document.createElement('h2');
			tbtitle.setAttribute('name', 'lang-22');
			tbtitle.setAttribute('id', 'tbtitle-'+k);
			this.dom.result.appendChild(tbtitle).innerHTML = LanguageManager.instance.get_word(22) + ' ' + (k+1);
			this.dom.tables.push(tb);
			this.dom.result.appendChild(tb);
			this.dom.result.appendChild(document.createElement('br'));
		}
	}

	/**
	 * 현재 ConfigController가 가지고 있는 Config로 알고리즘을 수행한다.
	 */
	run() {
		this.result = this.algorithm.optimize2(this.cfgctr.fetch());
		this.update_dom();
	}

	update_dom() {
		this.dom.result.style.display = 'block';
		
		for(let k = 0; k < this.K; ++k) {
			if(this.result[k]) {
				this.__update_table(this.result[k], this.dom.tables[k]);
				document.getElementById('tbtitle-' + k).style.display = 'block';
				this.dom.tables[k].style.display = 'block';
			}
			else {
				document.getElementById('tbtitle-' + k).style.display = 'none';
				this.dom.tables[k].style.display = 'none';
			}
		}
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
	__special_drop_img(category) {
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

	/*
		Output
			HTMLTableElement having 4 rows and 1 header row 
	*/
	__create_table() {
		// create table dom
		let table = document.createElement('table');
		table.style.width = '100%';
		table.style.display = 'block';
		table.className = 'tb_result';
		table.style.marginTop = '10px';

		// create table head row
		let row = table.appendChild(document.createElement('tr'));
		for(let i = 0; i < 7; ++i)
			row.appendChild(document.createElement('th'))
				.style.width = '60px';

		// operation
		row.cells[0].setAttribute('name', 'lang-23');
		
		// period
		row.cells[1].setAttribute('name', 'lang-24');

		// resource & additional items
		for(let i = 2; i <= 6; ++i) {
			let txt;
			txt = row.cells[i].appendChild(document.createElement('text'));
			txt.setAttribute('name', 'lang-' + (23 + i));
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
				txt.setAttribute('name', 'lang-31');
				txt = div.appendChild(document.createElement('text'));
				txt.innerHTML = '/';
				txt = div.appendChild(document.createElement('text'));
				txt = div.appendChild(document.createElement('text'));
				txt.setAttribute('name', 'lang-32');
			}

			// styling
			row.cells[0].style.textAlign = 'center';
			row.cells[1].style.textAlign = 'center';
			row.cells[2].style.paddingRight = '5px';
		}

		// summary line styling
		row.cells[0].setAttribute('name', 'lang-30');
		row.cells[0].colSpan = '2';
		row.cells[1].style.textAlign = 'left';

		return table;
	}

	/*
		Input
			g = [v1, v2, ...] where vk ∈ Vf for k = 1, 2, ...
			tb ∈ HTMLTableElement, the place to write given record
	*/
	__update_table(g, tb) {
		// add the records
		let vsum = [0, 0, 0, 0];
		for(let n = 0; n < g.length; ++n) {
			let tr = tb.rows[n + 1];
			if(g[n]) {
				let v = g[n][0];
				let rate = g[n][2] / g[n][3];

				// mission name
				tr.cells[0].innerHTML = v[0];
				
				// time
				tr.cells[1]
					.childNodes[0]
					.childNodes[0]
					.innerHTML = integer_to_hhmm(v[1]);

				tr.cells[1]
					.childNodes[1]
					.childNodes[0]
					.innerHTML = g[n][2] + '';

				tr.cells[1]
					.childNodes[1]
					.childNodes[3]
					.innerHTML = g[n][3] + '';

				// resources
				for(let t = 0; t < 4; ++t) {
					tr.cells[2 + t].innerHTML = Math.floor(v[2][t] * rate);
					vsum[t] += v[2][t] * rate;
				}

				// special drops
				tr.cells[6].innerHTML = '';
				let first = true;
				for(let i = 0; i < 5; ++i) {
					if(v[2][4 + i] != 0) {
						if(first)
							first = false;
						else
							tr.cells[6].innerHTML += '<font size="1"> or </font>';
						tr.cells[6].innerHTML += this.__special_drop_img(i);
					}
				}
				if(!first)
					tr.cells[6].innerHTML += '<span class=\'smalltext\'>x' + g[n][2] + '</span>';
			} else {
				// When there is no result
				for(let i = 0; i < 7; ++i)
					tr.cells[i].innerHTML = '-';
			}
		}

		// summation
		for(let t = 0; t < 4; ++t)
			tb.rows[g.length + 1].cells[1 + t].innerHTML = Math.floor(vsum[t]);
	}
}