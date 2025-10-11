import Header from "/components/header.js";
import Footer from "/components/footer.js";

/* ...existing code... */
const root = document.getElementById('app');
if (root) {
  const main = document.createElement('main');
  main.id = 'app-main';
  main.setAttribute('role', 'main');
  root.append(Header(), main, Footer());
}
/* ...existing code... */

