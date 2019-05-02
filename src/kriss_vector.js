'use strict';
class Algorithm {
	constructor() {
		// [name, interval, [manpower, ammo, ration, parts, quick_restore, quick_develop, doll, equipment, gatcha]]
		// thank you for: https://tempkaridc.github.io/gf/js/GF.js
		// and mikboongi
		this.V = [
			['0-1' , 50  , [0   , 145 , 145 , 0   , 0.5, 0.2, 0  , 0  , 0]],
			['0-2' , 180 , [550 , 0   , 0   , 350 , 0  , 0  , 0.5, 0  , 0]],
			['0-3' , 720 , [75  , 75  , 75  , 20  , 0.4, 0  , 0  , 0.4, 0]],
			['0-4' , 1440, [40  , 120 , 60  , 0   , 0  , 0  , 0  , 0  , 1]],
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
			['11-4', 600 , [0   , 1650, 0   , 900 , 0  , 1  , 0  , 0  , 0]]
		];

		this.lambda = 100000;
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
		Use this outside as interface.

		Output is Vp: [v∈V, p(v)∈R, c(v)∈Z+, d(v)∈Z+]
		where p(v) is priority of v
		      c(v) is total number of arrivals of v in period
		      d(v) is period in day of arrivals of v.
	*/
	// optimize(config) {
	// 	assert(!!config && config instanceof Config);

	// 	let Vf = this.V.filter(function(v) {
	// 		// Get the level of given logistic support
	// 		let lv = parseInt(v[0].match(/^[0-9]{1,2}/)[0]);
	// 		return config.get_min_time() <= v[1] && v[1] <= config.get_max_time()
	// 			&& config.get_min_level() <= lv && lv <= config.get_max_level();
	// 	});

	// 	// Load resource ratio vector
	// 	return this.sort(this.profile(
	// 		Vf, 
	// 		config.get_ratio(true), 
	// 		config.get_timeline(), 
	// 		config.get_daily_loop()
	// 	));
	// }

	/**
		Let s := v1 + v2 + ... + v4
		Maximize ||proj(s, r)|| + λ * cos θ 
		where θ is angle between s, r

		optimize(config) 함수는 ||proj(s, r)||의 lower bound를
		최대화하는 greedy한 알고리즘을 사용했다.

		optimize2(config) 함수는 nC4개의 군수 조합을 전수검사하여
		수정된 목적함수를 최적화하여, 상위 k개의 조합을 반환한다.
		시간 복잡도는 O(n^4)이다.

		Output: [v1, v2, v3, v4]
		where vk ∈ Vf
	*/
	optimize2(config) {
		assert(config instanceof Config);
		
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

		let best_group = [[null, 0], [null, 0], [null, 0], [null, 0]];	
		this._optimize2(Vf, r, this.inner(r, r) == 0, [], best_group);

		// return best selection
		best_group = best_group.filter(g => g[0] != null);
		best_group = best_group.sort((ga, gb) => gb[1] - ga[1]);
		return best_group.map(g => (g[0].map(idx => Vf[idx])));
	}

	_optimize2(Vf, r, is_zero_rate, path, best_group) {
		assert(Vf != null);
		assert(r != null);
		assert(path != null);
		assert(best_group != null);

		// update score
		if(path.length >= 4) {
			// compute current score
			let vsum = [];
			for(let i = 0; i < r.length; ++i) {
				vsum[i] = 0.0;
				for(let n = 0; n < 4; ++n)
					vsum[i] += Vf[path[n]][1][i];
			}

			let score_len = (is_zero_rate ? this.inner(vsum, vsum) : this.inner(vsum, r));
			let score_cos = this.inner(vsum, r, 4) / Math.sqrt(this.inner(vsum, vsum, 4));
			let score = score_len + this.lambda * score_cos;

			// search for minimum score
			let min_idx = -1;
			for(let i = 0; i < best_group.length; ++i)
				if(best_group[i][1] < score && 
					(min_idx == -1 
					|| best_group[min_idx][1] > best_group[i][1])) {
					min_idx = i;
				}

			// override current option
			if(min_idx >= 0) {
				best_group[min_idx][0] = path.slice();
				best_group[min_idx][1] = score;
			}
		} else {
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

class AlgorithmController {
	constructor(cfgctr, algorithm) {
		assert(cfgctr instanceof ConfigController);
		assert(algorithm instanceof Algorithm);
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
			this.dom.result.appendChild(document.createElement('h2')).innerHTML = '추천 ' + (k+1);
			this.dom.tables.push(tb);
			this.dom.result.appendChild(tb);
			this.dom.result.appendChild(document.createElement('br'));
		}
	}

	run() {
		//this.Vp = this.algorithm.optimize(this.cfgctr.config);
		this.result = this.algorithm.optimize2(this.cfgctr.config);
		this.update_dom();
	}

	__special_drop_img(category) {
		let out = '<img width="20px" src="';
		switch(category) {
			case 0: out += './img/quick_reinforce.png'; break;
			case 1: out += './img/quick_develop.png'; break;
			case 2: out += './img/iop_contract.png'; break;
			case 3: out += './img/equip_contract.png'; break;
			case 4: out += './img/furniture_coin.png'; break;
			default: throw 'illegal special drop category: ' + category; break;
		}
		out += '" />';
		return out;
	}

	update_dom() {
		this.dom.result.style.display = 'block';
		for(let k = 0; k < this.K; ++k)
			this.__update_table(this.result[k], this.dom.tables[k]);
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
		for(let i = 0; i < AlgorithmController.TABLE_HEAD_NAME.length; ++i) {
			let th = row.appendChild(document.createElement('th'));
			th.innerHTML = AlgorithmController.TABLE_HEAD_NAME[i];
			th.style.width = AlgorithmController.TABLE_HEAD_SIZE[i] + 'px';
		}

		// create record rows
		// last line is for summary
		for(let i = 0; i < 5; ++i) {
			row = table.appendChild(document.createElement('tr'));
			for(let c = 0; c < table.rows[0].cells.length; ++c) {
				let td = row.appendChild(document.createElement('td'));
			}

			// styling
			row.cells[0].style.textAlign = 'center';
			row.cells[1].style.textAlign = 'center';
			row.cells[2].style.paddingRight = '5px';
		}

		// summary line styling
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
				let tmpstr = integer_to_hhmm(v[1]) + '<br><font size=1>';
				
				// period
				if(this.cfgctr.config.get_daily_loop())
					tmpstr += g[n][2] + '회/' + g[n][3] + '일';
				else
					tmpstr += g[n][2] + '회';
				tmpstr += '</font>';
				tr.cells[1].innerHTML = tmpstr;

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

		// summary
		tb.rows[g.length + 1].cells[0].innerHTML = '총합';
		for(let t = 0; t < 4; ++t) {
			tb.rows[g.length + 1].cells[1 + t].innerHTML = Math.floor(vsum[t]);
		}
	}
}

AlgorithmController.TABLE_HEAD_NAME = [
	'작전',
	'주기',
	'인력<span class=\'smalltext\'>/24h</span>',
	'탄약<span class=\'smalltext\'>/24h</span>',
	'식량<span class=\'smalltext\'>/24h</span>',
	'부품<span class=\'smalltext\'>/24h</span>',
	'기타도구<span class=\'smalltext\'>/24h</span>'
];

AlgorithmController.TABLE_HEAD_SIZE = [
	60, 60, 60, 60, 60, 60, 100
];