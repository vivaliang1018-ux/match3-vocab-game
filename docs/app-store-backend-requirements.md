# 上线前账号删除核对项

## Sign in with Apple 凭证撤销

当前客户端能删除 Firebase Auth 用户及本 App 的 Firestore 学习数据。按照 Apple 的账号删除要求，使用 Sign in with Apple 的账号在删除时还会重新请求 Apple 授权，并在删除账号前撤销 Apple 授权凭证。

本项目使用 Firebase iOS SDK 官方支持的客户端撤销流程，不需要在 App 内保存 Apple 私钥：

1. 删除操作开始时检查 Firebase 用户是否关联 `apple.com`。
2. Apple 用户通过系统登录界面重新认证，取得新的 authorization code；凭证只短暂保存在内存。
3. 删除该 UID 对应的 Firestore 学习数据。
4. 调用 Firebase iOS SDK `revokeToken(withAuthorizationCode:)` 撤销 Apple token。
5. 删除 Firebase Auth 用户，成功后清除本地账号数据。

Apple 私钥、client secret 与 provider token **不得放入 App 或本仓库**。提交前必须在真机使用 Apple 测试账号完成一次“重新授权 → 撤销 → 删除”的端到端测试。
