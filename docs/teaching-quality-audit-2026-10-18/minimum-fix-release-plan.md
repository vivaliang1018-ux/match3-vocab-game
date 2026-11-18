# Minimum Fix for Release — 待确认清单

状态：仅制定清单，未修改产品、词库、音频或课程逻辑。依据 issues.json 和 issue-details.md；不沿用原 P0/P1 标签批量修改。

## 计数口径

以原审计编号为一项，124 项完整分组：A 27、B 22、C 75。同一 Emoji 的不同课程问题可以有不同编号，不等于修改 49 个不同 Emoji。A 涉及 23 个不同 Emoji；B 涉及 22 个 Emoji×学习语言组合，绑定 22 个不同现有音频文件。

B：英语 5、西语 6、日语 1、韩语 10。19 项为词义或基本语法修改，3 项仅拼写。22 是待处理文件数，不是已确定的重录数。现有审计未认证这些录音的实际朗读，不能凭文件名或 ASR 承诺复用或必须重录。

## A：仅修母语释义（27 项，音频不动）

只改下列明确错误的课程单元，不把同一审计表内的所有当前释义一律替换。

| 审计编号 | ID / Emoji | 最小修复范围 |
|---|---|---|
| 11 | blowfish 🐡 | 法语 poisson-lune（翻车鱼）改为河豚对应词 poisson-globe。 |
| 12 | palms-up-together 🤲 | 法语不再写双掌相抵、手指向上；按各门实际学习词写双手/掌心向上，不给韩语泛指表达强加细节。 |
| 13 | paw-prints 🐾 | 英语课程的西语蹄印改爪印、韩语熊脚掌改脚印；日语肉球的可接受转喻本轮不强改。 |
| 15 | clamp 🗜️ | 英语 Clamp 的韩语释义不再用压缩机。 |
| 16 | desert-island 🏝️ | 英、西、日课程的韩语释义不再写沙漠岛屿，改无人岛。 |
| 21 | comet ☄️ | 英语 Comet、日语彗星的西语释义 meteorito 改 cometa；不反向改西语课程的学习词。 |
| 23 | root-vegetable 🫜 | 西语母语释义仅修 túberculo → tubérculo；本轮不扩展根菜/块茎专业分类调整。 |
| 27 | fish-cake-with-swirl 🍥 | 对明确指日式鱼糕/なると的学习词，法、德释义不再教成炸鱼饼；韩语 어묵 按其本身范围保留可接受对应，不机械整表替换。 |
| 33 | shortcake 🍰 | 日语ショートケーキ的法语释义不再写 gâteau sablé；中文草莓蛋糕保留。 |
| 46 | snowman-without-snow ⛄️ | 西、韩学习词只说雪人，中文改雪人，不额外加“无雪”。 |
| 48 | cinema-light 🎦 | 韩语 영화 的母语释义按电影，不再使用 Cinema Light、影院标志等替代实际词义。 |
| 49 | cinema-light 🎦 | 西语 cine 的英语释义去掉错误的 Cinema Light；只修明确错误，不连带重命名其他可接受释义。 |
| 54 | paper-lantern 🏮 | 西语 lámpara japonesa 的中文御手玉改日式灯笼。 |
| 55 | closed-mailbox-with-lowered-flag 📪 | 中文“lowered 邮箱”改为对应实际学习词的空的关闭信箱，去掉未翻译残留。 |
| 57 | envelope-with-arrow 📩 | 韩语 보낸 편지 按已发送的信件翻译，修中文拆信和日语接收邮件的方向错误。 |
| 68 | timer-clock ⏲ | 德语 Zeitschaltuhr（定时开关）改 Timer；法语 horloge 的泛称本轮不追求精确化。 |
| 109 | nail-polish 💅 | 西语 pintarse las uñas 是涂指甲油的动作，相关释义不再只写指甲油。 |
| 110 | nail-polish 💅 | 日语マニキュアを塗る手按涂指甲油的手翻译，不再只写指甲油。 |
| 111 | juggling 🤹 | 英语 Juggling 按杂耍活动翻译，不译成杂耍者。 |
| 112 | fencing 🤺 | 英语 Fencing 按击剑运动翻译，不译成击剑的人。 |
| 113 | page-with-curl 📃 | 中文卷纸改卷边纸页等对应词，避免教成一卷纸。 |
| 117 | horse-racing 🏇 | 韩语 승마 按骑马翻译，不译成赛马。 |
| 118 | snowboarder 🏂 | 西、日、韩课程的中文滑雪板改滑单板的人，不把人译成器具。 |
| 119 | face-with-monocle 🧐 | 对实际说单片眼镜的学习词，中文不再写侦探脸。 |
| 120 | tired-face-2 😫 | 对实际说疲惫的学习词，中文痛苦改疲惫/疲惫的脸，保留词与短语的差别。 |
| 121 | fencing 🤺 | 西、日、韩学习词指人，英语释义 Fencing 改对应击剑者表达。 |
| 122 | juggling 🤹 | 西、日、韩学习词指人，母语释义改杂耍者，而不是杂耍活动。 |

## B：必须修学习词（22 项）

下列音频路径均以 public/ 为根；不删除旧文件、不覆盖其他词的录音。每项同步核对实际可用的母语课程释义，相关释义调整计入本项，不另算一次重录。

