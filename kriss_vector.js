'use strict'
// [name, interval, [manpower, ammo, ration, parts, quick_restore, quick_develop, doll, equipment, gatcha]]
let V = [
	['0-1' , 50  , [0   , 145 , 145 , 0   , 0.5, 0.5, 0  , 0  , 0]],
	['0-2' , 650 , [550 , 0   , 0   , 350 , 0  , 0  , 1  , 0  , 0]],
	['0-3' , 720 , [75  , 75  , 75  , 20  , 0.5, 0  , 0  , 0.5, 0]],
	['0-4' , 1440, [40  , 120 , 60  , 0   , 0  , 0  , 0  , 0  , 1]],
	['1-1' , 15  , [10  , 30  , 15  , 0   , 0  , 0  , 0  , 0  , 0]],
	['1-2' , 30  , [0   , 40  , 60  , 0   , 0  , 0  , 0  , 0  , 0]],
	['1-3' , 60  , [30  , 0   , 30  , 10  , 1  , 0  , 0  , 0  , 0]],
	['1-4' , 120 , [160 , 160 , 0   , 0   , 0  , 0  , 1  , 0  , 0]],
	['2-1' , 40  , [100 , 0   , 0   , 30  , 0  , 0  , 0  , 0  , 0]],
	['2-2' , 90  , [60  , 200 , 80  , 0   , 1  , 0  , 0  , 0  , 0]],
	['2-3' , 240 , [10  , 10  , 10  , 230 , 0.5, 0.5, 0  , 0  , 0]],
	['2-4' , 360 , [0   , 250 , 600 , 60  , 0  , 0  , 1  , 0  , 0]],
	['3-1' , 20  , [50  , 0   , 75  , 0   , 0  , 0  , 0  , 0  , 0]],
	['3-2' , 45  , [0   , 120 , 70  , 30  , 0  , 0  , 0  , 0  , 0]],
	['3-3' , 90  , [0   , 300 , 0   , 0   , 0.5, 0.5, 0  , 0  , 0]],
	['3-4' , 300 , [0   , 0   , 300 , 300 , 0  , 0  , 0.5, 0.5, 0]],
	['4-1' , 60  , [0   , 185 , 185 , 0   , 0  , 0  , 0  , 1  , 0]],
	['4-2' , 120 , [0   , 0   , 0   , 210 , 0  , 1  , 0  , 0  , 0]],
	['4-3' , 360 , [800 , 550 , 0   , 0   , 0.5, 0  , 0.5, 0  , 0]],
	['4-4' , 480 , [400 , 400 , 400 , 150 , 0  , 1  , 0  , 0  , 0]],
	['5-1' , 30  , [0   , 0   , 100 , 45  , 0  , 0  , 0  , 0  , 0]],
	['5-2' , 150 , [0   , 600 , 300 , 0   , 1  , 0  , 0  , 0  , 0]],
	['5-3' , 240 , [800 , 400 , 400 , 0   , 0  , 0  , 0  , 1  , 0]],
	['5-4' , 420 , [100 , 0   , 0   , 700 , 0  , 0  , 1  , 0  , 0]],
	['6-1' , 120 , [300 , 300 , 0   , 100 , 0  , 0  , 0  , 0  , 0]],
	['6-2' , 180 , [0   , 200 , 550 , 100 , 0.5, 0.5, 0  , 0  , 0]],
	['6-3' , 300 , [0   , 0   , 200 , 500 , 0  , 0  , 0  , 1  , 0]],
	['6-4' , 720 , [800 , 800 , 800 , 0   , 0  , 0  , 0  , 0  , 1]],
	['7-1' , 150 , [650 , 0   , 650 , 0   , 0  , 0  , 0  , 0  , 0]],
	['7-2' , 240 , [0   , 650 , 0   , 300 , 0.5, 0  , 0.5, 0  , 0]],
	['7-3' , 330 , [900 , 600 , 600 , 0   , 0  , 0  , 0  , 1  , 0]],
	['7-4' , 480 , [250 , 250 , 250 , 600 , 0  , 1  , 0  , 0  , 0]],
	['8-1' , 60  , [150 , 150 , 150 , 0   , 0  , 0  , 0  , 1  , 0]],
	['8-2' , 180 , [0   , 0   , 0   , 450 , 1  , 0  , 0  , 0  , 0]],
	['8-3' , 360 , [400 , 800 , 800 , 0   , 0.5, 0.5, 0  , 0  , 0]],
	['8-4' , 540 , [1500, 400 , 400 , 100 , 0  , 0  , 1  , 0  , 0]],
	['9-1' , 30  , [0   , 0   , 100 , 50  , 0  , 0  , 0  , 0  , 0]],
	['9-2' , 90  , [180 , 0   , 180 , 100 , 0  , 1  , 0  , 0  , 0]],
	['9-3' , 390 , [750 , 750 , 0   , 0   , 0  , 0  , 1  , 0  , 0]],
	['9-4' , 630 , [500 , 900 , 900 , 0   , 0  , 0  , 0  , 1  , 0]],
	['10-1', 40  , [140 , 200 , 0   , 0   , 0  , 0  , 0  , 0  , 0]],
	['10-2', 100 , [0   , 240 , 180 , 0   , 0  , 0.5, 0.5, 0  , 0]],
	['10-3', 320 , [0   , 480 , 480 , 300 , 0.5, 0.5, 0  , 0  , 0]],
	['10-4', 600 , [660 , 660 , 660 , 330 , 0  , 0  , 0  , 1  , 0]],
	['11-1', 240 , [350 , 1050, 0   , 0   , 0  , 0  , 0.5, 0.5, 0]],
	['11-2', 240 , [360 , 540 , 540 , 0   , 0  , 0  , 1  , 0  , 0]],
	['11-3', 480 , [0   , 750 , 1500, 250 , 1  , 0  , 0  , 0  , 0]],
	['11-4', 600 , [0   , 1650, 0   , 900 , 0  , 1  , 0  , 0  , 0]]
];

let r = [1, 1, 1, 0.5];

/**
	g	a kriss vector
	r 	yet another kriss vector

	return 
*/
function inner(g, r) {
	let sum = 0;
	for(let i = 0; i < g.length; ++i) {
		sum += g[i] * r[i];
	}
	return sum;
}

/**
	return [list[k], k] which minimize fn(list[k], k).
	it costs O(n * alpha) where alpha is maximum time
	complexity of evaluating an element.
*/
function argmin(list, fn) {
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
function efficiency(p, T, do_loop) {
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
		tc = argmin(feasible, function(el, idx) { return el + p; })[0];
		if(do_loop) {
			tc = tc % tl;
		}
	}

	//
	// TODO <--------- 하루에 한 번 돌리는 상태에서
	// 반복/미반복 했을 때 주기가 2회로 표시되는 현상 수정

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
function profile(V, r, T, do_loop) {
	let eff;
	if(inner(r, r) == 0) {
		return V.map(v => [v, (eff = efficiency(v[1], T, do_loop), 
			inner(v[2], v[2]) * eff[0] / eff[1]), eff[0], eff[1]]);
	} else {
		return V.map(v => [v, (eff = efficiency(v[1], T, do_loop), 
			inner(v[2], r) * eff[0] / eff[1]), eff[0], eff[1]]);
	}
}

/**
	V	list of logistic support infos
	p(v) 	priority of v

	return sorted Vp using similarity vector as r.
	Vp	list of [v∈V, p(v)∈Z]
*/
function sort(Vp) {
	return Vp.sort(function(a, b) {
		return b[1] - a[1];
	});
}