# Privacy Policy / 隐私政策

**Last updated / 最后更新:** October 17, 2026

**App / 应用名称:** LingoMatch
**Bundle ID:** `com.matchingo.game`  
**Contact / 联系方式:** vivaliang1018@gmail.com

> **Canonical public page:** [`public/privacy.html`](../public/privacy.html)  
> Host that file at a **public HTTPS URL** (e.g. GitHub Pages) and set `VITE_PRIVACY_POLICY_URL` + App Store Connect Privacy Policy URL to the same link.

---

## English

### Overview

LingoMatch is a vocabulary match-3 game. You can play as a guest without an account. Optional sign-in (Apple, Google, or email/password via Firebase Authentication) lets you sync learning progress across devices using Cloud Firestore. Free players may voluntarily watch a rewarded ad to refill stamina. We do not sell personal information, request App Tracking Transparency permission, or use personalized ads.

### Information we process

| Data | Where | Purpose |
|------|--------|---------|
| Account identifiers (email, Apple/Google account ID, display name/photo if provided) | Firebase Authentication | Sign-in and account management |
| Learning progress (word memory stages, review times, exposures) | On device; also Cloud Firestore when signed in | Spaced repetition and “Learned” stats; cross-device sync |
| Preferences (language, music, SFX, legal notice state) | On device only | Remember settings |
| Authentication technical data (including provider-declared phone number, coarse location, device ID, usage/interaction, other account data, and diagnostics) | Apple, Google, and Firebase as applicable | Sign-in, abuse prevention, reliability, and provider authentication analytics |
| Rewarded-ad technical data (such as IP-derived coarse location, device/app identifiers, ad views and interactions, crash logs, and performance data) | Google Mobile Ads and User Messaging Platform | Serve an optional non-personalized rewarded ad, frequency capping, aggregated reporting, fraud prevention, consent, and reliability |

### Learning analytics and notifications

On iOS, we use Google Analytics for Firebase to understand course selection, language switches, games started, sets and quizzes completed, quiz scores, and reviews started. Analytics may also process app-instance identifiers, device/app information, approximate location, and automatically collected usage events. These reports help us measure learning engagement and improve the app. Our custom event parameters do not include names, email addresses, or microphone recordings; we do not set a signed-in account ID as the Analytics user ID. Guest play may also generate analytics events.

With your permission, learning, streak, and energy reminders are scheduled locally on your device. You can change reminder categories and times in the app, or disable notifications in iOS Settings. Preferences for new content and events are saved, but remote new-content and event notifications are not currently sent.

### Service providers

In addition to the services below, we use **Google Analytics for Firebase** for learning engagement analytics as described above.

