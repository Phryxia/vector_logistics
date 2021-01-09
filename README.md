# 군수과장 벡터양!

**군수과장 벡터양!**(https://krissvector.moe/)은 소녀전선 군수 시스템을 좀 더 쉽게 활용할 수 있게 도와주는 웹 어플리케이션으로, 개인의 일정에 특화된 군수 작전 조합을 추천해 줍니다.



## 군수 시스템이란?

소녀전선에는 4가지 기본 자원과 5가지 기타 재화가 존재합니다.

- 4종자원: 인력, 탄약, 식량, 부품
- 5종재화: 쾌속수복계약, 인형제조계약, 쾌속제조계약, 장비제조계약, 토큰

군수 작전은 해당 자원 및 재화를 일정 시간에 한 번씩 수급할 수 있는 시스템입니다. 한 번에 **최대 4개**의 군수 작전을 수행할 수 있으며, 각 군수 작전은 서로 다른 자원 및 재화의 양을 벌어옵니다.

예를 들어 작전 5-3은 4시간에 한 번씩 인:탄:식:부 = 800:400:400:0을 얻을 수 있으며 장비제조계약 재화를 획득할 수 있습니다.



## 개발 동기

군수 작전 조합 추천 서비스는 기존에도 존재했습니다. (ex: 소군추 - http://mahler83.net/sogunchu/) 그러나 해당 서비스들의 추천 기준은 다소 비현실적인 전제를 깔고 있습니다.

소녀전전 유저는 일단 잠을 자고 일어나는 '사람'이며, 대부분은 학교나 회사를 오고가는 인생을 살고 있습니다. 때문에 군수 작전이 완료된다고 무조건 확인을 할 수 없는 경우가 많습니다.

저는 개인의 **일반화된 일정**에 기반한 추천 알고리즘을 고안했고, 이를 전세계 유저들에게 서비스하기 위해 이 프로젝트를 시작하였습니다.