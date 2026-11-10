# 财务 BP 工作手册

把《财务BP通用知识库》整理为可浏览、可搜索的静态 HTML 工作手册。首页按工作顺序展示核心流程；侧栏收录原库全部 Markdown 文档，正文中的 Obsidian 双链已转成站内链接。

## 更新内容

在本地运行：

```powershell
python -m pip install markdown
python build.py 'D:\james的乱七八糟\财务BP通用知识库'
```

生成的 `docs.json` 与 `index.html`、`style.css`、`app.js` 一同提交。站点是纯静态文件，不需要服务端或构建框架。

## 本地预览

```powershell
python -m http.server 8000
```

打开 `http://localhost:8000`。
