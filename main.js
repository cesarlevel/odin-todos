import './src/reset.css';
import './src/style.css';
import todoApp from './src/app';

document.querySelector('#app').innerHTML = `
  <nav></nav>
  <section>
    <article>
    </article>
  </section>
`

const app = new todoApp();
app.init();