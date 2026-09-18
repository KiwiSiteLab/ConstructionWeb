# Continental Construction Ltd

面向奥克兰建筑客户的英文展示网站。原创建筑平面图风格 C 字标，炭黑、纸白与砖红配色，原生 HTML / CSS / JavaScript，无运行时依赖。

## 本地运行

需要 Node.js 20.11+（建议 Node.js 22 或以上）。无需安装依赖。

```sh
npm run dev
```

打开 http://127.0.0.1:5180 。预览服务仅监听本机地址。

```sh
npm run build
npm run check
npm run preview
```

`build` 生成 `dist/`，可部署到任意静态网站主机。资源使用相对路径，兼容 GitHub Pages 项目路径。`preview` 与 `dev` 默认共用 5180 端口，运行其中一个即可；也可设置 `PORT`。

## 已有功能

- 响应式首页、移动导航、电话与短信入口。
- 首页第二屏「Why choose Continental」：报价范围、可规划的工期、书面变更、可核验质量、沟通责任、交付与后续，面向奥克兰业主和开发商的决策关注点。
- New builds、Renovations、Recladding、Decks、Fences 五类服务；展开时切换图片。
- 六类真实业务相册，共 23 张客户提供的照片；两组 Before / After 翻新对比；灯箱保留完整图片，支持上一张、下一张、键盘方向键与 Escape 关闭，关闭后返回原焦点。
- 无缝评论滚动，悬停/聚焦暂停、手动暂停；系统开启“减少动态效果”时默认静态横向浏览，访客可主动点击 Play stories 播放。
- 滚动进入效果、首屏轻微镜头动画、减少动态效果支持。
- 本地托管照片和字体，无追踪脚本、无表单数据库、无第三方运行时请求。
- 图片来源、网站隐私说明、404 页面、基础 SEO 信息与原创 favicon。

## 内容状态（正式营销前替换）

- 公司名：Continental Construction Ltd；区域：Auckland；电话：0210622832。
- **项目相册使用客户提供的真实现场照片。** 首屏及原有服务背景继续保留 Pexels 灵感照片与标注。
- **三条客户评论为示例，不是真实客户评价。** 每张卡片与评论区均有标注；未编造评分、姓名或 Google 背书。
- 客户未提供邮箱，因此只使用电话和短信链接；没有伪造邮箱或假提交表单。
- 客户已确认团队实际持有 LBP / BCITO 相关资格并授权展示标志；具体持证人及编号待补。未编造成立年限、奖项、完工数量或工程保证。
- 「为什么选择我们」展示合作前应确认的事项，并引导客户索取具体项目的资质、保险与相关案例；不将这些建议冒充已核验的公司历史表现，也不声称有“80%”的调查数据。

## 更换真实内容

1. 将真实照片按业务文件夹放到 `public/images/`；使用 `scripts/prepare-photos.ps1` 和 `scripts/update-portfolio.mjs` 生成相册资源及数据。处理说明见 `IMAGE-PROCESSING.md`。
2. 将获授权的真实评价填到 `index.html` 的 `.review-group` 内，注明真实来源，再移除相应“示例”提示。
3. 同步更新 `credits.html` 与 `ASSETS.md`。未替换的库存照片继续保留示意标注。
4. 联系信息位于 `index.html`、`privacy.html`；所有拨号入口使用国际格式 `+64210622832`。
5. Logo 源文件：`public/brand/logo.svg`；图形标：`public/brand/mark.svg`。页面内联图形使用同一构造。
6. 修改后运行 `npm run build` 和 `npm run check`，再检查桌面/手机效果。

## 文件

`index.html` 页面内容 · `styles.css` 视觉与响应式 · `main.js` 交互 · `public/` 自托管素材 · `scripts/` 本地服务器/构建/链接检查。

设计结构参考客户提供的 https://red2.co.nz/ ，未复制其文字、Logo、照片、客户评价或资质信息。网站上传 GitHub 不等于已经绑定域名或对外部署。

## 局域网预览

运行 `npm run build` 后执行 `npm run lan`，使用此电脑的局域网 IP 和 5180 端口访问。电脑需保持运行，设备须处于可互通的局域网。
