# LingoMatch 1.1 上线前检查 — 2026-10-17

## 后续执行记录（用户确认后）

### 后台登录后完成（2026-10-17）

- 实际后台确认：上传前 1.1 最新构建为 5；6 未占用。
- 排查发现 authentication 8.5.2 的 Swift traits 默认重新引入未使用的 Facebook SDK。已扩展既有排除脚本兼容新布局，并在 `build:ios` 前强制运行；重复执行幂等、Swift manifest 解析及 57 项测试均通过。
- 初次上传任务在上传数据前被取消，旧的 `/private/tmp/LingoMatch-1.1-6-20261017.xcarchive` **不再使用**。最终包为 `/private/tmp/LingoMatch-1.1-6-final-20261017.xcarchive`，已逐项确认无 Facebook/FBSDK/FBAEM 文件，签名校验成功。
- 最终 Build 6 上传成功，后台 TestFlight 已显示 **1.1 (6) Ready to Submit**，并已在 Internal QA 组。构建标识 `7cd3f27f-548c-439d-abc8-f8712c00cf0a`。
- 已将 iOS 1.1 的候选从 Build 5 替换为 Build 6 并 Save；只是更换版本草稿的构建关联，未删除旧上传构建，未点击 Add for Review / Submit for Review。
- 第三方 Firebase/Google Ads/UMP 的若干 dSYM 缺失警告未阻止上传；不声称已修复 SDK 符号问题。
- App Privacy 已实际发布：产品交互新增分析/第三方广告用途；设备 ID 新增第三方广告用途；粗略位置新增分析/第三方广告用途；新增 Advertising Data（关联，分析/第三方广告）、Crash Data（不关联，分析/App 功能）、Performance Data（保守按关联，分析/App 功能/第三方广告）。原有其他数据申报保留。
- 非个性化广告、无 ATT/IDFA 请求配置未变；未因 SDK 通用能力声明自行开启追踪或个性化广告。未提交 App Review。
- 后台标签证据快照：`/private/tmp/lingomatch-privacy-labels-20261017.txt` 为部分更新时快照，最终页面另行验证 13 类型均配置完成；不把旧快照当最终完整证明。

- 用户明确表示第 3 项已经验收；记录为用户验收反馈，不冒称本次重新真机测试，也不把它自动当作尚未生成的 Build 6 的 TestFlight 验收。
- 公开隐私政策已于 2026-10-17 更新：广告、英西日韩语音识别/在线降级、Firebase Analytics 学习行为与本地通知说明。`docs/privacy.html`、`public/privacy.html` 与 Markdown 说明已同步。
- 仅通过 GitHub Contents API 发布 `main/docs/privacy.html`，未推送其他工作区变更。提交 `f830a52c42a2321ec790dfbb2dcb2332cb77765b`；GitHub Pages 显示 built，实际公开 HTTP 内容已逐字比较与本地一致。
- Debug/Release 构建号均由 4 改为 6，版本仍 1.1；生产构建和 Capacitor iOS 同步已成功。
- 签名 Release Archive 成功（xcodebuild exit 0），路径 `/private/tmp/LingoMatch-1.1-6-20261017.xcarchive`。尚未导出 IPA 或上传 TestFlight，等待后台登录核对构建号。
- App Store Connect 浏览器要求重新登录，已交还用户登录。因此后台最新构建号、App Privacy 实际字段尚未核对或修改；Build 6 暂按之前总控表约定准备，不能声称后台已确认未占用。
- 下文为执行前检查快照，以上更新取代其中相应旧状态；发布锁保持，不提交审核。

## 结论

**本地自动检查通过，但尚不具备已验证的正式提交条件。**

本次仅执行检查、生成构建产物和记录结果；未修改产品代码、构建号、线上政策、App Store Connect 或 AdMob 设置，未 Archive、签名、上传或提交审核。

## 本次已验证

| 项目 | 结果 | 验证方式与边界 |
| --- | --- | --- |
| 回归测试 | 57/57 通过 | `npx tsx --test tests/*.test.ts`；不是 57 条真机操作 |
| TypeScript / 生产网页构建 | 通过 | `npm run build` |
| Lint | 无 error，有 warning | 包括 Hooks 依赖及未使用变量；本次未自动修复 |
| iOS Release 设备构建 | 通过 | `xcodebuild ... -configuration Release -sdk iphoneos -destination generic/platform=iOS CODE_SIGNING_ALLOWED=NO build -quiet`；不等于签名 Archive 或 TestFlight 验收 |
| iOS 内嵌网页同步 | 一致 | 递归逐文件比较 `dist` 与 `ios/App/App/public`，dist 中无缺失或不同内容文件 |
| 正式产品配置 | lifetime / 正式广告位 | 生产环境解析结果；月/年环境变量虽存在，但实际 StoreKit offering 仅 lifetime |
| 本地开发服务器依赖 | 无 | Capacitor 配置未配置 `server.url` |
| 测试通知 | 入口及发送函数已移除 | 保留 ID 73999 只用于清理旧待发送测试通知；正常刷新/关闭通知时执行取消 |
| 课程翻译覆盖 | 1117 项无缺失 | es/fr/de/ja/ko 静态审计；法语 4 项、德语 1 项偏长，不等于所有 UI 均已完成尺寸验收 |
| 西语学习内容审计 | 通过 | 1117 项，待补精确录音 0、重复学习名 0；不是逐条听音验证 |
| Info.plist / 自有 Privacy Manifest | 格式有效 | `plutil -lint`；不是隐私声明一致性的完整验证 |
| 外部 Privacy / Support / Terms URL | 均 HTTP 200 | 当前网络只读请求；Privacy 内容过期，见下文 |

