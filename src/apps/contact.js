const ContactApp = {
  id: 'contact',
  title: 'Contact',
  icon: '✉️',
  render() {
    const el = document.createElement('div');
    el.className = 'prose';
    el.innerHTML = `
      <h1>Get in Touch</h1>
      <p>Open to opportunities, collaborations, and good conversations.</p>
      <div class="grid">
        <a class="card" href="mailto:bhingradia.abhay@gmail.com">Email: bhingradia.abhay@gmail.com</a>
        <a class="card" href="https://github.com/AbhayB97" target="_blank" rel="noreferrer">GitHub: @AbhayB97</a>
        <a class="card" href="https://www.linkedin.com/in/abhay-bhingradia" target="_blank" rel="noreferrer">LinkedIn: abhay-bhingradia</a>
        <a class="card" href="https://abhay.bhingradia.com/resume.pdf" target="_blank" rel="noreferrer">Resume (PDF)</a>
        <a class="card" href="https://bhingradia.com" target="_blank" rel="noreferrer">Website: bhingradia.com</a>
      </div>
    `;
    return el;
  },
};

export default ContactApp;
