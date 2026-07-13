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
| **删除账号**（Auth + 云端进度 + 本机该账号桶） | ✅ |
| 隐私政策页（`public/privacy.html`） | ✅ |

云同步路径：

```
users/{uid}/match3/state
  memories: WordMemory[]
  updatedAtMs: number
  updatedAt: timestamp
```

合并策略：本地与云端按「更高 stage → 更多 exposures → 更新的 lastReviewAt」取优，再写回两边。

---

## 0. Firebase 项目（vivaliang）

正式配置已指向项目 **`match3-vocab-game`**（`vivaliang1018@gmail.com`）。本地用 `.env.local` 的 `VITE_FIREBASE_*`（优先于 `firebase-applet-config.json`）。

隐私政策公网地址（GitHub Pages · `/docs`）：

```
https://vivaliang1018-ux.github.io/match3-vocab-game/privacy.html
```

写入 `.env.local` 的 `VITE_PRIVACY_POLICY_URL` 后重新 `npm run build` / `build:ios`。

---

## 1. Firebase Authentication

1. 打开 Firebase Console → 你的项目
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

仓库根目录有 `firestore.rules`（含 `allow delete`，供删除账号清云端文档）。请部署到**同一数据库**：

```bash
firebase deploy --only firestore:rules
```

或在 Console → Firestore → Rules 粘贴 `firestore.rules` 内容并发布。

未部署规则时，云同步写入会被拒绝（本地存档仍可用）。

---

## 3. 隐私政策公网 URL（App Store 必填）

源文件：`public/privacy.html`（构建后会进 `dist/`）。

1. 把仓库推到 GitHub → **Settings → Pages** → Source: Deploy from branch → `/` 或 `/docs`（若用 `dist` 需单独 Actions；最简单是把 `privacy.html` 挂在 Pages 根）
2. 公网地址示例：

```
https://YOUR_GITHUB_USERNAME.github.io/match3-vocab-game/privacy.html
```

3. 写入 `.env.local`：

```
VITE_PRIVACY_POLICY_URL=https://YOUR_GITHUB_USERNAME.github.io/match3-vocab-game/privacy.html
```

4. 重新 `npm run build` / `build:ios`。App 内「我的 → 隐私政策」与 App Store Connect 的 Privacy Policy URL 都用这个 HTTPS 链接。

未设置时，应用会回退到包内 `privacy.html`（模拟器可用，**不能**填进 App Store Connect）。

---

## 4. 删除账号（App 内）

路径：**我的 → 删除账号** → 确认。

流程：

1. 删除 Firestore `users/{uid}/match3/state`
2. 清除本机该 uid 对应的学习进度
3. 调用 Firebase Auth `deleteUser`

若提示「需重新登录」：先退出再登录，然后立刻再删（Firebase `requires-recent-login`）。

---

## 5. 怎么测

```bash
npm run dev
```

1. **我的** → **登录 / 注册**
2. 用 **Apple** / **Google** / **邮箱** 登录
3. 玩几局产生学习记录
4. 换浏览器无痕窗口（或另一台设备）登录同一账号 →「已学 / 复习」应恢复
5. **删除账号** → 无法再登录；云端文档消失；本机该账号进度清空

iOS：

```bash
npm run build:ios && npx cap open ios
```

真机测 Apple 登录（模拟器对 Apple ID 支持有限）。

---

## 6. 常见问题

**Apple 按钮点了没反应 / provider_disabled**  
→ Firebase 未启用 Apple，或 Apple Developer 未开 Sign in with Apple。

**邮箱登录失败 / operation-not-allowed**  
→ Console 未启用「电子邮件/密码」。

**云同步不生效**  
→ 检查 Firestore Rules 是否已发布；看控制台是否有 `[match3] cloud memory` 警告。

**删除账号失败 / requires_recent_login**  
→ 退出后重新登录，马上再点删除。

**登录后进度变少**  
→ 合并取「更强」进度；若另一端几乎为空，会以上传端为准。

**Web 上 Apple 登录失败**  
→ Web 需要额外配置 Apple Services ID 与域名；iOS App 内用原生按钮更稳。
