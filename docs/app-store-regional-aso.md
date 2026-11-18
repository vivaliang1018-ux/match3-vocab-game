# LingoMatch App Store 地区本地化工作稿

> ⚠️ 历史草稿，不可直接复制到 App Store Connect。1.1 的市场、语言和产品事实已由 `docs/launch-1.1-master-checklist.md` 与 `docs/launch-1.1-product-truth.md` 取代，本文仅作早期草案参考。

状态：上架前草稿；尚未写入 App Store Connect。用户已指定中国大陆、香港、澳门、台湾为同一波推广范围，宣传创意以繁体中文为主。用户确认现有 APP 备案属于 LingoMatch，并接受港澳台用户首次打开时先看到英文、再自行切换简体中文。

## 产品事实与边界

- 品牌名：LingoMatch；iPhone 与 iPad 均支持。
- 玩法：Emoji 三消、目标词汇学习、录制发音、复习与进度记录。
- 游戏界面可使用简体中文、英语、西班牙语、日语、韩语、法语、德语。
- 当前可学语言为英语、西班牙语、日语、韩语；课程配置会排除「母语＝目标语言」的组合。法语、德语目前是界面/母语选项，不是可学习课程。
- 不使用「学会流利口语」「AI 纠正发音」「所有语言互学」「离线全部可用」等未核实的宣传语。
- 原项目边界把本仓库定位为海外 App；本次用户明确要求将中国大陆、香港、澳门、台湾纳入上架推广范围，因此需增加对应的商店和产品验收。
- 当前**没有繁体中文游戏界面**。`src/i18n/index.tsx` 对 `zh-TW` / `zh-HK` / `zh-Hant` 不映射到中文，而是回退英语。用户接受港澳台的这一路径；因此不再把繁体 UI 作为商店页的前置条件，但截图不得伪装成繁体游戏界面。
- 产品在商店文案中定位为「教育／词汇学习」，游戏化三消是学习形式。是否需要按游戏 App 提交中国大陆的网络游戏出版物号，不能只根据营销定位判断，应以 App Store Connect 的实际上架字段、审核反馈及适用监管分类核实。

## 推荐的首发本地化

App Store 按元数据语言与用户的商店/设备设置选择展示版本，并非每个国家都必须有一套完全不同的元数据。先做以下版本；具体销售地区需在 App Store Connect 单独确认。

| 优先级 | App Store 元数据语言 | 建议覆盖的重点市场 | 定位角度 | 当前文案状态 |
| --- | --- | --- | --- | --- |
| P0 | English (U.S.) | 美国及英文默认回退 | Emoji match-3 + vocabulary | 草稿 |
| P0 | Japanese | 日本 | 絵文字パズル与英语/其他外语词汇 | 草稿 |
| P0 | Korean | 韩国 | 이모지 퍼즐与英语/其他外语词汇 | 草稿 |
| P0 | Spanish (Mexico) | 墨西哥与多数西语美洲市场 | 游戏式词汇学习 | 草稿 |
| P0 | Spanish (Spain) | 西班牙 | 同一功能，检视当地用词 | 草稿 |
| P0 | Chinese (Traditional) | 香港、澳门、台湾 | 繁體創意；真实英文/简体游戏界面 | 草稿；用户已接受 UI 回退 |
| P0 | Chinese (Simplified) | 中国大陆 | 与港澳台统一繁體宣传主题，但独立核对大陆元数据及备案信息 | 草稿；提交字段待核对 |
| P1 | French | 法国及法语用户 | 用 Emoji 学英语/西语/日语/韩语 | 草稿 |
| P1 | German | 德国及德语用户 | 用 Emoji 学英语/西语/日语/韩语 | 草稿 |
| P1 | English (U.K.) | 英国及部分英文回退市场 | 复用英文主体，核对本地拼写 | 未单独撰写 |

不建议现在制作葡语、意大利语等元数据：游戏没有对应的完整界面语言。繁体中文因用户明确要求列入首发范围；繁体宣传页对应英文或简体游戏界面的落差已被用户接受，但应在宣传和截图中保持真实。

### 大陆与港澳台不能直接共用一个 App Store 语言版本

