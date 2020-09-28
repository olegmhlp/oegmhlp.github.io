if (window.matchMedia('(display-mode: standalone)').matches) {
  let installStatus = document.getElementById('install-status');
  installStatus.innerHTML = 'installed';
  installStatus.style.color = '#078761';
}

window.addEventListener('appinstalled', (evt) => {
  let installStatus = document.getElementById('install-status');
  installStatus.innerHTML = 'installed';
  installStatus.style.color = '#078761';
});

let deferredPrompt;
const addPrompt = document.getElementById('install-prompt');
addPrompt.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  addPrompt.style.display = 'flex';
  const addBtn = document.getElementById('prompt-button');

  addBtn.addEventListener('click', (e) => {
    addPrompt.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
