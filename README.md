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
│   └── zhexue.html             # 《哲学与诗与梦》游戏篇（创作中）
└── assets/
    ├── css/                    # common / index / xuanhuan / kehuan / zhexue
    └── js/main.js              # 导航、滚动动画等交互
```

## 不同风格说明

| 分类 | 作品 | 设计语言 |
|------|------|----------|
| 玄幻 | 《愿力纠察使》 | 墨黑 + 鎏金 + 水墨远山 + 云雾粒子 + 印章元素 |
| 科幻 | 《替身》 | 深空深蓝 + 赛博霓虹 + 芯片身份卡 + 透视网格 + 玻璃拟态 + 终端风格 |
| 游戏 | 《哲学与诗与梦》 | 梦境星云 + 深空银月 + 星点粒子 + 哲学符号 + 镜像微光 |

## 交互特性

- **导航下拉菜单**：鼠标悬停在导航栏的「玄幻 / 科幻 / 游戏」类型按键上，
  会显示该类型下包含的所有小说名，点击即可跳转对应详情页。

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

1. 在 `novels/` 下新建一个 HTML 文件，引用对应的分类样式（如玄幻用 `../assets/css/xuanhuan.css`）
2. 在 `index.html` 对应分类的 `book-grid` 中，复制一段 `.book-card` 并修改链接、书名、封面类名（`cover-xuanhuan` / `cover-kehuan` / `cover-zhexue`）
3. 在 `index.html` 导航的对应类型 `.dropdown` 中添加新的书名链接
4. 如果是一种全新的分类，可参照 `assets/css/` 现有文件新建一套专属风格

## 字体说明

页面引入了 Google Fonts（Noto Serif SC / Noto Sans SC / Cormorant Garamond）。
离线环境会自动回退到系统中文字体（宋体 / 黑体 / 微软雅黑），不影响阅读。