| 编号 | ID | 语言 | 当前 → 建议 | 当前音频路径（public/ 下） |
|---|---|---|---|---|
| 1 | raccoon | 韩 | 너구리 → 라쿤 | emoji-voice-ko/너구리.mp3 |
| 2 | paw-prints | 西 | huellas de pezuñas → huellas de patas | emoji-voice-es/huellas de pezuñas.mp3 |
| 3 | rice-cracker | 韩 | 주먹밥 → 쌀과자 | emoji-voice-ko/주먹밥.mp3 |
| 4 | roasted-sweet-potato | 西 | patata asada → batata asada | emoji-voice-es/patata asada.mp3 |
| 6 | safety-vest | 韩 | 구명조끼 → 안전 조끼 | emoji-voice-ko/구명조끼.mp3 |
| 7 | clamp | 韩 | 압축기 → 클램프 | emoji-voice-ko/압축기.mp3 |
| 8 | electric-plug | 日 | コンセント → 電源プラグ | emoji-voice-ja/コンセント.mp3 |
| 9 | hand-with-index-finger-and-thumb-crossed | 韩 | 엄지와 중지를 교차한 손 → 엄지와 검지를 교차한 손 | emoji-voice-ko/엄지와 중지를 교차한 손.mp3 |
| 10 | desert-island | 韩 | 사막 섬 → 무인도 | emoji-voice-ko/사막 섬.mp3 |
| 17 | hyacinth | 西 | campanilla → jacinto | emoji-voice-es/campanilla.mp3 |
| 20 | rosette | 韩 | 장미 → 꽃 모양 장식 | emoji-voice-ko/장미.mp3 |
| 22 | root-vegetable | 西 | túberculo comestible → tubérculo comestible（仅拼写） | emoji-voice-es/túberculo comestible.mp3 |
| 34 | shortcake | 韩 | 조각 케익 → 조각 케이크（仅拼写） | emoji-voice-ko/조각 케익.mp3 |
| 35 | chocolate-bar | 韩 | 초콜렛 → 초콜릿（仅拼写） | emoji-voice-ko/초콜렛.mp3 |
| 39 | getting-massage | 英 | Getting Massage → Getting a Massage | emoji-voice/Getting Massage.mp3 |
| 40 | getting-haircut | 英 | Getting Haircut → Getting a Haircut | emoji-voice/Getting Haircut.mp3 |
| 41 | wearing-turban | 英 | Wearing Turban → Wearing a Turban | emoji-voice/Wearing Turban.mp3 |
| 44 | taking-bath | 英 | Taking Bath → Taking a Bath | emoji-voice/Taking Bath.mp3 |
| 47 | cinema-light | 英 | Cinema Light → Cinema | emoji-voice/Cinema Light.mp3 |
| 59 | repeat-single-button | 西 | repetir una vez → repetir una pista | emoji-voice-es/repetir una vez.mp3 |
| 61 | play-or-pause-button | 西 | reproducir o pausa → reproducir o pausar | emoji-voice-es/reproducir o pausa.mp3 |
| 62 | orthodox-cross | 韩 | 전통적인 십자가 → 정교회 십자가 | emoji-voice-ko/전통적인 십자가.mp3 |

说明：9 仅把中指改成食指，不为了自然度另起“比心”的名称。22 仅修重音符号，不顺便重做块茎/根菜分类。34、35 不加切片、条形等新音节。39、40、41、44 的原录音若实际已经含冠词且完整正确，可复用；不能由当前文件名推断其朗读内容。44 同步将母语人物名词改成洗澡动作，不改变 Emoji 性别或 ID。

## C：暂保留（75 项）

完整审计编号：5, 14, 18, 19, 24, 25, 26, 28, 29, 30, 31, 32, 36, 37, 38, 42, 43, 45, 50, 51, 52, 53, 56, 58, 60, 63, 64, 65, 66, 67, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 114, 115, 116, 123, 124。

- 32 Shortcake、38 Headphone、37 Sponges：地区、可接受表达或单复数，不改词、不录音。
- 50 Japanese Symbol、51 初学驾驶标志的部分泛称：可以更精确，但不是 Cinema Light 那样造出错误物体，本轮不扩改。
- 53 독수리：地区/分类语义不足以支持本轮强制改词；不要为统一成 Eagle 批量更名。
- 52 Mermaid：现有 ASR 不构成实际录音认证；保留文件、列入人工复听，不用未经证实的猜测替换。C 不表示已认证录音正确。
- 42 Rowing Boat、43 Bouncing Ball：可成立的名词短语，不机械按缺冠词处理。
- 28 Oden/오뎅、89 授乳/수유、106 소 等：存在文化、语境或宽窄范围差别，证据不足以要求上线前改造整个词义链。若后续人工明确确认造成错误学习，单独重新评估，不默认为已修复或完全无问题。
- 其余保留项按原详情记录为地区差异、可接受泛称、专业分类、疑似或未证实问题，不以原严重程度标签自动纳入修复。

## 确认后执行边界

1. 仅修改上述明确指定单元；A 不动任何录音。B 先逐条检查现有实际朗读，确定可复用与必须替换的最终数量，再生成确需更新的文件。
2. 不改 1,117 个 Emoji 的 ID、数量、课程结构、游戏/Quiz/复习规则、进度存储格式、购买或登录逻辑。文字变化不应清空或重置已有学习记录；实施前核对现有记录与词名的关联，不能靠直接更名假定兼容。
3. 核对四门学习语言、七种母语中实际存在的 24 个课程方向。不是凭空新增同语课程；修改后逐单元比较，允许差异仅限批准清单及其必要对应释义。
4. 对 B 验证新旧文件名 Unicode 规范化、绑定覆盖优先级、资源存在及真正在用的音频；仅解码成功不等于朗读正确。
5. 保留修复前快照与差异清单，回归现有进度恢复、Quiz 续答、复习词条以及学习词/音频绑定；不借机改首页或其他 UI。

等待用户确认，不开始实施。
