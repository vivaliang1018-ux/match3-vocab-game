# App Review 备注模板

将尖括号内容替换为真实值后粘贴到 App Store Connect。不要提交占位符。

## English review notes

Matchingo is a general-audience vocabulary game. It is not submitted to the Kids Category. Reviewers can use all guest gameplay without signing in.

Optional account features can be reviewed with:

- Email: `<REVIEW_ACCOUNT_EMAIL>`
- Password: `<REVIEW_ACCOUNT_PASSWORD>`

Path: launch the app → Continue on the legal notice → Me → Sign in. Account deletion is available at Me → account settings → Delete account.

Sign in with Apple and Google Sign-In are optional alternatives. Signed-in learning progress is stored in Firebase for cross-device sync. No advertising or cross-app tracking is used.

Say & Blast uses microphone and Speech Recognition permissions. The feature starts only when Apple on-device English speech recognition is supported; microphone audio is not uploaded to the developer’s servers. Please test this feature on a physical iPhone with on-device English recognition available.

Support: https://vivaliang1018-ux.github.io/match3-vocab-game/support.html

Privacy: https://vivaliang1018-ux.github.io/match3-vocab-game/privacy.html

## 提交前必须完成

- 在生产 Firebase 项目创建专用审核账号，预先验证邮箱并确认能登录、同步和删除。
- 不要使用开发者个人账号；审核期内不要改密码或删除该账号。
- 若不提供审核账号，需确认所有登录后功能均可由审核员自行注册且不会受验证码、地区或限流阻断；提供账号更稳妥。
