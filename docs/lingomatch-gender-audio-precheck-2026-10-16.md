# 人物词汇录音性别初检（2026-10-16）

## 结论与限制

已对 101 个相关词条 × 英／西／日／韩四种目标语言，共 404 段现有录音运行本地离线转写。音频未上传、未重录、未替换，产品词库未修改。使用已有 faster-whisper tiny 模型，无初始提示词、固定录音目标语言，避免把文件名作为识别提示灌入模型。

当前会话无法直接听取工具返回的音频，因此本报告是自动语音识别初检，不是人工逐条审听结论。短语的职业名与短词有明显误识别；无法仅凭识别错误判定录音错误。性别词被检出只支持该信息存在，不证明短语其他部分完全正确；未检出性别不证明语音没有性别。

- 转写不确定，待复听：138 段。
- 检出性别词，完整短语待复听：110 段。
- 整词转写一致（非人工审听）：156 段。
- 文件映射待核对：0 段。3 个英语文件使用全角冒号，按 App 回退规则已找到并补转写。

只在语音、学习词与释义三方证据足够时提出文字修正。其余保留待复听，不自动添加 female／女性。

## 优先核对结果

| 条目／目标语 | 学习词 | 无提示转写 | 处理建议 |
|---|---|---|---|
| Guard／英 | Guard | Guard! | 不给英文目标词增加女性。 |
| Guard／西 | guardia | Guardia. | 未见额外女性称谓，不因日／韩词带女性而给此课程加 female。 |
| Guard／日 | 女性の衛兵 | 女性の絵絵 | 检出女性，职业部分误识别；支持把母语释义补为女卫兵，但完整短语仍需复听。 |
| Guard／韩 | 여자 근위병 | 여자 큰의경 | 检出 여자；职业部分误识别，完整短语待复听。 |
| Teacher／日 | 女性の教師 | 女性の教師 | 自动转写整词一致，释义建议 Female teacher／女教师。 |
| Student／日 | 女子学生 | 女子学生 | 自动转写整词一致，释义建议 Female student／女学生。 |
| Student／西 | estudiante | estudiante | 无额外女性称谓，保留 Student／学生。 |
| Technologist／西 | programadora | Programadora. | 转写整词一致，词形为女性程序员；建议母语释义准确表达职业与性别。 |
| Artist／韩 | 여자 화가 | 여자 화가. | 转写整词一致，释义建议 Female painter／女画家。 |
| Factory Worker／韩 | 공장 여자 직원 | 공장 여자 직원 | 转写整词一致，释义需要表达女性工厂工作人员。 |
| Beard／韩 | 수염 난 여자 | 수염난여자 | 转写整词一致，释义为留胡须的女性，不只是胡须。 |

## 全部录音证据

每行都保留实际文件链接，方便复听。整词一致状态只归一化标点、空格与大小写，不把近音字自动判为正确。

