# 小说宇宙 · 作品展示站

一个纯静态（HTML + CSS + JS）的小说作品集展示站，可直接部署到 **GitHub Pages** 免费访问。
无需构建工具，无需服务器，提交即上线。

## 目录结构

```
site/
├── index.html                  # 书库主页（所有作品入口）
├── novels/
│   ├── yuanli-jiuchashi.html   # 《愿力纠察使》玄幻篇（创作中）
│   ├── kehuan.html             # 《替身》科幻篇（创作中）
│   ├── qixie-jiyuan.html       # 《契械纪元》科幻篇（创作中）
│   ├── fanzheng-zhinan.html    # 《未来造反指南》科幻篇（创作中）
│   └── zhexue.html             # 《哲学与诗与梦》游戏篇（创作中）
└── assets/
    ├── css/
    │   ├── common.css          # 全站通用：导航 / 页脚 / 区块标题 / 按钮
    │   ├── index.css           # 主页书架布局 + 各作品书卡封面
    │   ├── xuanhuan.css        # 玄幻篇风格
    │   ├── kehuan.css          # 科幻篇风格（《替身》《契械纪元》）
    │   ├── fanzheng.css        # 反乌托邦赛博风（《未来造反指南》）
    │   └── zhexue.css          # 游戏篇风格
    └── js/
        ├── main.js             # 导航下拉、滚动显现等交互
        └── audio.js            # 全站 BGM 合成系统（Web Audio）
```

## 不同风格说明

| 分类 | 作品 | 设计语言 |
|------|------|----------|
| 玄幻 | 《愿力纠察使》 | 墨黑 + 鎏金 + 水墨远山 + 云雾粒子 + 印章元素 |
| 科幻 | 《替身》 | 深空深蓝 + 赛博霓虹 + 芯片身份卡 + 透视网格 + 玻璃拟态 + 终端风格 |
| 科幻 | 《契械纪元》 | 青蓝脉冲 + 灵契纹路 + 机械构装 + 齿轮圆环 + 扫描线 |
| 科幻 | 《未来造反指南》 | 血红警告 + 故障文字 + 危险条纹 + 终端面板 + 反乌托邦 |
| 游戏 | 《哲学与诗与梦》 | 梦境星云 + 深空银月 + 星点粒子 + 哲学符号 + 镜像微光 |

## 交互特性

- **导航下拉菜单**：鼠标悬停在导航栏的「玄幻 / 科幻 / 游戏」类型按键上，
  会显示该类型下包含的所有小说名，点击即可跳转对应详情页。
- **随页面主题变化的 BGM**：每个详情页会自动匹配专属音色，详见下文。

## BGM 音乐系统

全站音乐由 `assets/js/audio.js` 基于 **Web Audio API 实时合成**，不依赖任何外部音频文件。

主题根据页面 `<body>` 的 class 自动检测：

| body class | 对应页面 | 音色 |
|------------|----------|------|
| `xuanhuan-body` | 玄幻篇 | 古风五声 · 空灵回响 |
| `kehuan-body` | 科幻篇 | 赛博脉冲 · 低频驱动 |
| `eerie-body` | 《未来造反指南》 | 不谐低鸣 + 低频 drone + 随机尖啸（诡异） |
| `zhexue-body` | 游戏篇 | 八音盒琶音 · 星光梦幻 |
| （默认） | 主页 | 温暖氛围 · C 大调 |

交互方式：右下角悬浮 **♪** 按钮点击开 / 关音乐。
页面会记住你的上次偏好（localStorage 的 `novel_bgm`），重新打开时会在首次点击后自动续播。

如需新增主题，在 `audio.js` 的 `THEMES` 中注册配置，并在 `detectTheme()` 中增加对应的 body class 判定即可。

## 部署到 GitHub Pages

### 方式一：整个 site 文件夹作为仓库（推荐）

1. 在 GitHub 上新建一个仓库，例如 `novel-site`
2. 在 `site/` 目录下执行：

```bash
git init
git add .
git commit -m "初始化小说展示站"
git branch -M main
git remote add origin https://github.com/<你的用户名>/novel-site.git
git push -u origin main
```

3. 进入仓库 **Settings → Pages**，在 "Build and deployment" 中：
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`，目录选 `/ (root)`
   - 点击 **Save**
4. 等待 1~2 分钟后，访问 `https://<你的用户名>.github.io/novel-site/`

### 方式二：作为现有仓库的子目录

把 `site/` 内容放到仓库根目录（或 `docs/` 目录，并在 Pages 中把目录选为 `/docs`）即可。

> 注意：页面内全部使用相对路径（`assets/...`、`../assets/...`），
> 无论部署在根路径还是子路径都能正常工作，无需改动代码。

## 本地预览

双击 `index.html` 即可在浏览器中打开；也可以起一个本地服务器：

```bash
cd site
python -m http.server 8080
# 访问 http://localhost:8080
```

## 如何新增一本小说

1. 在 `novels/` 下新建一个 HTML 文件，引用对应的分类样式（如科幻用 `../assets/css/kehuan.css`）
2. 在 `index.html` 对应分类的 `book-grid` 中，复制一段 `.book-card` 并修改链接、书名、封面类名（`cover-xuanhuan` / `cover-kehuan` / `cover-qixie` / `cover-fanzheng` / `cover-zhexue`）
3. 在 `index.html` 导航的对应类型 `.dropdown` 中添加新的书名链接，并在其他详情页的相同 dropdown 中同步
4. 给详情页的 `<body>` 添加对应主题 class（`xuanhuan-body` / `kehuan-body` / `eerie-body` / `zhexue-body`），BGM 会自动匹配音色
5. 如果是一种全新的分类，可参照 `assets/css/` 现有文件新建一套专属风格

## 字体说明

页面引入了 Google Fonts（Noto Serif SC / Noto Sans SC / Cormorant Garamond）。
离线环境会自动回退到系统中文字体（宋体 / 黑体 / 微软雅黑），不影响阅读。
