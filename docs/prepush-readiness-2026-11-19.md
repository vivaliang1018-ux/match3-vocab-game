# LingoMatch Git 推送前检查（2026-11-19）

本次只检查并添加审计工具/报告，没有 stage、commit、push、删除音频、同步 iOS 或修改游戏代码。Web 构建输出到 `/tmp/lingomatch-prepush-web-20261119`。

## 已通过

- 当前词库 1,117 项，ID 唯一数量 1,117。
- 24 个实际课程方向，遍历 26,808 个词条/课程组合，学习词与母语释义均非空。这是字段完整性，不是语言正确性审校。
- 英、西、日、韩各 1,117 个 MP3，共 4,468 个。按运行时实际 URL 映射，主路径和备选路径均无缺失，无孤立文件、Unicode/大小写规范化重名。
- 全部 MP3 经 ffprobe 读取音轨和时长有效，统一 MP3 / 24,000 Hz / 单声道。未重新听审，也不以探测结果宣称发音正确。
- 四语全部文件与 `ios/App/App/public` 中对应录音 SHA-256 相同，无 iOS 缺失。
- 原有根项目回归 61/61 通过；课程命名审计无缺项；TypeScript + Vite 构建通过；顶层依赖检查未发现未满足依赖；git diff --check 无错误。
- iOS Info.plist、PrivacyInfo.xcprivacy 与 project.pbxproj 格式检查通过，App.entitlements、GoogleService-Info.plist 和已锁定 Swift 包文件存在。本次未重新做 iOS Archive 或真机验收。
- .env.production 的变量名均有 .env.example 覆盖，不需要把生产值写入仓库才能说明配置方法。

## Git 状态与风险

- 本地最近提交：807531a8（2026-09-25）。当前 74 条已跟踪修改/删除状态，以及约 100 条未跟踪文件/目录状态，不等于仅有 100 个文件。
- 英语音频已有跟踪，但有一段替换及一个文件名修正；西/日/韩共 3,351 个音频文件仍未纳入版本控制，必须包含在 App 资源提交中。
- GitHub 远端只读查询失败/无响应，尚未确认远端当前 SHA，也没有声称已同步。
- .gitignore 尚未排除 `.env.production` 与 `release-artifacts/`。后者包含归档、签名描述文件及应用资源副本，不能直接 git add 全仓库。
- `tools/spanish-voice-generator/.env.local` 已被 *.local 忽略，不能强制加入。
- 非环境配置、非生成目录的常见源文件扫描没有命中所检查的私钥/PAT/sk token 特征。此为有限规则扫描，不是所有格式秘密的安全认证；不在报告中记录任何配置值。
- `marketing/` 待跟踪约 700 MB，含约 64 MB 和 100 MB 的 PSD。`audio-work/` 约 133 MB，`release-artifacts/` 约 164 MB（文件字节累计）。代码备份应与这些设计源文件、生成批次和二进制归档分开规划。
- PROJECT_SCOPE.md 明确要求微信小程序独立。`miniapp/` 当前仍位于此仓库且未跟踪，不能在本次海外 App 提交中默认混入；也不能删除它。

## 额外发现

临时 Web 构建仍包含 `spanish-laughter-replacements-review.html`，当前 Vite 内部审阅资源排除清单漏了这一项。不是音频缺失，也不阻碍代码备份；但下一次 Web/iOS 正式重建发布前应修复。当前 iOS 包未被本次临时构建覆盖。

## 推荐提交边界（尚未执行）

包含：App `src/`、原生 iOS 源码及项目配置/锁文件、package.json/lock、运行所需 public 资源（四语 MP3、课程插画、徽章等）、构建脚本、回归测试和必要说明/配置示例。

排除：生产配置值、凭据、node_modules、dist、iOS 内置构建资源副本、Xcode 归档、缓存、已生成审阅/试听网页与样本、音频源下载副本、临时 pending/bak 清单。营销源设计与小程序单独备份/管理，不能丢弃。

下一步先整理忽略规则和精确提交清单，再审核 staged diff，最后核实远端/推送结果。GitHub 推送完成并不意味着可删除项目中的音频；下载副本也必须逐文件校验后再清理。
