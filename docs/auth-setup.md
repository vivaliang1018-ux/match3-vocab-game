# 登录与云同步配置指南

## 当前已实现

| 功能 | 状态 |
|------|------|
| Sign in with Apple | ✅（iOS 原生 + Web OAuth） |
| Google 登录 | ✅ |
| 邮箱注册 / 登录 | ✅ |
| 本机按账号存档 | ✅ |
| 访客进度合并到账号 | ✅ |
| Firestore 云同步学习记录 | ✅ |
| 退出登录 | ✅ |

云同步路径：

```
users/{uid}/match3/state
  memories: WordMemory[]
  updatedAtMs: number
  updatedAt: timestamp
```

合并策略：本地与云端按「更高 stage → 更多 exposures → 更新的 lastReviewAt」取优，再写回两边。

---

## 1. Firebase Authentication

1. 打开 [Firebase Console](https://console.firebase.google.com/) → 项目 `gen-lang-client-0267908863`
2. **Authentication → Sign-in method** 启用：
   - **Apple**
   - **Google**
   - **电子邮件/密码**

### Apple 额外步骤（必做）

1. [Apple Developer](https://developer.apple.com/account) → Identifiers → 为 Bundle ID `com.match3vocab.game` 开启 **Sign In with Apple**
2. Firebase → Authentication → Apple → 按提示填写 Services ID / Team ID / Key（Web 登录需要；纯 iOS App 内登录主要靠原生能力）
3. Xcode 中确认 Target 已有 **Sign in with Apple** capability（本仓库已加 `App/App.entitlements`）

### iOS 原生插件

已安装 `@capacitor-firebase/authentication`，`capacitor.config.ts` 中：

```ts
FirebaseAuthentication: {
  skipNativeAuth: true, // 认证落在 JS SDK，Firestore 共用同一会话
  providers: ['apple.com', 'google.com'],
}
```

首次接入后执行：

```bash
npm run build:ios
# 或
npx cap sync ios
```

若 Google 原生登录失败，可在 Firebase 添加 iOS App 并放入 `GoogleService-Info.plist`；邮箱与 Apple 不依赖该文件也能测。

---

## 2. Firestore 规则

仓库根目录有 `firestore.rules`。请部署到**同一数据库**（配置里的 `firestoreDatabaseId`）：

```bash
# 若已安装 firebase-tools 并登录
firebase deploy --only firestore:rules
```

或在 Console → Firestore → Rules 粘贴 `firestore.rules` 内容并发布。

未部署规则时，云同步写入会被拒绝（本地存档仍可用）。

---

## 3. 怎么测

```bash
npm run dev
```

1. **我的** → **登录 / 注册**
2. 用 **Apple** / **Google** / **邮箱** 登录
3. 玩几局产生学习记录
4. 换浏览器无痕窗口（或另一台设备）登录同一账号 →「已学 / 复习」应恢复

iOS：

```bash
npm run build:ios && npx cap open ios
```

真机测 Apple 登录（模拟器对 Apple ID 支持有限）。

---

## 4. 常见问题

**Apple 按钮点了没反应 / provider_disabled**  
→ Firebase 未启用 Apple，或 Apple Developer 未开 Sign in with Apple。

**云同步不生效**  
→ 检查 Firestore Rules 是否已发布；看控制台是否有 `[match3] cloud memory` 警告。

**登录后进度变少**  
→ 合并取「更强」进度；若另一端几乎为空，会以上传端为准。

**Web 上 Apple 登录失败**  
→ Web 需要额外配置 Apple Services ID 与域名；iOS App 内用原生按钮更稳。