Apple 的地区表列出：中国大陆默认 Simplified Chinese，香港/澳门/台湾默认 Traditional Chinese；用户实际看到的语言仍受系统设置及已提供本地化影响。因此可以**统一繁体广告创意与卖点**，但 App Store Connect 中仍需分别准备 `Chinese (Simplified)` 和 `Chinese (Traditional)` 两个元数据槽位，不能假定只上传繁体本地化就会让大陆用户稳定看到繁体页面。依用户要求，大陆槽位也先拟繁体宣传文案；实际填写前需核对该槽位文字与备案名称及 Apple 的本地化验收，不能保证 Apple 会按预期展示。见 [Apple 地区与语言表](https://developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations/)。

本仓库的公开隐私/支持页面显示 APP 备案号；用户确认它属于 LingoMatch。仍需在 App Store Connect 核对备案登记名称、主体及此提交的元数据是否匹配。用户将产品定位为教育而非游戏；Apple 官方说明只明确规定**游戏 App**在中国大陆上架需要网络游戏出版物号，不能据此在未审查实际分类的情况下断定本 App 一定需要或一定不需要。若 Connect 要求游戏批准号，应按其要求处理，不通过改变商店文案绕开。见 [Apple 中国大陆供应情况](https://developer.apple.com/cn/help/app-store-connect/reference/app-information/app-information) 和 [地区上架状态说明](https://developer.apple.com/cn/help/app-store-connect/reference/app-information/app-and-submission-statuses)。

## 第一轮商店短文案（待市场/母语校对）

以下保持品牌名一致，让副标题解释玩法与价值。正式提交前检查 App Store Connect 字符限制和各地区关键词热度；不要把这些草稿当作已验证的高搜索量词。

| 元数据语言 | App 名称 | 副标题草稿 | 第一张截图文案方向 |
| --- | --- | --- | --- |
| English (U.S.) | LingoMatch | Match emojis. Learn new words. | Match emojis, remember words |
| Spanish (Mexico) | LingoMatch | Aprende palabras jugando | Une emojis y aprende palabras |
| Spanish (Spain) | LingoMatch | Aprende palabras jugando | Combina emojis y aprende palabras |
| Japanese | LingoMatch | 絵文字パズルで楽しく単語学習 | 絵文字をそろえて、単語を覚えよう |
| Korean | LingoMatch | 이모지 퍼즐로 배우는 단어 | 이모지를 맞추며 단어를 배워요 |
| Chinese (Traditional) | LingoMatch | 玩 Emoji 消消樂，記住新單字 | 消除 Emoji，記住外語單字 |
| Chinese (Simplified) | LingoMatch | 玩 Emoji 消消樂，記住新單字 | 与港澳台同主题；真实界面截图配繁體文案 |
| French | LingoMatch | Apprenez des mots en jouant | Associez des émojis, retenez des mots |
| German | LingoMatch | Wörter spielerisch lernen | Emojis kombinieren, Wörter lernen |

### 大陆／港澳台共用的繁體宣传主稿

以下是**可见文案草稿**，分别填入 `Chinese (Traditional)` 和 `Chinese (Simplified)` 元数据槽位之前，仍需在 App Store Connect 预览与备案资料中核对。隐藏关键词可按搜索习惯区分字形，不影响用户看到的繁體宣传。

- 名稱：`LingoMatch`
- 副標題：`玩 Emoji 消消樂，記住新單字`
- 宣傳文字：`配對 Emoji、聆聽單字發音，讓外語練習變成每天都想玩的輕鬆挑戰。`
- 描述：

  > 在 LingoMatch，一邊玩 Emoji 三消，一邊認識新的外語詞彙。完成配對後，可以收聽單字發音，再透過複習慢慢加深記憶。
  >
  > 目前提供英語、西班牙語、日語及韓語詞彙課程。先選擇你使用的語言，再選擇想學的語言。
  >
  > • 玩 Emoji 三消，練習詞彙
  > • 收聽單字發音
  > • 查看已學詞彙與學習進度
  > • 按自己的節奏複習
  >
  > 支援 iPhone 與 iPad。

- 截圖標題方向：`玩 Emoji，練詞彙` → `聽發音，加深印象` → `複習已學單字` → `選擇你的學習語言`。截圖內的 App UI 必須保持實際顯示的英文或簡體，不用圖像處理假造繁體 UI。
- `Chinese (Traditional)` 隱藏關鍵字候選：`語言學習,單字練習,詞彙記憶,西班牙語,日語單字,韓語單字,表情符號`。
- `Chinese (Simplified)` 隱藏關鍵字候選：`语言学习,单词练习,词汇记忆,西班牙语,日语单词,韩语单词,表情符号`。這只為符合大陸用戶的搜索習慣，**可見宣傳文案仍是繁體**。

關鍵字只是產品相關的第一輪候選，尚未做搜索熱度和競品詞調研；正式填寫前需再次按 Apple 的 100 字節限制驗證，且不使用其他 App 名稱。

建议英文描述开头（非最终稿）：

> Match emojis and make new words stick. LingoMatch combines a match-3 puzzle with vocabulary practice, recorded pronunciations, and review sessions.

描述正文应分别写明实际可选课程：英语/西语/日语/韩语，但不要暗示同一种语言也能作为自己的学习目标。截图要使用该元数据语言的真实游戏界面，并展示该市场合理的课程，例如日语界面学英语、韩语界面学英语、西语界面学英语、英文界面学西语。

## 截图包与发布检查

1. 每个首发元数据语言准备 iPhone 竖屏、iPad 横屏两组真实游戏截图。至少覆盖三消棋盘、听词/词汇详情、课程选择或复习进度；前 1–3 张要直接展示核心玩法。不要上传开发、QA、试听或生成器页面。四地可使用同一繁體宣传标题，但游戏画面必须是真实的英文或简体 UI，不可改图冒充繁体界面。
2. 先从目标设备实际截屏，再加少量本地化标题。不能通过拼接或夸大功能让画面与 App 不符；也不要把 iPhone 画面简单拉伸成 iPad 图。
3. 对每个版本核对：名称、副标题、描述、关键词、支持 URL、隐私 URL、截图、设备方向、语言字体、账户登录/删除流程。
4. 再核对销售地区、价格、年龄分级、韩国等地特殊要求，并做一次真机/TestFlight 检查。商店元数据准备完成不代表构建已可提交。
5. 上线后按地区看展示→产品页浏览→下载转化，再迭代副标题和截图；不要依据未经测量的所谓「热门关键词」盲改。

## Apple 官方限制（核对于 2026-10-09）

- App 名称最多 30 字符；副标题最多 30 字符。[App information](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information/)
- 描述最多 4,000 字符；关键词最多 100 **字节**；宣传文本最多 170 字符。关键词不能使用其他 App/公司的名称。[Platform version information](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/)
- 元数据支持 English (U.S.) / (U.K.)、Spanish (Mexico) / (Spain)、Japanese、Korean、French、German、Simplified Chinese 等不同本地化；实际展示语言也受地区与用户语言设置影响。[App Store localizations](https://developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations/)
- iPhone Dynamic Island 中尺寸与支持 iPad 时的 13 英寸 iPad 截图是当前必需的展示尺寸；每种设备尺寸至少 1 张，最多 10 张。[Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- Apple 建议截图来自 App UI，并把最能说明价值的画面放在前面。[Product page](https://developer.apple.com/app-store/product-page/)

## 提交前仍需用户决定

- 中国大陆销售前：用户已确认 APP 备案属于 LingoMatch；仍需在 App Store Connect 核对登记资料和提交元数据。按实际 App 分类检查是否要求游戏出版物号，不预先断言豁免。
- 繁体商店页面上线前：用户已接受繁体系统首次打开为英文、可手动切到简体；截图与介绍需据实表达。
- 其他首发销售国家/地区与 P1 本地化是否同时上线仍待确定。
- 英文主语言选 English (U.S.) 还是 English (U.K.)；是否首发所有 P1 本地化。
- 正式商店名称、分类、年龄分级和是否已有 App Store Connect 记录。提交前检查品牌名在目标商店的可用性。
