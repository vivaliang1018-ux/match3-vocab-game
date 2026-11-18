# App Review 备注模板

将尖括号内容替换为真实值后粘贴到 App Store Connect。不要提交占位符。

## English review notes

LingoMatch is a general-audience vocabulary game. It is not submitted to the Kids Category. Reviewers can use all guest gameplay without signing in.

Optional account features can be reviewed with:

- Email: `<REVIEW_ACCOUNT_EMAIL>`
- Password: `<REVIEW_ACCOUNT_PASSWORD>`

Path: launch the app → Continue on the legal notice → Me → Sign in. Account deletion is available at Me → account settings → Delete account.

Sign in with Apple and Google Sign-In are optional alternatives. Signed-in learning progress is stored in Firebase for cross-device sync.

Free play starts with 3 stamina per day. When stamina reaches zero, the user may voluntarily watch a Google rewarded ad to refill to 3 stamina, up to twice per day. The reward is granted only after the rewarded-ad completion callback. There are no banner, automatic interstitial, or app-open ads. Ad requests are non-personalized and the app does not request ATT permission. A completed 60-second Say & Blast run with at least 70% accuracy earns three stars and restores 1 stamina; there is no minimum target count. The non-consumable LingoMatch Plus purchase removes stamina limits from Adventure, Category, and Mood boards and provides three Mood Boards per day.

Say & Blast uses microphone and Speech Recognition permissions for the selected course language. Recognition prefers on-device processing when supported; otherwise it uses Apple's online service and requires internet access. The developer's servers do not receive or store microphone recordings. Please test on a physical iPhone, including Spanish and Korean courses with an internet connection.

Support: https://vivaliang1018-ux.github.io/match3-vocab-game/support.html

Privacy: https://vivaliang1018-ux.github.io/match3-vocab-game/privacy.html

## 提交前必须完成

- 在生产 Firebase 项目创建专用审核账号，预先验证邮箱并确认能登录、同步和删除。
- 不要使用开发者个人账号；审核期内不要改密码或删除该账号。
- 若不提供审核账号，需确认所有登录后功能均可由审核员自行注册且不会受验证码、地区或限流阻断；提供账号更稳妥。
