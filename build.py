"""Build the static BP SOP site from the local Obsidian knowledge base.

Usage: python build.py "D:/path/to/财务BP通用知识库"
"""
import html
import json
import re
import sys
from pathlib import Path

import markdown

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / 'content'
if not ROOT or not ROOT.is_dir():
    raise SystemExit('Pass the knowledge base directory to build.py')
OUT = Path(__file__).parent
GROUPS = {
    '00': ('入口与导航', '导览'), '01': ('工作节奏', '排期'),
    '02': ('数据源与取数', '取数'), '03': ('财报核算', '核算'),
    '04': ('经营分析', '分析'), '05': ('预算与预测', '预测'),
    '06': ('异常事项处理', '异常'), '07': ('管理汇报与沟通', '沟通'),
    '08': ('图表与展示规范', '呈现'), '09': ('电商财务BP专题', '电商'),
    '90': ('模板', '模板'), '91': ('术语与口径', '口径'),
    '92': ('资料索引', '索引'), '94': ('外部知识源', '外部'),
}
files = sorted(ROOT.rglob('*.md'))
names = {p.stem: p.relative_to(ROOT).as_posix() for p in files}

def wikilink(match):
    target = match.group(1).split('|', 1)
    title = target[-1]
    slug = target[0].split('#', 1)[0]
    if slug in names:
        return f'<a href="#doc={html.escape(names[slug], quote=True)}">{html.escape(title)}</a>'
    return html.escape(title)

docs = []
for p in files:
    raw = p.read_text(encoding='utf-8-sig')
    rel = p.relative_to(ROOT).as_posix()
    number = rel[:2] if rel[:2] in GROUPS else '00'
    raw = re.sub(r'\[\[([^\]]+)\]\]', wikilink, raw)
    rendered = markdown.markdown(raw, extensions=['tables', 'fenced_code', 'toc'])
    excerpt = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', rendered)).strip()[:155]
    if number == '94':
        status = '外部资料'
    elif number == '90' or '模板' in p.stem or p.stem in {'数据源登记表', '口径变更记录', '决策与待办跟踪'}:
        status = '填写模板'
    elif p.stem in {'美团优选取数SOP', '微信视频号取数SOP'}:
        status = '路径待补'
    elif p.stem in {'快手取数SOP', '拼多多取数SOP', '掌上大学取数SOP'}:
        status = '部分待补'
    elif number == '02' and p.stem.endswith('取数SOP') and p.stem != '平台取数通用SOP':
        status = '路径需核对'
    else:
        status = '工作方法'
    docs.append({'id': rel, 'title': p.stem, 'group': number,
                 'status': status, 'html': rendered, 'excerpt': html.unescape(excerpt),
                 'search': re.sub(r'<[^>]+>', ' ', rendered)})

(OUT / 'docs.json').write_text(json.dumps(docs, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'Built {len(docs)} documents from {ROOT}')