| ID | 目标语言 | 学习词／预期 | 实际无提示转写 | 证据状态 | 原录音 |
|---|---|---|---|---|---|
| blond-hair | en | Blond Hair | Blind hair. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Blond Hair.mp3>) |
| blond-hair | es | mujer rubia | Mujer, rudia. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer rubia.mp3>) |
| blond-hair | ja | 金髪の女性 | キンパツの女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/金髪の女性.mp3>) |
| blond-hair | ko | 금발 여자 | 금발 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/금발 여자.mp3>) |
| frowning | en | Frowning | Frowning. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Frowning.mp3>) |
| frowning | es | mujer frunciendo el ceño | Mujer fronciendo y seno. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer frunciendo el ceño.mp3>) |
| frowning | ja | しかめ面の女 | しかめずのおろんな | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/しかめ面の女.mp3>) |
| frowning | ko | 찌푸린 여자 | 집 흐린 여가 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/찌푸린 여자.mp3>) |
| pouting | en | Pouting | Pouding. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Pouting.mp3>) |
| pouting | es | mujer haciendo pucheros | Mujer haciendo pucheros. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer haciendo pucheros.mp3>) |
| pouting | ja | 不機嫌な女 | ふきげんなおんな | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/不機嫌な女.mp3>) |
| pouting | ko | 뾰로통한 여자 | 뷰로 통한 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/뾰로통한 여자.mp3>) |
| gesturing-no | en | Gesturing NO | Jestering, no. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Gesturing NO.mp3>) |
| gesturing-no | es | mujer haciendo el gesto de no | Mujer haciendo el gesto de NO. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer haciendo el gesto de no.mp3>) |
| gesturing-no | ja | ダメのポーズをする女 | ダメのポーズをするような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ダメのポーズをする女.mp3>) |
| gesturing-no | ko | 안 돼 손짓하는 여자 | 안 돼 손치 타는 적이야 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/안 돼 손짓하는 여자.mp3>) |
| gesturing-ok | en | Gesturing OK | Just during OK. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Gesturing OK.mp3>) |
| gesturing-ok | es | mujer haciendo el gesto de OK | Mujer haciendo el gesto de O.P. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer haciendo el gesto de OK.mp3>) |
| gesturing-ok | ja | OKのポーズをする女 | オーケーのポーズをするようにな | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/OKのポーズをする女.mp3>) |
| gesturing-ok | ko | OK 손짓하는 여자 | 옥개의 손치 타는 자다 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/OK 손짓하는 여자.mp3>) |
| tipping-hand | en | Tipping Hand | tipping hand. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Tipping Hand.mp3>) |
| tipping-hand | es | mujer dando información | Mujer dando información. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer dando información.mp3>) |
| tipping-hand | ja | 案内する女 | 案内するオムナ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/案内する女.mp3>) |
| tipping-hand | ko | 손바닥 꺾은 여자 | 손바닥 꺾은 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/손바닥 꺾은 여자.mp3>) |
| raising-hand | en | Raising Hand | Raising hand | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Raising Hand.mp3>) |
| raising-hand | es | mujer con la mano levantada | Mujer con la mano levantada. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con la mano levantada.mp3>) |
| raising-hand | ja | 手を挙げる女 | 手を上げるような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/手を挙げる女.mp3>) |
| raising-hand | ko | 한 손 든 여자 | 한 손 등 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/한 손 든 여자.mp3>) |
| deaf | en | Deaf | Death. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Deaf.mp3>) |
| deaf | es | mujer sorda | Mujer Sora | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer sorda.mp3>) |
| deaf | ja | 耳の不自由な女性 | 耳の不自由なさせ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/耳の不自由な女性.mp3>) |
| deaf | ko | 청각장애가 있는 여자 | 청각장에 가 있는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/청각장애가 있는 여자.mp3>) |
| bowing | en | Bowing | Bowing. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Bowing.mp3>) |
| bowing | es | mujer haciendo una reverencia | Un mujer haciendo una reverencia. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer haciendo una reverencia.mp3>) |
| bowing | ja | おじぎする女 | おじぎするオンナ | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/おじぎする女.mp3>) |
| bowing | ko | 절하는 여자 | 저라는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/절하는 여자.mp3>) |
| facepalming | en | Facepalming | face palming. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Facepalming.mp3>) |
| facepalming | es | mujer con la mano en la frente | Mujer con la mano en la frente. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con la mano en la frente.mp3>) |
| facepalming | ja | ひたいに手をあてる女 | 下に手を当てる女 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ひたいに手をあてる女.mp3>) |
| facepalming | ko | 골치 아파하는 여자 | 골치압하는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/골치 아파하는 여자.mp3>) |
| shrugging | en | Shrugging | shrubbing. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Shrugging.mp3>) |
| shrugging | es | mujer encogida de hombros | mujer en cojida de hombros. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer encogida de hombros.mp3>) |
| shrugging | ja | お手上げする女 | おであげつるような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/お手上げする女.mp3>) |
| shrugging | ko | 어깨를 으쓱하는 여자 | 어깨를 의스하는 예자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/어깨를 으쓱하는 여자.mp3>) |
| wearing-turban | en | Wearing Turban | wearing turpin! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Wearing Turban.mp3>) |
| wearing-turban | es | mujer con turbante | Mujer con turvante. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con turbante.mp3>) |
| wearing-turban | ja | ターバンの女性 | 多番の女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ターバンの女性.mp3>) |
| wearing-turban | ko | 터번을 쓰고 있는 여자 | 터반을 쓰고 있는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/터번을 쓰고 있는 여자.mp3>) |
| in-tuxedo | en | In Tuxedo | in Tuxio! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Tuxedo.mp3>) |
| in-tuxedo | es | mujer con esmoquin | Mujer con hismoquint. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con esmoquin.mp3>) |
| in-tuxedo | ja | タキシードの女性 | たきしいどの女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/タキシードの女性.mp3>) |
| in-tuxedo | ko | 턱시도를 입은 여자 | 턱 시도를 입은 자자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/턱시도를 입은 여자.mp3>) |
| with-veil | en | With Veil | with veil. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/With Veil.mp3>) |
| with-veil | es | mujer con velo | Mujer con bello | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con velo.mp3>) |
| with-veil | ja | ベールの女性 | ベールの女性 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ベールの女性.mp3>) |
| with-veil | ko | 면사포를 쓴 여자 | 면사포를 쓴 야자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/면사포를 쓴 여자.mp3>) |
| merman | en | Merman | Merman! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Merman.mp3>) |
| merman | es | sirena hombre | ¡Sírena hombre! | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/sirena hombre.mp3>) |
| merman | ja | マーマン | マナン | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/マーマン.mp3>) |
| merman | ko | 남자 인어 | 남자이너 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/남자 인어.mp3>) |
| in-steamy-room | en | In Steamy Room | in steamy room. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Steamy Room.mp3>) |
| in-steamy-room | es | mujer en una sauna | mujer en una sauna. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer en una sauna.mp3>) |
| in-steamy-room | ja | サウナに入る女 | そうなに入るはんね | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/サウナに入る女.mp3>) |
| in-steamy-room | ko | 사우나 하는 여자 | 싸우나 하는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/사우나 하는 여자.mp3>) |
| climbing | en | Climbing | Climbing. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Climbing.mp3>) |
| climbing | es | mujer escalando | Mujeres calando | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer escalando.mp3>) |
| climbing | ja | 山を登る女 | 山を伸ばるような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/山を登る女.mp3>) |
| climbing | ko | 클라이밍하는 여자 | 글라이밍 하는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/클라이밍하는 여자.mp3>) |
| boy | en | Boy | Boy! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Boy.mp3>) |
| boy | es | niño | Mínio | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/niño.mp3>) |
| boy | ja | 男の子 | おどこなか | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/男の子.mp3>) |
| boy | ko | 남자 아이 | 남자 아이 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/남자 아이.mp3>) |
| girl | en | Girl | Geralt. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Girl.mp3>) |
| girl | es | niña | Niña! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/niña.mp3>) |
| girl | ja | 女の子 | おまのか | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女の子.mp3>) |
| girl | ko | 여자 아이 | 여자의 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 아이.mp3>) |
| man | en | Man | Man. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Man.mp3>) |
| man | es | hombre | Oh, me! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/hombre.mp3>) |
| man | ja | 男性 | アンセ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/男性.mp3>) |
| man | ko | 남자 | 난자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/남자.mp3>) |
| beard | en | Beard | Beard | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Beard.mp3>) |
| beard | es | barba | ¡Barba! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/barba.mp3>) |
| beard | ja | あごひげの女性 | あごひげの着け | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/あごひげの女性.mp3>) |
| beard | ko | 수염 난 여자 | 수염난여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/수염 난 여자.mp3>) |
| red-hair | en | Red Hair | Red Hair | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Red Hair.mp3>) |
| red-hair | es | pelo pelirrojo | Pelo peli rojo. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/pelo pelirrojo.mp3>) |
| red-hair | ja | 赤毛の女性 | 赤ぎの女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/赤毛の女性.mp3>) |
| red-hair | ko | 빨간 머리 여자 | 빨간 머리 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/빨간 머리 여자.mp3>) |
| curly-hair | en | Curly Hair | Curly hair. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Curly Hair.mp3>) |
| curly-hair | es | pelo rizado | Pelo rizado. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/pelo rizado.mp3>) |
| curly-hair | ja | 巻き毛の女性 | 負けの女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/巻き毛の女性.mp3>) |
| curly-hair | ko | 곱슬머리 여자 | 곱슴 어리오자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/곱슬머리 여자.mp3>) |
| white-hair | en | White Hair | Why care? | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/White Hair.mp3>) |
| white-hair | es | pelo blanco | ¡Pelo un lanco! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/pelo blanco.mp3>) |
| white-hair | ja | 白髪の女性 | 知らがのさせ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/白髪の女性.mp3>) |
| white-hair | ko | 백발 여자 | 백백 여사 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/백발 여자.mp3>) |
| bald | en | Bald | Bald. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Bald.mp3>) |
| bald | es | sin pelo | sin pelo. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/sin pelo.mp3>) |
| bald | ja | 髪のない女性 | 髪のない女性 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/髪のない女性.mp3>) |
| bald | ko | 대머리 여자 | 대모 리얘자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/대머리 여자.mp3>) |
| woman | en | Woman | Woman! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Woman.mp3>) |
| woman | es | mujer | Mujer. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer.mp3>) |
| woman | ja | 女性 | 女性 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性.mp3>) |
| woman | ko | 여자 | 열차 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자.mp3>) |
| old-man | en | Old Man | Old man. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Old Man.mp3>) |
| old-man | es | anciano | ¡Antiago! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/anciano.mp3>) |
| old-man | ja | おじいさん | おじいさん | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/おじいさん.mp3>) |
| old-man | ko | 할아버지 | 하나도치 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/할아버지.mp3>) |
| old-woman | en | Old Woman | Old woman. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Old Woman.mp3>) |
| old-woman | es | anciana | ¡Ansia! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/anciana.mp3>) |
| old-woman | ja | おばあさん | おばあさん | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/おばあさん.mp3>) |
| old-woman | ko | 할머니 | 할머니 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/할머니.mp3>) |
| health-worker | en | Health Worker | Health worker. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Health Worker.mp3>) |
| health-worker | es | profesional de la salud | Profesional de la salud. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/profesional de la salud.mp3>) |
| health-worker | ja | 女性の医者 | 女性の一社 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の医者.mp3>) |
| health-worker | ko | 여자 의료인 | 여자로 일요일. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 의료인.mp3>) |
| student | en | Student | Student. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Student.mp3>) |
| student | es | estudiante | estudiante | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/estudiante.mp3>) |
| student | ja | 女子学生 | 女子学生 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女子学生.mp3>) |
| student | ko | 여학생 | 억세 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여학생.mp3>) |
| teacher | en | Teacher | Teacher! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Teacher.mp3>) |
| teacher | es | profesora | Profesola. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/profesora.mp3>) |
| teacher | ja | 女性の教師 | 女性の教師 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の教師.mp3>) |
| teacher | ko | 여교사 | 야구사 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여교사.mp3>) |
| judge | en | Judge | Judge? | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Judge.mp3>) |
| judge | es | jueza | ¡Huesa! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/jueza.mp3>) |
| judge | ja | 女性の裁判官 | 女性のサイバン館 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の裁判官.mp3>) |
| judge | ko | 여자 판사 | 여자 판사 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 판사.mp3>) |
| farmer | en | Farmer | Farmer. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Farmer.mp3>) |
| farmer | es | agricultora | agricultora | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/agricultora.mp3>) |
| farmer | ja | 農家の女性 | ノーカの女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/農家の女性.mp3>) |
| farmer | ko | 여자 농부 | 여자 농도 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 농부.mp3>) |
| cook | en | Cook | Cuck! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Cook.mp3>) |
| cook | es | cocinera | Cocinera. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/cocinera.mp3>) |
| cook | ja | 女性のコック | 女性の国家 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性のコック.mp3>) |
| cook | ko | 여자 요리사 | 여자의 요리사 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 요리사.mp3>) |
| mechanic | en | Mechanic | Mechanics. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Mechanic.mp3>) |
| mechanic | es | mecánica | Mecanica. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mecánica.mp3>) |
| mechanic | ja | 女性の整備士 | 女性の整備し | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の整備士.mp3>) |
| mechanic | ko | 여자 정비공 | 여자 정비군? | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 정비공.mp3>) |
| factory-worker | en | Factory Worker | The factory worker. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Factory Worker.mp3>) |
| factory-worker | es | trabajadora de fábrica | Trabajadora de fábrica. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/trabajadora de fábrica.mp3>) |
| factory-worker | ja | 女性の溶接工 | 女性の要説と | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の溶接工.mp3>) |
| factory-worker | ko | 공장 여자 직원 | 공장 여자 직원 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/공장 여자 직원.mp3>) |
| office-worker | en | Office Worker | Officeworker. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Office Worker.mp3>) |
| office-worker | es | oficinista | oficimista. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/oficinista.mp3>) |
| office-worker | ja | 女性会社員 | 女性開車員 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性会社員.mp3>) |
| office-worker | ko | 여자 회사원 | 여자 회사원 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 회사원.mp3>) |
| scientist | en | Scientist | Scientist. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Scientist.mp3>) |
| scientist | es | científica | Científica | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/científica.mp3>) |
| scientist | ja | 女性科学者 | 女性科学者 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性科学者.mp3>) |
| scientist | ko | 여자 과학자 | 여자 과학타 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 과학자.mp3>) |
| technologist | en | Technologist | Technologist | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Technologist.mp3>) |
| technologist | es | programadora | Programadora. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/programadora.mp3>) |
| technologist | ja | 女性技術者 | ジョスエイギジチェア | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性技術者.mp3>) |
| technologist | ko | 여자 기술 전문가 | 여자 기술 전문가 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 기술 전문가.mp3>) |
| singer | en | Singer | See ya! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Singer.mp3>) |
| singer | es | cantante | cantante | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/cantante.mp3>) |
| singer | ja | 女性歌手 | 女性化し | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性歌手.mp3>) |
| singer | ko | 여자 가수 | 여자 갖춘 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 가수.mp3>) |
| artist | en | Artist | Ardest. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Artist.mp3>) |
| artist | es | artista | Arbista. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/artista.mp3>) |
| artist | ja | 女性の芸術家 | 女性のゲージつか | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の芸術家.mp3>) |
| artist | ko | 여자 화가 | 여자 화가. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 화가.mp3>) |
| pilot | en | Pilot | Pilot! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Pilot.mp3>) |
| pilot | es | piloto | ¡Pilado! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/piloto.mp3>) |
| pilot | ja | 女性パイロット | 女性太陽と | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性パイロット.mp3>) |
| pilot | ko | 여자 기장 | 요자 기장 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 기장.mp3>) |
| astronaut | en | Astronaut | Astronaut | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Astronaut.mp3>) |
| astronaut | es | astronauta | astronauta | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/astronauta.mp3>) |
| astronaut | ja | 女性宇宙飛行士 | ぞせうつひこし | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性宇宙飛行士.mp3>) |
| astronaut | ko | 여자 우주비행사 | 여자 우즈 빈사 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 우주비행사.mp3>) |
| firefighter | en | Firefighter | Firefighter. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Firefighter.mp3>) |
| firefighter | es | bombera | ¡Bongida! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/bombera.mp3>) |
| firefighter | ja | 女性消防士 | 女性症防止 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性消防士.mp3>) |
| firefighter | ko | 여자 소방관 | 여자 소방군 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 소방관.mp3>) |
| police-officer | en | Police Officer | Police Officer. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Police Officer.mp3>) |
| police-officer | es | policía | Policía. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/policía.mp3>) |
| police-officer | ja | 女性警察官 | 女性警察官 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性警察官.mp3>) |
| police-officer | ko | 여자 경찰관 | 여자 통찰관 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 경찰관.mp3>) |
| detective | en | Detective | Detective. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Detective.mp3>) |
| detective | es | detective | de detectivé. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/detective.mp3>) |
| detective | ja | 女性の探偵 | 女性の団手 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の探偵.mp3>) |
| detective | ko | 여자 탐정 | 여자 탐정 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 탐정.mp3>) |
| guard | en | Guard | Guard! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Guard.mp3>) |
| guard | es | guardia | Guardia. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/guardia.mp3>) |
| guard | ja | 女性の衛兵 | 女性の絵絵 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の衛兵.mp3>) |
| guard | ko | 여자 근위병 | 여자 큰의경 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 근위병.mp3>) |
| construction-worker | en | Construction Worker | Construction Worker. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Construction Worker.mp3>) |
| construction-worker | es | trabajadora de la construcción | Trabajadora de la construcción. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/trabajadora de la construcción.mp3>) |
| construction-worker | ja | 女性の建設作業員 | 女性の建設作業員 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の建設作業員.mp3>) |
| construction-worker | ko | 건설 현장 여자 노동자 | 건설 현장, 여자도 동자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/건설 현장 여자 노동자.mp3>) |
| pregnant | en | Pregnant | Pregnant. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Pregnant.mp3>) |
| pregnant | es | mujer embarazada | mujer embarazada. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer embarazada.mp3>) |
| pregnant | ja | 妊婦 | 似た | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/妊婦.mp3>) |
| pregnant | ko | 임산부 | 인삼부 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/임산부.mp3>) |
| feeding-baby | en | Feeding Baby | Feeding Baby | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Feeding Baby.mp3>) |
| feeding-baby | es | mujer alimentando a bebé | Mujera alimentando a VV. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer alimentando a bebé.mp3>) |
| feeding-baby | ja | 授乳する女性 | 情熱する女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/授乳する女性.mp3>) |
| feeding-baby | ko | 수유 중인 여자 | 수유 중인 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/수유 중인 여자.mp3>) |
| mrs-claus | en | Mrs. Claus | Mrs. Claws | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Mrs. Claus.mp3>) |
| mrs-claus | es | Mamá Noel | Mamá no él | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/Mamá Noel.mp3>) |
| mrs-claus | ja | 女性のサンタ | 女性の参拝 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性のサンタ.mp3>) |
| mrs-claus | ko | 산타할머니 | 3타의 번이 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/산타할머니.mp3>) |
| superhero | en | Superhero | Super Hero. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Superhero.mp3>) |
| superhero | es | superheroína | ¡Supereo y nada! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/superheroína.mp3>) |
| superhero | ja | 女性のスーパーヒーロー | 女性のスーパーヒーロ | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性のスーパーヒーロー.mp3>) |
| superhero | ko | 여자 히어로 | 여자 시우로 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 히어로.mp3>) |
| supervillain | en | Supervillain | Super villain. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Supervillain.mp3>) |
| supervillain | es | supervillana | ¡Súper vidiana! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/supervillana.mp3>) |
| supervillain | ja | 女性の悪役 | 女性の秋焼け | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性の悪役.mp3>) |
| supervillain | ko | 여자 슈퍼 악당 | 여자 슈퍼가 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 슈퍼 악당.mp3>) |
| mage | en | Mage | Nage. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Mage.mp3>) |
| mage | es | maga | ¡Mada! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/maga.mp3>) |
| mage | ja | 女の魔法使い | 女の魔法使い | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女の魔法使い.mp3>) |
| mage | ko | 여자 마법사 | 요자 마법사 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 마법사.mp3>) |
| fairy | en | Fairy | Siri. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Fairy.mp3>) |
| fairy | es | hada mujer | ¡Ada mujer! | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/hada mujer.mp3>) |
| fairy | ja | 女の妖精 | 女の陽性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女の妖精.mp3>) |
| fairy | ko | 여자 요정 | 여자유정 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 요정.mp3>) |
| vampire | en | Vampire | Vampire. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Vampire.mp3>) |
| vampire | es | vampiresa | Bambi deza | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/vampiresa.mp3>) |
| vampire | ja | 女の吸血鬼 | 女の急撃つき | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女の吸血鬼.mp3>) |
| vampire | ko | 여자 뱀파이어 | 여자 팬파이요. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 뱀파이어.mp3>) |
| mermaid | en | Mermaid | I'mma beade. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Mermaid.mp3>) |
| mermaid | es | sirena | ¡Síreda! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/sirena.mp3>) |
| mermaid | ja | マーメイド | まーめいど | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/マーメイド.mp3>) |
| mermaid | ko | 여자 인어 | 여자인어? | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 인어.mp3>) |
| elf | en | Elf | Oof! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Elf.mp3>) |
| elf | es | elfa | Eza. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/elfa.mp3>) |
| elf | ja | 女のエルフ | オンナマイルフ | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女のエルフ.mp3>) |
| elf | ko | 여자 엘프 | 여자 에이프 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 엘프.mp3>) |
| genie | en | Genie | G.B. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Genie.mp3>) |
| genie | es | genio mujer | ¡Qué ni obujer! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/genio mujer.mp3>) |
| genie | ja | 女の精霊 | 女の生で | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女の精霊.mp3>) |
| genie | ko | 여자 지니 | 여자친이 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 지니.mp3>) |
| zombie | en | Zombie | Zambi! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Zombie.mp3>) |
| zombie | es | zombi mujer | ¿Sambimuje? | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/zombi mujer.mp3>) |
| zombie | ja | 女のゾンビ | 女の人気 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女のゾンビ.mp3>) |
| zombie | ko | 여자 좀비 | 여자 총리 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 좀비.mp3>) |
| getting-massage | en | Getting Massage | getting massage. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Getting Massage.mp3>) |
| getting-massage | es | mujer recibiendo masaje | Mujer recibiendo más hace. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer recibiendo masaje.mp3>) |
| getting-massage | ja | フェイスマッサージ中の女 | ヘイスマサージ中の女 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/フェイスマッサージ中の女.mp3>) |
| getting-massage | ko | 마사지 받는 여자 | 마사지 받는 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/마사지 받는 여자.mp3>) |
| getting-haircut | en | Getting Haircut | Getting hair pet. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Getting Haircut.mp3>) |
| getting-haircut | es | mujer cortándose el pelo | Mujer cortándose el pelo. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer cortándose el pelo.mp3>) |
| getting-haircut | ja | 散髪される女 | サンパツされるような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/散髪される女.mp3>) |
| getting-haircut | ko | 여자 헤어컷 | 여자야 할까? | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 헤어컷.mp3>) |
| walking | en | Walking | Walking. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Walking.mp3>) |
| walking | es | mujer caminando | mujer caminando. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer caminando.mp3>) |
| walking | ja | 歩く女 | アルクオンだ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/歩く女.mp3>) |
| walking | ko | 걷는 여자 | 걷는 야자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/걷는 여자.mp3>) |
| walking-facing-right | en | Walking: Facing Right | Walking Facing Rate. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Walking： Facing Right.mp3>) |
| walking-facing-right | es | mujer caminando hacia la derecha | Mujer caminando hacia la derecha. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer caminando hacia la derecha.mp3>) |
| walking-facing-right | ja | 右向きに歩く女性 | 右向きに歩くだせ。 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/右向きに歩く女性.mp3>) |
| walking-facing-right | ko | 오른쪽으로 걷는 여자 | 오른쪽으로 건면 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/오른쪽으로 걷는 여자.mp3>) |
| standing | en | Standing | Standing. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Standing.mp3>) |
| standing | es | mujer de pie | Mujero de bie | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer de pie.mp3>) |
| standing | ja | 立つ女 | パツオンな | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/立つ女.mp3>) |
| standing | ko | 서 있는 여자 | 서있는 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/서 있는 여자.mp3>) |
| kneeling | en | Kneeling | Newling. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Kneeling.mp3>) |
| kneeling | es | mujer de rodillas | Mujer de rodillas. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer de rodillas.mp3>) |
| kneeling | ja | 正座する女性 | せいざする女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/正座する女性.mp3>) |
| kneeling | ko | 무릎을 꿇은 여자 | 무려플 꿀은 야자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/무릎을 꿇은 여자.mp3>) |
| kneeling-facing-right | en | Kneeling: Facing Right | kneeling facing right. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Kneeling： Facing Right.mp3>) |
| kneeling-facing-right | es | mujer de rodillas hacia la derecha | Mujer de rodillas hacia la derecha. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer de rodillas hacia la derecha.mp3>) |
| kneeling-facing-right | ja | 右向きに正座する女性 | 右向きに生材する女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/右向きに正座する女性.mp3>) |
| kneeling-facing-right | ko | 오른쪽을 향해 무릎 꿇은 여자 | 오른쪽의 향에 무릎 굴은 여자. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/오른쪽을 향해 무릎 꿇은 여자.mp3>) |
| with-white-cane | en | With White Cane | with white cane. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/With White Cane.mp3>) |
| with-white-cane | es | mujer con bastón | Mujer Tu Maston | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con bastón.mp3>) |
| with-white-cane | ja | 杖をついた女性 | ツーエをついたじゃして | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/杖をついた女性.mp3>) |
| with-white-cane | ko | 지팡이를 든 여자 | 집황이를 등 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/지팡이를 든 여자.mp3>) |
| with-white-cane-facing-right | en | With White Cane: Facing Right | with white cane facing right. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/With White Cane： Facing Right.mp3>) |
| with-white-cane-facing-right | es | mujer con bastón hacia la derecha | Mujer con bastón hacia la derecha. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con bastón hacia la derecha.mp3>) |
| with-white-cane-facing-right | ja | 右向きで杖をつく女性 | 右向きで強いおつくじゃせー | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/右向きで杖をつく女性.mp3>) |
| with-white-cane-facing-right | ko | 오른쪽으로 지팡이 짚는 여자 | 오른쪽으로 지판이 집느냐자. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/오른쪽으로 지팡이 짚는 여자.mp3>) |
| in-motorized-wheelchair | en | In Motorized Wheelchair | in motorized wheelchair. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Motorized Wheelchair.mp3>) |
| in-motorized-wheelchair | es | mujer en silla de ruedas eléctrica | Mujer en silla de ruedas eléctrica. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer en silla de ruedas eléctrica.mp3>) |
| in-motorized-wheelchair | ja | 電動車椅子の女性 | 連動をくれまいすのを居て | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/電動車椅子の女性.mp3>) |
| in-motorized-wheelchair | ko | 전동 휠체어를 탄 여자 | 전동 히채어를 탄려자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/전동 휠체어를 탄 여자.mp3>) |
| in-motorized-wheelchair-facing-right | en | In Motorized Wheelchair: Facing Right | In Motorized Wheelchair, Facing Right. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Motorized Wheelchair: Facing Right.mp3>) |
| in-motorized-wheelchair-facing-right | es | silla de ruedas eléctrica a la derecha | Silla de ruedas eléctrica a la derecha. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/silla de ruedas eléctrica a la derecha.mp3>) |
| in-motorized-wheelchair-facing-right | ja | 右向きで電動車椅子に乗る女性 | 右向きで電動シャクルマイスに乗る女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/右向きで電動車椅子に乗る女性.mp3>) |
| in-motorized-wheelchair-facing-right | ko | 오른쪽을 향해 전동 휠체어를 탄 여자 | 오른쪽을 향해 전동 휴체여를 탄료자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/오른쪽을 향해 전동 휠체어를 탄 여자.mp3>) |
| in-manual-wheelchair | en | In Manual Wheelchair | In Manual Wheelchair. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Manual Wheelchair.mp3>) |
| in-manual-wheelchair | es | mujer en silla de ruedas manual | Mujer en silla de ruedas manual. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer en silla de ruedas manual.mp3>) |
| in-manual-wheelchair | ja | 手動式車椅子の女性 | 主動式クリマイスも着せ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/手動式車椅子の女性.mp3>) |
| in-manual-wheelchair | ko | 수동 휠체어를 탄 여자 | 수동필 채워를 다 녀자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/수동 휠체어를 탄 여자.mp3>) |
| in-manual-wheelchair-facing-right | en | In Manual Wheelchair: Facing Right | In manual wheelchair, facing right. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Manual Wheelchair: Facing Right.mp3>) |
| in-manual-wheelchair-facing-right | es | silla de ruedas manual a la derecha | Silla de ruedas manual a la derecha. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/silla de ruedas manual a la derecha.mp3>) |
| in-manual-wheelchair-facing-right | ja | 右向きで手動式車椅子に乗る女性 | 右向きで指導式クラマイスに乗る場合。 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/右向きで手動式車椅子に乗る女性.mp3>) |
| in-manual-wheelchair-facing-right | ko | 오른쪽을 향해 수동 휠체어를 탄 여자 | 오른쪽을 향해 수동 휘체어를 탄 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/오른쪽을 향해 수동 휠체어를 탄 여자.mp3>) |
| running | en | Running | Running! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Running.mp3>) |
| running | es | mujer corriendo | Mujer corriendo. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer corriendo.mp3>) |
| running | ja | 走る女 | 走るオンな | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/走る女.mp3>) |
| running | ko | 뛰는 여자 | 띄는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/뛰는 여자.mp3>) |
| running-facing-right | en | Running: Facing Right | Running, facing right. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Running: Facing Right.mp3>) |
| running-facing-right | es | mujer corriendo hacia la derecha | Mujer corriendo hacia la derecha. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer corriendo hacia la derecha.mp3>) |
| running-facing-right | ja | 右向きに走る女性 | 見え向きに走る女性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/右向きに走る女性.mp3>) |
| running-facing-right | ko | 오른쪽으로 뛰는 여자 | 오른쪽으로 띄는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/오른쪽으로 뛰는 여자.mp3>) |
| dancing | en | Dancing | Dancing! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Dancing.mp3>) |
| dancing | es | mujer bailando | mujer bailando. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer bailando.mp3>) |
| dancing | ja | 踊る女 | おドリオンな | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/踊る女.mp3>) |
| dancing | ko | 여자 댄서 | 여자 댄서 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 댄서.mp3>) |
| golfing | en | Golfing | Goal thing. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Golfing.mp3>) |
| golfing | es | mujer jugando al golf | Mujer jugando al goles. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer jugando al golf.mp3>) |
| golfing | ja | ゴルフをする女 | ゴールフォースローンな | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ゴルフをする女.mp3>) |
| golfing | ko | 골프치는 여자 | 골프 치는 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/골프치는 여자.mp3>) |
| surfing | en | Surfing | Surfing! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Surfing.mp3>) |
| surfing | es | mujer haciendo surf | Mujer haciendo surf. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer haciendo surf.mp3>) |
| surfing | ja | サーフィンする女 | サーフィンするおんな | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/サーフィンする女.mp3>) |
| surfing | ko | 서핑하는 여자 | 서핑하는 여사 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/서핑하는 여자.mp3>) |
| rowing-boat | en | Rowing Boat | Rowing boat. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Rowing Boat.mp3>) |
| rowing-boat | es | mujer remando en un bote | Mujer remando en un boté. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer remando en un bote.mp3>) |
| rowing-boat | ja | ボートをこぐ女 | ボートを曲をんや | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ボートをこぐ女.mp3>) |
| rowing-boat | ko | 노젓는 여자 | 노전 능력자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/노젓는 여자.mp3>) |
| swimming | en | Swimming | Swimming! | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Swimming.mp3>) |
| swimming | es | mujer nadando | Mujer nada ando. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer nadando.mp3>) |
| swimming | ja | 泳ぐ女 | お勇気を運んだ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/泳ぐ女.mp3>) |
| swimming | ko | 수영하는 여자 | 수영하는 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/수영하는 여자.mp3>) |
| bouncing-ball | en | Bouncing Ball | Bouncing ball. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Bouncing Ball.mp3>) |
| bouncing-ball | es | mujer botando un balón | Mujer botando un barón. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer botando un balón.mp3>) |
| bouncing-ball | ja | バスケットボールをする女 | バスケットボールをするような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/バスケットボールをする女.mp3>) |
| bouncing-ball | ko | 공 가진 여자 | 콩가진 여다 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/공 가진 여자.mp3>) |
| lifting-weights | en | Lifting Weights | Lifting Lakes. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Lifting Weights.mp3>) |
| lifting-weights | es | mujer levantando pesas | Mujer levantando pesas. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer levantando pesas.mp3>) |
| lifting-weights | ja | 重量挙げをする女 | 重量割をするようになる。 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/重量挙げをする女.mp3>) |
| lifting-weights | ko | 여자 역도 선수 | 여자 역도 상처 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여자 역도 선수.mp3>) |
| biking | en | Biking | Biking. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Biking.mp3>) |
| biking | es | mujer en bicicleta | Mojerem befecheta. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer en bicicleta.mp3>) |
| biking | ja | 自転車に乗る女 | 自転車に乗る女 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/自転車に乗る女.mp3>) |
| biking | ko | 자전거 타는 여자 | 자전거 타는 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/자전거 타는 여자.mp3>) |
| mountain-biking | en | Mountain Biking | Mountain Biking | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Mountain Biking.mp3>) |
| mountain-biking | es | mujer en bicicleta de montaña | Mujer en bicicleta de montaña. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer en bicicleta de montaña.mp3>) |
| mountain-biking | ja | マウンテンバイクに乗る女 | マウンテンバイクに乗るような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/マウンテンバイクに乗る女.mp3>) |
| mountain-biking | ko | 산악 자전거 타는 여자 | 사낙 자전거 타는거자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/산악 자전거 타는 여자.mp3>) |
| cartwheeling | en | Cartwheeling | Cartwheeling | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Cartwheeling.mp3>) |
| cartwheeling | es | mujer dando una voltereta lateral | Mujer dando una boltereta a la Ferrari. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer dando una voltereta lateral.mp3>) |
| cartwheeling | ja | 側転する女 | 速点するオンナ | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/側転する女.mp3>) |
| cartwheeling | ko | 옆돌기하는 여자 | 엽돌기 하는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/옆돌기하는 여자.mp3>) |
| playing-water-polo | en | Playing Water Polo | playing waterpullo. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Playing Water Polo.mp3>) |
| playing-water-polo | es | mujer jugando al waterpolo | Mujer jugando al guaterpollo. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer jugando al waterpolo.mp3>) |
| playing-water-polo | ja | 水球をする女 | 追求をするような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/水球をする女.mp3>) |
| playing-water-polo | ko | 수구하는 여자 | 수구하는 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/수구하는 여자.mp3>) |
| playing-handball | en | Playing Handball | playing Handball. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Playing Handball.mp3>) |
| playing-handball | es | mujer jugando al balonmano | Mujer jugando al balonvado. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer jugando al balonmano.mp3>) |
| playing-handball | ja | ハンドボールをする女 | ハンドボールをするような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ハンドボールをする女.mp3>) |
| playing-handball | ko | 핸드볼하는 여자 | 핸드 보라는 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/핸드볼하는 여자.mp3>) |
| in-lotus-position | en | In Lotus Position | in lotus position. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Lotus Position.mp3>) |
| in-lotus-position | es | mujer en posición de loto | Mujer en posición deloto. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer en posición de loto.mp3>) |
| in-lotus-position | ja | ヨガのポーズをする女 | 横のポーズをするような | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ヨガのポーズをする女.mp3>) |
| in-lotus-position | ko | 가부좌한 여자 | 가부자 한 여자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/가부좌한 여자.mp3>) |
| with-skullcap | en | With Skullcap | with SkullCab. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/With Skullcap.mp3>) |
| with-skullcap | es | persona con gorro chino | Persona con Gorrachino. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/persona con gorro chino.mp3>) |
| with-skullcap | ja | 中華帽の男性 | 中央の男性 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/中華帽の男性.mp3>) |
| with-skullcap | ko | 중국 모자를 쓴 남자 | 중국 모자를 쓴 난자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/중국 모자를 쓴 남자.mp3>) |
| with-headscarf | en | With Headscarf | with Headscarf. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/With Headscarf.mp3>) |
| with-headscarf | es | mujer con hiyab | Mujer Conigar. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujer con hiyab.mp3>) |
| with-headscarf | ja | スカーフの女性 | スカーフの女性 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/スカーフの女性.mp3>) |
| with-headscarf | ko | 스카프 두른 여자 | 스카플 들은 러자 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/스카프 두른 여자.mp3>) |
| in-suit-levitating | en | In Suit Levitating | in suit levitting. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/In Suit Levitating.mp3>) |
| in-suit-levitating | es | persona trajeada levitando | Persona trajeada al evitano. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/persona trajeada levitando.mp3>) |
| in-suit-levitating | ja | 浮いてるビジネスマン | 追い手るビジメフマン | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/浮いてるビジネスマン.mp3>) |
| in-suit-levitating | ko | 정장 입고 뜬 남자 | 정장 입고 뜯는 남자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/정장 입고 뜬 남자.mp3>) |
| people-with-bunny-ears | en | People With Bunny Ears | People with bunny ears. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/People With Bunny Ears.mp3>) |
| people-with-bunny-ears | es | mujeres con orejas de conejo | Mujeres con oréjas de conejo. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujeres con orejas de conejo.mp3>) |
| people-with-bunny-ears | ja | バニーガール | バニーガール | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/バニーガール.mp3>) |
| people-with-bunny-ears | ko | 토끼 귀 쓰고 춤추는 사람들 | 토끼 기쓰고 춤추는 사람된. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/토끼 귀 쓰고 춤추는 사람들.mp3>) |
| men-wrestling | en | Men Wrestling | Men wrestling | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Men Wrestling.mp3>) |
| men-wrestling | es | hombres luchando | ¡Hombre, es lechando! | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/hombres luchando.mp3>) |
| men-wrestling | ja | レスリングする男 | レスリングするとこ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/レスリングする男.mp3>) |
| men-wrestling | ko | 레슬링하는 남자 | 레슬링하는 남자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/레슬링하는 남자.mp3>) |
| women-wrestling | en | Women Wrestling | Women wrestling. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Women Wrestling.mp3>) |
| women-wrestling | es | mujeres luchando | mujer es luchando. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/mujeres luchando.mp3>) |
| women-wrestling | ja | レスリングする女 | レッセリングするようんだ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/レスリングする女.mp3>) |
| women-wrestling | ko | 레슬링하는 여자 | 레슬링 하는 여자 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/레슬링하는 여자.mp3>) |
| womans-clothes | en | Woman’s Clothes | Women's clothes. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Woman’s Clothes.mp3>) |
| womans-clothes | es | ropa de mujer | Ropa de mujer. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/ropa de mujer.mp3>) |
| womans-clothes | ja | 婦人服 | フォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォォ | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/婦人服.mp3>) |
| womans-clothes | ko | 여성복 | 여성도 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여성복.mp3>) |
| mans-shoe | en | Man’s Shoe | Manchu. | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Man’s Shoe.mp3>) |
| mans-shoe | es | zapato de hombre | Zapato de hombre. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/zapato de hombre.mp3>) |
| mans-shoe | ja | 紳士靴 | 申し上げました。 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/紳士靴.mp3>) |
| mans-shoe | ko | 남성용 구두 | 남성용쿠트 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/남성용 구두.mp3>) |
| womans-sandal | en | Woman’s Sandal | Women's sandal. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Woman’s Sandal.mp3>) |
| womans-sandal | es | sandalia de mujer | Sandalía de mujer | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/sandalia de mujer.mp3>) |
| womans-sandal | ja | サンダル | サンダル | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/サンダル.mp3>) |
| womans-sandal | ko | 샌들 | 센둘 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/샌들.mp3>) |
| womans-boot | en | Woman’s Boot | Woman's boot. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Woman’s Boot.mp3>) |
| womans-boot | es | bota de mujer | Bota de mujer. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/bota de mujer.mp3>) |
| womans-boot | ja | ブーツ | でんつ! | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/ブーツ.mp3>) |
| womans-boot | ko | 부츠 | 부채 | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/부츠.mp3>) |
| womans-hat | en | Woman’s Hat | Woman's Hat | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Woman’s Hat.mp3>) |
| womans-hat | es | sombrero de mujer | Sombrero de mujer. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/sombrero de mujer.mp3>) |
| womans-hat | ja | 婦人帽子 | ふじんどうし | 转写不确定，待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/婦人帽子.mp3>) |
| womans-hat | ko | 여성용 모자 | 여성용부자 | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여성용 모자.mp3>) |
| female-sign | en | Female Sign | Female Sign | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Female Sign.mp3>) |
| female-sign | es | signo femenino | ¡Sichino femenino! | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/signo femenino.mp3>) |
| female-sign | ja | 女性のマーク | 女性のナーク | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/女性のマーク.mp3>) |
| female-sign | ko | 여성 기호 | 여성기호 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/여성 기호.mp3>) |
| male-sign | en | Male Sign | Male sign. | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice/Male Sign.mp3>) |
| male-sign | es | signo masculino | Signó masculina. | 检出性别词，完整短语待复听 | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-es/signo masculino.mp3>) |
| male-sign | ja | 男性のマーク | 男性のマーク | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ja/男性のマーク.mp3>) |
| male-sign | ko | 남성 기호 | 남성 기호 | 整词转写一致（非人工审听） | [播放](</Users/oldmilkmilk/Downloads/🚀Current Projects/match3-vocab-game/public/emoji-voice-ko/남성 기호.mp3>) |

## 复核范围与后续

- 之前的 87 条是文字疑点清单，不是 87 条已确认错误。本报告也不将自动识别输出当作音频认证。
- 101 条范围包括正常性别词作为对照，以及反向课程释义可能丢失性别的条目。
- 法语与德语目前仅作母语，无对应目标语音批次；其释义应按实际目标语录音与目标词匹配。
- 已有录音名与 App 实际学习词进行了 NFC／大小写匹配；找不到精确文件的条目须另核对 wordSpeech.ts 的回退逻辑。
- 后续文字修正应按 courseId + item.id 覆盖母语释义，不改共享英文 word、中文 cn 或目标语录音文件名。
