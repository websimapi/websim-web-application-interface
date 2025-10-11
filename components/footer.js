export default function Footer() {
  const el = document.createElement('footer');
  el.className = 'app-footer';
  const year = new Date().getFullYear();
  el.innerHTML = `<small style="opacity:.7;">© ${year}</small>`;
  return el;
}

