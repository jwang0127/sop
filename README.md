# 财务 BP 工作手册

把《财务BP通用知识库》整理为可浏览、可搜索的静态 HTML 工作手册。首页按工作顺序展示核心流程；`content/` 收录原库的 93 份 Markdown 文档及新增的交付验收页、内容审校页，正文中的 Obsidian 双链已转成站内链接。

复核时发现部分平台路径或字段未补齐，以及原资料含仅适用于特定业务的费率示例。相关页面保留原资料并加注核验说明；网页用状态标记区分工作方法、需核对路径、待补路径、填写模板与外部资料。原始本地知识库没有被修改。

## 更新内容

编辑 `content/` 中的 Markdown 后，在本地运行：

```powershell
python -m pip install markdown
python build.py
```

如需从另一份知识库重新导入，可显式传入其目录；这样会覆盖生成的 `docs.json`，但不会覆盖 `content/` 的审校注释。生成的 `docs.json` 与 `index.html`、`style.css`、`app.js` 一同提交。站点是纯静态文件，不需要服务端或构建框架。

## 本地预览

```powershell
python -m http.server 8000
```

打开 `http://localhost:8000`。