## 必须在提交前闭环

### 1. 公开隐私政策已证实过期

证据：实际 GET `https://vivaliang1018-ux.github.io/match3-vocab-game/privacy.html`。

- 线上日期 September 25, 2026；本地 `public/privacy.html:82` 为 October 12, 2026。
- 线上仍描述“不接入广告 SDK”，未包含当前 Google Mobile Ads / UMP 激励广告技术数据。
- 线上仍描述仅英语设备端识别，未反映当前多语言与 Apple 在线识别降级。
- 本地新版已经补充广告和语音，但服务商/处理用途还没有清楚列出当前新增的 Firebase Analytics 学习行为事件。`src/lib/coreAnalytics.ts:9` 与 `ios/App/App/LingoMatchAnalyticsPlugin.swift:26` 确认实际存在事件上传路径。

建议：先完成政策内容与最终 SDK/行为的一致性核对，再发布公开页；同时核对 App Store Connect App Privacy 与最终隐私报告。不应仅将现有本地文件直接发布就认为全部完成。本次未更改线上文件，也未判断或保证审核结果。

### 2. 最终候选构建号需要重新确定

- `ios/App/App.xcodeproj/project.pbxproj:342` 和 `:369` 的 Debug/Release 构建号均为 **4**，版本 **1.1**。
- 本地总控表记录已上传 **1.1 (5)**，并约定后续候选为 **6**。该后台记录未在本次重新登录验证。
- 本次修正后的代码不能由旧上传构建代表；应确认后台已有最大构建号后，使用未使用且递增的新号重新打候选包。

本次不擅自修改构建号，不上传。

### 3. 候选包真机、内购与审核资料未闭环

用户此前已确认通知测试实际送达、换网络后广告实际播放。这些是有价值的人工反馈，但不替代最终候选包的以下验收：

1. 新用户与老用户安装/升级；0 体力首页恢复入口保持可见，不能开启新的付费体力局；合法已付费未完成局可恢复。
2. Quiz 六题答错重试、退出重进恢复、完成后才结算六词与解锁下一组。
3. 拒绝通知可继续游戏；允许后真实时间提醒送达；无测试按钮和测试通知。
4. 激励广告看完只发一次奖励，中途关闭不发奖；无填充/隐私超时可退出；每日两次限制。
5. TestFlight / 沙盒购买、取消、恢复及重装恢复；只成功读取价格不算购买验收。
6. iPhone 小/大屏与 iPad 横竖屏；麦克风/语音拒权及英西日韩识别路径。

`docs/app-review-notes.md:11` 尚有审核账号占位符；文件不能原样粘贴提交。App Store Connect 当前实际 Notes、截图、日文元数据、App Privacy、首个 lifetime 内购与版本草稿关联均未在本次重新核验。本地总控表这些项也尚未打勾：不能据此断言后台必然缺失，但不能标为通过。

## 非阻断但需知情的事项

- 生产 `VITE_CLOUD_DAILY_QUOTA` 未开启，因此体力额度是本地状态；不应对外承诺体力跨设备同步。本次未擅自启用云配额。
- `public/qa` 与若干语音 review 网页仍会被 Vite 复制进包；约数百 KB，可在以后清理，不是目前主要包体来源。
- AdMob 的网络可达性和广告素材长度不能由编译通过保证；国内网络曾失败、换网络成功，仍需按目标市场验收。
- 本次未重新实机遍历完整 FTUE，不将先前截图、代码测试或构建通过表述为本次真机体验。
- 完整安装/下载体积以最终签名候选包在 App Store Connect 的 App File Sizes 为准；不能用本次未签名构建或旧 134 MB 代表最终包。

## 建议下一步顺序

1. 核对并更新公开隐私政策及 App Privacy，完成最终审核资料。
2. 确定最终新构建号，生成并上传候选 TestFlight 包。
3. 对同一候选包走完上述六组验收，记录证据，再由用户确认是否提交。

保持 `docs/launch-1.1-master-checklist.md` 的发布锁：本次检查不等于允许点击 Submit for Review。