We use **Google Firebase** (Authentication and Cloud Firestore), **Sign in with Apple**, **Google Sign-In**, and **Google Mobile Ads with the User Messaging Platform**. Rewarded ads load only after the user chooses to watch one. Ad requests are marked non-personalized, but Google explains that non-personalized ads may still use cookies or mobile identifiers for frequency capping and aggregated reporting. Providers must protect information consistently with this policy and applicable law. See [Firebase privacy](https://firebase.google.com/support/privacy), [Google Mobile Ads data disclosure](https://developers.google.com/admob/ios/privacy/data-disclosure), and the [Google Privacy Policy](https://policies.google.com/privacy).

### What LingoMatch does not directly collect

- LingoMatch does not request precise Location Services, Contacts, or Photos library access. Google Sign-In may process coarse location and related technical data as described above.
- Microphone recordings are not uploaded to LingoMatch or the developer’s servers
- LingoMatch does not request ATT permission or use the IDFA for personalized cross-app advertising
- LingoMatch does not show automatic interstitial, banner, or app-open ads; the only ad placement is an optional rewarded ad selected by the user

### Speech and audio

The app plays bundled pronunciation audio and may use on-device text-to-speech. Say & Blast uses Apple speech recognition for the selected course language. It prefers on-device processing when supported; otherwise audio may be sent to Apple for online recognition, which requires an internet connection. LingoMatch does not receive or store microphone recordings on its own servers.

### Account deletion and data deletion

While signed in, open **Profile → Delete account**. This permanently deletes your Firebase Authentication account and associated cloud learning data for this app, and clears related progress stored on that device. Guest (local-only) progress is removed when you uninstall the app or clear app data.

### Children’s privacy

LingoMatch is a general-audience app and is not submitted to the App Store Kids Category. Guest play does not require an account. Users under 13 (or the applicable minimum digital-consent age in their region, if higher) may use guest mode but must not create an account. A minor above that threshold may create an account only with parent or legal-guardian authorization where required by local law. If we learn that personal information was collected from a child below the applicable threshold, contact us and we will delete it.

### Contact

Questions: [vivaliang1018@gmail.com](mailto:vivaliang1018@gmail.com)

---

## 简体中文

### 概述

「LingoMatch」是一款词汇消消乐学习应用。您可以不登录、以访客身份游玩。可选登录（Apple、Google 或邮箱密码，由 Firebase Authentication 提供）后，学习进度可通过 Cloud Firestore 跨设备同步。免费玩家可主动选择观看激励广告以恢复体力。我们不会出售个人信息，不请求 App Tracking Transparency 权限，也不投放个性化广告。

### 我们处理的信息

| 数据 | 存储位置 | 用途 |
|------|----------|------|
| 账号标识（邮箱、Apple/Google 账号标识，以及提供方返回的昵称/头像等） | Firebase Authentication | 登录与账号管理 |
| 学习进度（复习阶段、下次复习时间、曝光次数等） | 本机；登录后同步至 Cloud Firestore | 间隔复习、「已学」统计与跨设备同步 |
| 偏好设置（语言、音乐、音效、法律提示状态） | 仅本机 | 记住设置 |
| 认证技术数据（包括服务商声明的手机号、粗略位置、设备 ID、使用/交互、其他账号及诊断数据） | 由 Apple、Google 与 Firebase 按实际功能处理 | 登录、防滥用、可靠性与服务商认证分析 |
| 激励广告技术数据（如由 IP 推断的粗略位置、设备/App 标识符、广告展示与互动、崩溃和性能数据） | Google Mobile Ads 与 User Messaging Platform | 提供用户主动选择的非个性化激励广告、频次控制、汇总报告、防欺诈、同意管理与可靠性 |

### 学习行为分析与通知

iOS 版本使用 Google Analytics for Firebase，了解课程选择、语言切换、开始游戏、完成词组与小测、小测成绩及开始复习等行为。分析服务还可能处理应用实例标识符、设备/App 信息、粗略位置及自动收集的使用事件，用于了解学习参与情况和改进产品。我们自定义的事件参数不包含姓名、邮箱或麦克风录音，也不将登录账号 ID 设置为 Analytics 用户 ID。游客模式也可能产生分析事件。

经您允许，学习、连续学习及体力恢复提醒会在设备本地安排。您可在 App 内调整提醒类别和时间，或在 iOS 设置中关闭通知。新内容与活动的接收偏好会保存，但目前尚未发送远程新内容或活动通知。

### 第三方服务

除下列服务外，我们还使用 **Google Analytics for Firebase** 进行上述学习行为分析。

我们使用 **Google Firebase**（Authentication 与 Cloud Firestore）、**通过 Apple 登录**、**Google 登录**，以及 **Google Mobile Ads 与 User Messaging Platform**。只有用户主动点击后才会加载激励广告；广告请求标记为非个性化，但 Google 说明非个性化广告仍可能使用 Cookie 或移动标识符进行频次控制与汇总报告。服务商须按照本政策与适用法律提供同等保护。相关处理适用 [Firebase 隐私说明](https://firebase.google.com/support/privacy)、[Google Mobile Ads 数据披露](https://developers.google.com/admob/ios/privacy/data-disclosure) 与 [Google 隐私政策](https://policies.google.com/privacy)。

### 注销账号与数据删除

登录后，请到 **我的 → 删除账号**。将永久删除您的 Firebase 登录账号及本应用对应的云端学习数据，并清除该设备上相关进度。访客（仅本地）进度可在卸载应用或清除应用数据后删除。

### 语音与未成年人

「开口出击」根据所选课程语言使用 Apple 语音识别，支持时优先在设备端处理；否则音频可能发送至 Apple 进行在线识别，需要网络连接。LingoMatch 自有服务器不接收或保存麦克风录音。本应用属于普通全年龄应用，不申请 App Store 儿童类别。13 岁以下用户（如所在地区规定更高的最低数字同意年龄，则以该年龄为准）可以使用游客模式，但不得创建账号。达到该年龄但仍属未成年人的用户，仅可在当地法律要求的父母或法定监护人授权下创建账号。如果我们得知误收集了低于适用年龄门槛的儿童个人信息，请联系我们，我们将予以删除。

### 联系我们

隐私相关问题请联系：[vivaliang1018@gmail.com](mailto:vivaliang1018@gmail.com)
