# Haiyue Studio website

面向海外 App Store 的英文静态官网。只包含官网素材和文案，不包含游戏源码、账户凭证或支付数据。无需 npm 依赖、外部字体、前端脚本、分析 SDK 或数据库。

## 本地预览

需要 Node.js 22+：

```sh
npm run build
npm run check
python3 -m http.server 4173 --directory _site --bind 127.0.0.1
```

打开 http://127.0.0.1:4173/ 。不要直接双击 HTML：网站使用根路径链接。生成目录 `_site` 不提交，源码在 `scripts/build.mjs`、`assets/` 和 `site.config.json`。

## 当前状态

- 首页、游戏介绍、支持、隐私政策草稿和 404 已建立。
- 公开邮箱：qingque60@gmail.com（用户确认）。
- 使用真实游戏截图和已有琉璃月亮品牌素材。
- App Store 下载链接尚未提供；页面显示 Coming to iOS，不伪造下载按钮。
- AdMob 尚未配置；`app-ads.txt` 仅有注释，**不能用于完成 AdMob 验证**。
- 隐私政策需要在正式广告配置确定后复核，包含广告数据类别、同意流程、支付、托管与支持联系说明。目前明确标为草稿，不能当作完成的上架材料。
- 本次仅准备本地网站与部署工作流；尚未推送或发布。

## 配置

编辑 `site.config.json` 后重新构建：

| 字段 | 说明 |
| --- | --- |
| supportEmail | 公开客服与隐私联系邮箱 |
| appStoreUrl | 上线后的真实 https://apps.apple.com/ 链接；留空显示即将上线 |
| adMobPublisherId | 从 AdMob 获取的 `pub-` + 16 位数字，**不是** App ID 或广告位 ID |
| privacyReviewed | 与最终 iOS 版本核对隐私政策后改为 true，去除公开草稿提示 |
| policyUpdated | 隐私政策实际修订日期 |

生成的 Google 授权行为 `google.com, pub-实际发布商编号, DIRECT, f08c47fec0942fa0`。接入时必须与 AdMob 后台“如何设置 app-ads.txt”给出的专属代码逐字核对。没有授权其他广告平台；后续加入中介平台时更新生成器和政策。

`npm run check:release` 会在缺失发布商 ID 或隐私复核时失败；常规 `check` 允许发布明确标注的预上线网站。下载链接在应用上线前可为空。检查不能代替人工审阅或 AdMob 抓取验证。

## 发布到 GitHub Pages

1. 在 GitHub 仓库 Settings → Pages → Build and deployment，把 Source 设置为 **GitHub Actions**。
2. 提交并推送代码到 `main`。工作流构建、检查并部署 `_site`，不部署整个仓库。
3. 在 Actions 中确认 Publish website 成功。
4. 验证以下地址公开访问；首次上线可能需要等待。

| 用途 | 地址 |
| --- | --- |
| 官网 | https://haiyuestudio.github.io/ |
| App Store 营销网址 | https://haiyuestudio.github.io/calendar-puzzle/ |
| App Store 技术支持网址 | https://haiyuestudio.github.io/support/ |
| 隐私政策网址（完成复核后） | https://haiyuestudio.github.io/privacy/ |
| AdMob 根路径文件 | https://haiyuestudio.github.io/app-ads.txt |

App Store Connect 的 **营销网址**需要填写官网游戏介绍页，不能只填支持网址。公开上线后，AdMob 才能从商店的开发者网站链接发现授权文件并完成关联。其他游戏可加入同一个站点；如数据处理不同，应提供各自准确的隐私政策。

## 隐私文案依据

- 本地 iOS 游戏、StoreKit 及 AdMob/UMP 实现（2026-09-22 检查）。广告请求使用 npa=1，不代表完全不处理用户数据。
- https://developers.google.com/admob/ios/privacy/data-disclosure
- https://developers.google.com/admob/ios/privacy
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://support.google.com/admob/answer/9363762?hl=en

发布前确认对外使用的经营主体信息及适用地区要求；如 Haiyue Studio 是品牌而不是法律主体，在政策中补充实际运营者信息。
