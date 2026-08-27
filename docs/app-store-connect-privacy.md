# App Store Connect 隐私标签填写草案

> 状态：代码审查后的填写基线。上传最终 Archive 后，仍须用 Xcode Privacy Report 与 App Store Connect 提示复核，不能直接照抄而不验证。

## 建议答案

- 是否收集数据：**是**（仅在用户选择登录时）。
- 用于追踪：**否**。不使用广告、ATT 或跨 App/网站追踪。
- 联系信息 → 姓名：与用户身份关联；用途为 App 功能。
- 联系信息 → 电子邮件地址：与用户身份关联；用途为 App 功能。
- 标识符 → 用户 ID：与用户身份关联；用途为 App 功能。
- 使用数据 → 产品交互：学习进度与保存状态；与用户身份关联；用途为 App 功能和产品个性化（间隔复习内容调整）。
- 音频数据：**不收集**。语音模式仅允许 Apple 设备端识别，录音不上传开发者服务器。
- 联系信息 → 电话号码：与用户身份关联；用途为 App 功能（Google Sign-In SDK 清单声明）。
- 位置 → 粗略位置：与用户身份关联；用途为 App 功能（Google Sign-In SDK 清单声明）。
- 标识符 → 设备 ID：与用户身份关联；用途为分析（Google Sign-In SDK 清单声明）。
- 使用数据 → 其他使用数据：与用户身份关联；用途为分析（Google Sign-In SDK 清单声明）。
- 其他数据：与用户身份关联；用途为 App 功能和分析（Google Sign-In SDK 清单声明）。
- 诊断 → 其他诊断数据：不与用户身份关联；用途为分析（Firebase Auth SDK 清单声明）。

上述 Google/Firebase 项目来自本次 Release 产物内嵌的 `PrivacyInfo.xcprivacy`，即使 App 没有自行实现通用分析，也不能忽略 SDK 的声明。如果提交前移除 Google 登录，应重新 Archive，并按新 Privacy Report 缩减标签。

## URL 与年龄分级

- Privacy Policy URL: `https://vivaliang1018-ux.github.io/match3-vocab-game/privacy.html`
- Support URL: `https://vivaliang1018-ux.github.io/match3-vocab-game/support.html`
- Terms URL（审核备注可附）: `https://vivaliang1018-ux.github.io/match3-vocab-game/terms.html`
- 选择普通全年龄应用的年龄分级问卷结果；**不要选择 Kids Category，也不要在副标题/关键词中写 “For Kids”**。

## 提交前核对

1. 三个 URL 均能在未登录浏览器中 HTTPS 打开，且显示 Matchingo 与 Bundle ID `com.matchingo.game`。
2. 最终 Archive 不包含 Facebook SDK、`ep1.facebook.com` 或广告追踪域名。
3. App Store Connect 隐私标签、网页隐私政策和最终二进制三者一致。
