export default function Header() {
  const el = document.createElement('header');
  el.className = 'app-header';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <strong style="font-weight:600;letter-spacing:.2px;">Project</strong>
      <span style="opacity:.6;">Interactive Editor</span>
    </div>
  `;
  return el;
}

