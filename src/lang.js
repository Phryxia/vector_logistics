'use strict';

let LANG_KO = 0;
let LANG_EN = 1;
let LANG_JP = 2;
let LANG_TW = 3;
let LANG_CH = 4;

let WORDS = [
	['군수과장 벡터양!',
	 'Vector Logistics!',
	 '支援マスター<br>ベクターちゃん!',
	 'Vector Logistics!',
	 'Vector Logistics!'], // 타이틀
	['"원하는 자원 획득비와 계약권 우선도를 알려주면, 지휘관의 일정에 맞춘 군수 조합을 추천해줄게.'+
	 ' 비율 상관없이 전체 양만 늘리고 싶으면 0:0:0:0으로 입력해줘."',
	 '"If you let me know your wanted resource ratio and weights of contractions, I\'ll recommend'+
	 ' proper combination of logistics under your schedule. If you don\'t care the ratio, just'+
	 ' type 0:0:0:0.',
	 '"欲しい資源の獲得比率とアイテムの重みを教えてくれたら、指揮官のスケジュールに合わせた支援の組み合わせをオススメしてあげる。'+
	 '比率とは関係なくただ全体の量だけ上げたいなら、0:0:0:0で書いてくれ。"',
	 '請說明你需要的資源比例和合同偏好,我將推薦符合指揮官時間表的資源組合。 '+
	 '增加總量,但不考慮比例,請輸入0：0：0：0。',
	 '如果您告訴我您想得到的所需資源的比例和契約的偏好，我會推薦與指揮官的時間表相匹配的資源組合。 '+
	 '如果要增加總量而不考慮比率，請輸入0：0：0：0。'], // 설명
	['<br>- 군수과장 크리스 벡터',
	 '<br>- Kriss Vector, supply officer',
	 '<br>- 支援マスタークリスベクター',
	 '<br>- Vector, 后勤官',
	 '<br>- Vector, 后勤官'],
	['자원설정', 'Resource Setting', '資源設定', '資源設置', '资源设置'],
	['저', 'LOW', '下', '低', '低'],
	['중', 'MID', '中', '中', '中'],
	['고', 'HIGH', '上', '高', '高'],
	['최소<br>주기', 'Min<br>Period', '最短<br>時間', '最低<br>期限', '最低<br>期限'],
	['최대<br>주기', 'Max<br>Period', '最長<br>時間', '最高<br>期限', '最高<br>期限'],
	['전역<br>개방', 'EP<br>Progress', '作戦<br>開放', 'EP<br>進展', 'EP<br>進展'],
	['0지<br>개방', 'EP0<br>Open', 'EP0<br>開放', 'EP0<br>開啟', 'EP0<br>开启'],
	['프리셋', 'Preset', 'プリセット', '預設', '预设'],
	['추가', 'Add', '追加', '添加', '添加'], // lang-12
	['삭제', 'Del', '削除', '刪除', '删除'],
	['반복일정추가', 'Repeat', '反復日程追加', '重複添加', '重复添加'],
	['확인일정', 'Confirm Schedule', '確認スケジュール', '進程確認', '进程确认'],
	['계산', 'Compute', '計算', '計算', '计算'],
	['반복을 시작할 시각을 입력하세요. (ex: 11:16)', // lang-17
		'Please enter the start time. (ex: 11:16)', 
		'反復を始める時を入力して下さい。 (ex: 11:16)',
		'請輸入開始時間 (ex: 11:16)',
		'请输入开始时间 (Ex: 11:16)'],
	['올바른 시각을 입력하세요. (ex: 04:04)',
		'Please enter valid time stamp. (ex: 04:04)',
		'正しい時間を入力して下さい。 (ex: 04:04)',
		'請輸入有效時間 (ex: 04:04)',
		'请输入有效时间 (ex: 04:04)'],
	['반복할 주기를 입력하세요. (ex: 11:16)',
		'Please enter the period. (ex: 11:16)',
		'反復周期を入力して下さい。 (ex: 11:16)',
		'請輸入時間段 (ex: 11:16)',
		'请输入时间段 (ex: 11:16)'],
	['올바른 시간을 입력하세요. (ex: 00:45)',
		'Please enter valid time period. (ex: 00:45)',
		'正しい時間を入力して下さい。 (ex: 00:45)',
		'請輸入有效時間段 (ex: 00:45)',
		'请输入有效时间段 (ex: 00:45)'],
	['반복을 종료할 시각을 입력하세요. (ex: 23:59)',
		'Please enter the end time. (ex: 23:59)',
		'反復を終了する時を入力して下さい。 (ex: 23:59)',
		'請輸入結束時間 (ex: 23:59)',
		'请输入结束时间 (ex: 23:59)'],
	['추천', 'Recommendation', 'オススメ', '建議', '建议'], // lang-22
	['작전', 'Op', '作戦', '作戰', '作战'],
	['주기', 'Period', '周期', '時期', '时期'],
	['인력', 'Man', '人力', '人力', '人力'],
	['탄약', 'Ammo', '弾薬', '彈藥', '弹药'],
	['식량', 'Ration', '配給', '口糧', '口粮'],
	['부품', 'Parts', '部品', '零件', '零件'],
	['기타도구', 'Rewards', '確率報酬', '獲得物品', '获得物品'],
	['총합', 'Total', '合計', '總計', '合计'],
	['회', 'cyc', '回', '次', '次'], // 31
	['일', 'd', '日', '日', '日'],
	['프리셋 이름을 입력하세요',
		'Please enter the name of preset.',
		'プリセットの名前を入力して下さい。',
		'請輸入預設名稱',
		'请输入预设名称'],
	['이름은 최소 1글자 이상이어야 합니다.',
		'Preset name must contain one or more characters.',
		'名前には最小一文字以上がいるべきです。', 
		'預設名稱必須包含一個或多個字符',
		'预设名称必须包含一个或多个字符'],
	['이름에는 세미콜론(;)이 포함될 수 없습니다.',
		'Preset name cannot contain semicolon(;).',
		'名前にはセミコロン(;)を使う事ができません。',
		'預設名稱不能包含分號',
		'预设名称不能包含分号'], //35
	['자원설정', 'Resource Setting', '資源設定', '資源設置', '资源设置'], // 36
	['지휘관이 필요한 자원과 계약권을 눌러줘.',
		'Push resource types and contract that you need.', 
		'指揮官に必要な資源と契約のボタンを押してくれ。',
		'指揮官按下所需資源和合同權。',
		'指挥官按下所需资源和合同权。'], //37
	['기상<br>시각', 'Wake-up<br>Time', '起きる<br>時間', '起牀<br>時間', '起床<br>时间'],
	['취침<br>시각', 'Sleep<br>Time',　'寝る<br>時間', '睡眠<br>時間', '睡眠<br>时间'],
	['간편모드', 'Simple Mode', '簡易モード', '簡便模式', '简便模式'], // 40
	['고급모드', 'Advanced Mode', '高級モード', '高級模式', '高级模式'], // 41
	['원하는 자원 획득비와 계약권 우선도를 알려줘.'+
	 '비율 상관없이 전체 양만 늘리고 싶으면 0:0:0:0으로 입력해줘. ',
		'Let me know the ratio of resources and contraction weights. '+
		'If you just want to gain total amount of them, set the ratio as 0:0:0:0.',
		'指揮官が望む資源の比率と契約の重みを教えて。 '+
		'ただ全体の量だけ集めいたら、比率を0:0:0:0に書いてくれ。',
		'告訴我你想要的資源獲得費和合同權優先度。 '+
		'不論比例,只要想增加總量,請輸入0:0:0:0。',
		'告诉我你想要的资源获得费和合同权优先度。 '+
		'不论比例,只要想增加总量,请输入0:0:0:0。'],
	['프리셋에 저장하지 않은 설정은 손실됩니다.',
		'Be aware that setting won\'t be preserved unless you save on preset',
		'プリセットにセーブしなかった設定は削除されます。',
		'不存储在预存件中的设定会损失。',
		'不存儲在預存件中的設定會損失。'] //43
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
	if(lang_id < 0 || lang_id >= 5)
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
	// for(let i = 0; i < 5; ++i) {
	// 	let st = document.getElementById('lang-sel-' + i).style;
	// 	if (i == document.CURRENT_LANG)	{
	// 		st.background = 'rgb(253, 179, 0)';
	// 		st.color = 'black';
	// 	}
	// 	else {
	// 		st.background = 'auto';
	// 		st.color = 'auto';
	// 	}
	// }
}