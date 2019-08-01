'use strict';

let LANG_KO = 0;
let LANG_EN = 1;
let LANG_JP = 2;
//let LANG_CH = 3;
//let LANG_TW = 4;

let WORDS = [
	['군수과장 벡터양!', 'Vector Logistics!', '支援マスター<br>ベクターちゃん!'], // 타이틀
	['"원하는 자원 획득비와 계약권 우선도를 알려주면, 지휘관의 일정에 맞춘 군수 조합을 추천해줄게.'+
	 ' 비율 상관없이 전체 양만 늘리고 싶으면 0:0:0:0으로 입력해줘."',
	 '"If you let me know your wanted resource ratio and weights of contractions, I\'ll recommend'+
	 ' proper combination of logistics under your schedule. If you don\'t care the ratio, just'+
	 ' type 0:0:0:0.',
	 '"欲しい資源の獲得比率とアイテムの重みを教えてくれたら、指揮官のスケジュールに合わせた支援の組み合わせをオススメしてあげる。'+
	 '比率とは関係なくただ全体の量だけ上げたいなら、0:0:0:0で書いてくれ。"'], // 설명
	['<br>- 군수과장 크리스 벡터', '<br>- Kriss Vector, supply officer', '<br>- 支援マスタークリスベクター'],
	['자원설정', 'Resource Setting', '資源設定'],
	['저', 'LOW', '下'],
	['중', 'MID', '中'],
	['고', 'HIGH', '上'],
	['최소<br>주기', 'Min<br>Period', '最短<br>時間'],
	['최대<br>주기', 'Max<br>Period', '最長<br>時間'],
	['전역<br>개방', 'EP<br>Progress', '作戦<br>開放'],
	['0지<br>개방', 'EP0<br>Open', 'EP00<br>開放'],
	['프리셋', 'Preset', 'プリセット'],
	['추가', 'Add', '追加'], // lang-12
	['삭제', 'Del', '削除'],
	['반복일정추가', 'Repeat', '反復日程追加'],
	['확인일정', 'Confirm Schedule', '確認スケジュール'],
	['계산', 'Compute', '計算'],
	['반복을 시작할 시각을 입력하세요. (ex: 11:16)', // lang-17
		'Please enter the start time. (ex: 11:16)', 
		'反復を始める時を入力して下さい。 (ex: 11:16)'],
	['올바른 시각을 입력하세요. (ex: 04:04)',
		'Please enter valid time stamp. (ex: 04:04)',
		'正しい時間を入力して下さい。 (ex: 04:04)'],
	['반복할 주기를 입력하세요. (ex: 11:16)',
		'Please enter the period. (ex: 11:16)',
		'反復周期を入力して下さい。 (ex: 11:16)'],
	['올바른 시간을 입력하세요. (ex: 00:45)',
		'Please enter valid time period. (ex: 00:45)',
		'正しい時間を入力して下さい。 (ex: 00:45)'],
	['반복을 종료할 시각을 입력하세요. (ex: 23:59)',
		'Please enter the end time. (ex: 23:59)',
		'反復を終了する時を入力して下さい。 (ex: 23:59)'],
	['추천', 'Recommendation', 'オススメ'], // lang-22
	['작전', 'Op', '作戦'],
	['주기', 'Period', '周期'],
	['인력', 'Man', '人力'],
	['탄약', 'Ammo', '弾薬'],
	['식량', 'Ration', '配給'],
	['부품', 'Parts', '部品'],
	['기타도구', 'Rewards', '確率報酬'],
	['총합', 'Total', '合計'],
	['회', 'cyc', '回'], // 31
	['일', 'd', '日'],
	['프리셋 이름을 입력하세요',
		'Please enter the name of preset.',
		'プリセットの名前を入力して下さい。'],
	['이름은 최소 1글자 이상이어야 합니다.',
		'Preset name must contain one or more characters.',
		'名前には最小一文字以上がいるべきです。'],
	['이름에는 세미콜론(;)이 포함될 수 없습니다.',
		'Preset name cannot contain semicolon(;).',
		'名前にはセミコロン(;)を使う事ができません。'], //35
	['자원설정', 'Resource Setting', '資源設定'], // 36
	['지휘관이 필요한 자원과 계약권을 눌러줘.',
		'Push resource types and contract that you need.', 
		'指揮官に必要な資源と契約のボタンを押してくれ。'], //37
	['기상<br>시각', 'Wake-up<br>Time', '起きる<br>時間'],
	['취침<br>시각', 'Sleep<br>Time',　'寝る<br>時間'],
	['간편모드', 'Simple Mode', '簡易モード'], // 40
	['고급모드', 'Advanced Mode', '高級モード'], // 41
	['원하는 자원 획득비와 계약권 우선도를 알려줘.'+
	 '비율 상관없이 전체 양만 늘리고 싶으면 0:0:0:0으로 입력해줘. ',
		'Let me know the ratio of resources and contraction weights. '+
		'If you just want to gain total amount of them, set the ratio as 0:0:0:0.',
		'指揮官が望む資源の比率と契約の重みを教えて。 '+
		'ただ全体の量だけ集めいたら、比率を0:0:0:0に書いてくれ。'],
	['프리셋에 저장하지 않은 설정은 손실됩니다.',
		'Be aware that setting won\'t be preserved unless you save on preset',
		'プリセットにセーブしなかった設定は削除されます。'] //43
];

/*
	함수를 호출한 시점에서의 언어로 해당 워드를 반환한다
	되게 구조가 지저분하긴 한데, 이거 안쓰면 모든 객체들이
	언어 담당 객체를 저장해야해서 너무 귀찮았음
*/
function get_word(word_id) {
	if(!WORDS[word_id][document.CURRENT_LANG])
		return WORDS[word_id][LANG_EN];
	else
		return WORDS[word_id][document.CURRENT_LANG];
}

/**
	Change current session's language as given
	and change every DOM related to language,
	and save user chosen language selection.
*/
function change_language(lang_id) {
	if(lang_id < 0 || lang_id >= 3)
		return;

	// set the variable
	document.CURRENT_LANG = lang_id;

	// refresh words
	WORDS.forEach((word_info, idx) => {
		try {
			document.getElementsByName('lang-' + idx).forEach(dom => {
				dom.innerHTML = get_word(idx);
			});
		}
		catch(err) {
			console.log('[ERROR] change_language: there is no name lang-' + idx);
		}
	});
	
	// save language selection
	localforage.setItem('lang', document.CURRENT_LANG);

	// change font color
	for(let i = 0; i < 3; ++i)
		document.getElementById('lang-sel-' + i).style.color
			= (i == document.CURRENT_LANG ? '#000000' : '#dddddd');
}