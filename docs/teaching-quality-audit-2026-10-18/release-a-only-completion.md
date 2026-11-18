# A 组释义修复结果

本次只执行获批 A 组母语释义修复。实际修改 **98 个课程释义、23 个 Emoji**。未修改原始学习词、Emoji ID、数量、课程定义、游戏/Quiz/复习/进度/购买/登录逻辑；未修改或生成 MP3。B、C 组不执行。

## 待确认的语义冲突

`tired-face-2` / `zh-CN-ja`：原学习词 `疲れた` 是“疲惫／累了”，并不是“疲惫的脸”。按用户的冲突处理要求，此方向保留原释义，暂不执行“痛苦 → 疲惫的脸”。建议用户确认后仅将该方向中文改为“疲惫”。西语 `cara cansada`、韩语 `피곤한 얼굴` 的中文已按要求改“疲惫的脸”。

## 按实际目标词处理的范围

- 🤲 英、西目标词的法语说明掌心向上；日语目标词按并排双手、韩语目标词按伸出的双手翻译，不强加合十姿势。
- 🍥 英、日目标词的法、德释义说明日式漩涡鱼糕；西语目标词按日式鱼糕；韩语 `어묵` 保持泛指鱼糕，不强加日本或漩涡属性。
- 📪 西、日目标词中文为空的关闭信箱；韩语目标词明确说旗子放下，中文按旗子放下的关闭信箱，不改成“空”。
- 🎦 韩语 `영화` 的释义按电影；西语 `cine` 保留电影/影院范围，仅修英语错误名称、中文标志及德语标志等明确不等义项。
- 📩 只修韩语 `보낸 편지` 的中文和日语错误项；其他课程的不同实际学习词不连带改动。

## 验证

- `npx tsx scripts/verify-release-gloss-fixes.ts`：1,117 词条 × 24 课程 = 26,808 单元，全部学习词不变；仅 98 个批准单元变化，公开资源逐文件 SHA-256 不变。
- `npx tsx --test tests/*.test.ts`：61 项通过，0 失败。
- `npx tsx scripts/verify-course-gloss-followup.ts`：通过，原性别与释义守卫保留。
- `npm run course:audit`、`npx tsx scripts/export-course-translation-audit.ts`：通过，24 方向完整。
- `npm run lint`：0 错误；既有文件存在警告，本次未扩改处理。
- `npm run build:ios`：TypeScript、生产构建、Capacitor iOS 同步成功。不表示已经在真机完成 UI 验收或上传新构建。

逐项前后对照：[release-a-only-changes.json](./release-a-only-changes.json)。
机器核对结果：[release-a-only-result.json](./release-a-only-result.json)。
修改前快照：[release-a-only-before.json](./release-a-only-before.json)。
