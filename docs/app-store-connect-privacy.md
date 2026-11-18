# App Store Connect 隐私标签填写草案

> 状态：代码审查后的填写基线。上传最终 Archive 后，仍须用 Xcode Privacy Report 与 App Store Connect 提示复核，不能直接照抄而不验证。

## 2026-10-17 后台实际更新

已在 App Privacy 发布补充：产品交互的 Analytics / Third-Party Advertising；Device ID 的 Third-Party Advertising；Coarse Location 的 Analytics / Third-Party Advertising。新增 Advertising Data（关联；分析/第三方广告）、Crash Data（不关联；分析/App 功能）、Performance Data（按 Google 官方披露保守申报关联；分析/App 功能/第三方广告）。原有类型保留，目前 13 类型全部完成设置。未开启追踪或个性化广告，未提交 App 版本审核。

已核对 Google 官方数据披露：<https://developers.google.com/admob/ios/privacy/data-disclosure>、<https://firebase.google.com/docs/ios/app-store-data-collection>。SDK 清单中的通用能力与当前实际 NPA/无 IDFA 请求设置需区分，未来更换广告模式或增加服务后须重新核对。

## 建议答案

- 是否收集数据：**是**。账号数据只在用户登录时处理；Google Mobile Ads 可能在用户主动观看激励广告时处理广告技术数据。
- 用于追踪：**不要沿用原来的“否”而不复核**。当前 App 不请求 ATT、广告请求为非个性化；但 Google 明确说明 SDK 可能为第三方广告和分析处理设备 ID。请以上传后的 Xcode Privacy Report、最终 SDK 隐私清单和 App Store Connect 对“追踪”的定义逐项确认。
- 联系信息 → 姓名：与用户身份关联；用途为 App 功能。
- 联系信息 → 电子邮件地址：与用户身份关联；用途为 App 功能。
- 标识符 → 用户 ID：与用户身份关联；用途为 App 功能。
- 使用数据 → 产品交互：学习进度与保存状态；与用户身份关联；用途为 App 功能和产品个性化（间隔复习内容调整）。
- 使用数据 → 产品交互：另包含 Google Analytics for Firebase 的课程选择、切换语言、开局、完成词组/Quiz、成绩及开始复习；用途须包括分析。游客也会产生这些事件，不能只申报登录后的学习保存数据。
- Google Analytics for Firebase：复核应用实例/设备标识、设备信息、粗略位置和自动使用事件的数据类型及用途；不能把“不设置账号 user ID”直接等同于 Apple 定义的“不关联用户”。按最终 SDK 配置和隐私报告判断。
- 音频数据：语音模式优先使用 Apple 设备端识别；设备不支持时，音频可能发送至 Apple 在线识别，开发者服务器不接收或保存录音。提交前需根据此处理方式复核 App Store 隐私申报，不应继续依据“完全不离开设备”判断。
- 联系信息 → 电话号码：与用户身份关联；用途为 App 功能（Google Sign-In SDK 清单声明）。
- 位置 → 粗略位置：与用户身份关联；用途为 App 功能（Google Sign-In SDK 清单声明）。
- 标识符 → 设备 ID：与用户身份关联；用途为分析（Google Sign-In SDK 清单声明）。
- 使用数据 → 其他使用数据：与用户身份关联；用途为分析（Google Sign-In SDK 清单声明）。
- 其他数据：与用户身份关联；用途为 App 功能和分析（Google Sign-In SDK 清单声明）。
- 诊断 → 其他诊断数据：不与用户身份关联；用途为分析（Firebase Auth SDK 清单声明）。
- 位置 → 粗略位置：用于第三方广告/分析（Google Mobile Ads 可由 IP 推断）。
- 标识符 → 设备 ID：用于第三方广告/分析（Google Mobile Ads；即使非个性化广告也可能用于频次控制和汇总报告）。
- 使用数据 → 广告数据：用于第三方广告和分析。
- 使用数据 → 产品交互：广告观看与互动；用于第三方广告和分析。
- 诊断 → 崩溃数据、性能数据：用于 App 功能、第三方广告或分析；以最终 Privacy Report 为准。

上述 Google/Firebase 项目来自本次 Release 产物内嵌的 `PrivacyInfo.xcprivacy`，即使 App 没有自行实现通用分析，也不能忽略 SDK 的声明。如果提交前移除 Google 登录，应重新 Archive，并按新 Privacy Report 缩减标签。

## URL 与年龄分级

- Privacy Policy URL: `https://vivaliang1018-ux.github.io/match3-vocab-game/privacy.html`
- Support URL: `https://vivaliang1018-ux.github.io/match3-vocab-game/support.html`
- Terms URL（审核备注可附）: `https://vivaliang1018-ux.github.io/match3-vocab-game/terms.html`
- 选择普通全年龄应用的年龄分级问卷结果；**不要选择 Kids Category，也不要在副标题/关键词中写 “For Kids”**。

## 提交前核对

1. 三个 URL 均能在未登录浏览器中 HTTPS 打开，且显示 LingoMatch 与 Bundle ID `com.matchingo.game`。
2. 最终 Archive 不包含 Facebook SDK 或 `ep1.facebook.com`；应包含 Google Mobile Ads 与 UMP 的隐私清单，并与隐私标签一致。
3. App Store Connect 隐私标签、网页隐私政策和最终二进制三者一致。
