import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, cpSync, statSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

marked.use({ mangle: false, headerIds: false });

const root = process.cwd();
const dist = join(root, 'dist');
const EXCLUDE = new Set(['dist', '.git', '.github', 'node_modules', 'scripts', 'package.json', 'package-lock.json']);

mkdirSync(dist, { recursive: true });

for (const item of readdirSync(root)) {
  if (EXCLUDE.has(item)) continue;
  cpSync(join(root, item), join(dist, item), { recursive: true });
}

const rootReadmeHtml = marked.parse(readFileSync(join(root, 'README.md'), 'utf-8'));

const projects = [];
for (const item of readdirSync(root).sort()) {
  const itemPath = join(root, item);
  if (!statSync(itemPath).isDirectory()) continue;
  if (EXCLUDE.has(item)) continue;
  if (!existsSync(join(itemPath, 'index.html'))) continue;

  let readmeHtml = '<p><em>This project has no README.</em></p>';
  const readmeMd = join(itemPath, 'README.md');
  if (existsSync(readmeMd)) {
    readmeHtml = marked.parse(readFileSync(readmeMd, 'utf-8'));
  }

  projects.push({ name: item, slug: encodeURIComponent(item), readmeHtml });
}

const projectCards = projects.map((p) => `      <details class="project-card">
        <summary>
          <span class="project-name">${p.name}</span>
          <span class="project-chevron">\u25BE</span>
        </summary>
        <div class="project-body">
          <div class="markdown-body project-readme">${p.readmeHtml}</div>
          <a class="project-link" href="${p.slug}/index.html">Visit Project \u2192</a>
        </div>
      </details>`).join('\n');

const projectsSection = projects.length > 0
  ? `    <section class="projects">\n      <h2>Projects</h2>\n${projectCards}\n    </section>`
  : `    <section class="projects empty">\n      <h2>Projects</h2>\n      <p class="empty-msg">No projects yet. Be the first to add some slop.</p>\n    </section>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>slop</title>
  <style>
    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --surface-hover: #1c2330;
      --border: #30363d;
      --text: #e6edf3;
      --muted: #8b949e;
      --accent: #8b6f47;
      --accent-bright: #b08d5e;
      --link: #58a6ff;
      --code-bg: #1f2428;
      --radius: 12px;
      --max-width: 900px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    main {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 0 24px 80px;
    }

    .markdown-body {
      padding: 32px 0;
    }

    .markdown-body h1 {
      font-size: 2.2em;
      font-weight: 700;
      margin: 0 0 16px;
      letter-spacing: -0.02em;
    }

    .markdown-body h2 {
      font-size: 1.5em;
      font-weight: 600;
      margin: 32px 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    .markdown-body h3 {
      font-size: 1.2em;
      font-weight: 600;
      margin: 24px 0 8px;
    }

    .markdown-body p { margin: 12px 0; }

    .markdown-body ul, .markdown-body ol {
      margin: 12px 0;
      padding-left: 28px;
    }

    .markdown-body li { margin: 6px 0; }

    .markdown-body a {
      color: var(--link);
      text-decoration: none;
    }

    .markdown-body a:hover { text-decoration: underline; }

    .markdown-body blockquote {
      border-left: 4px solid var(--accent);
      padding: 8px 16px;
      margin: 16px 0;
      color: var(--muted);
      background: rgba(139, 111, 71, 0.08);
      border-radius: 0 8px 8px 0;
    }

    .markdown-body code {
      background: var(--code-bg);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
    }

    .markdown-body pre {
      background: var(--code-bg);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
      border: 1px solid var(--border);
    }

    .markdown-body pre code {
      background: none;
      padding: 0;
    }

    .markdown-body img {
      max-width: 100%;
      border-radius: 8px;
    }

    .markdown-body hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 32px 0;
    }

    .root-readme { border-bottom: 1px solid var(--border); }

    .projects h2 {
      font-size: 1.6em;
      font-weight: 700;
      margin: 48px 0 24px;
      letter-spacing: -0.01em;
    }

    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 12px;
      overflow: hidden;
      transition: border-color 0.15s ease;
    }

    .project-card:hover { border-color: var(--accent); }

    .project-card summary {
      padding: 18px 24px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1.05em;
      display: flex;
      align-items: center;
      justify-content: space-between;
      list-style: none;
      user-select: none;
      transition: background 0.15s ease;
    }

    .project-card summary:hover { background: var(--surface-hover); }

    .project-card summary::-webkit-details-marker { display: none; }

    .project-chevron {
      color: var(--muted);
      transition: transform 0.2s ease;
      font-size: 0.9em;
    }

    .project-card[open] summary .project-chevron { transform: rotate(180deg); }

    .project-body {
      padding: 0 24px 24px;
      border-top: 1px solid var(--border);
    }

    .project-readme {
      padding: 20px 0 8px;
    }

    .project-readme h1 { font-size: 1.6em; }
    .project-readme h2 { font-size: 1.3em; }

    .project-link {
      display: inline-block;
      margin-top: 16px;
      padding: 10px 24px;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95em;
      transition: background 0.15s ease, transform 0.1s ease;
    }

    .project-link:hover {
      background: var(--accent-bright);
      transform: translateY(-1px);
    }

    .empty-msg {
      color: var(--muted);
      font-style: italic;
      padding: 24px 0;
    }

    footer {
      text-align: center;
      padding: 40px 24px;
      color: var(--muted);
      font-size: 0.85em;
      border-top: 1px solid var(--border);
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <main>
    <div class="markdown-body root-readme">
${rootReadmeHtml.split('\n').map(l => '      ' + l).join('\n')}
    </div>
${projectsSection}
  </main>
  <footer>powered by leftover tokens</footer>
</body>
</html>
`;

writeFileSync(join(dist, 'index.html'), html);
console.log(`Index built with ${projects.length} project(s).`);
