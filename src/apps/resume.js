import { iconDoc } from '../icons.js';

const ResumeApp = {
  id: 'resume',
  title: 'Resume',
  icon: iconDoc,
  render() {
    const el = document.createElement('div');
    el.className = 'content';
    const url = 'https://abhay.bhingradia.com/resume.pdf';
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.title = 'Resume PDF';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'prose';
    fallback.innerHTML = `
      <p>If the PDF doesn’t load, <a href="${url}" target="_blank" rel="noreferrer">open it in a new tab</a>.</p>
    `;
    el.append(iframe, fallback);
    return el;
  },
};

export default ResumeApp;
