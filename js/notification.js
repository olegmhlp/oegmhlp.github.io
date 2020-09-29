if (!('Notification' in window)) {
  console.log('This browser does not support notifications!');
}

const getPermission = () => {
  Notification.requestPermission((status) => {
    console.log('Notification permission status:', status);
  });
};

const options = {
  body: 'Vecher v hatu',
  icon: '/favicons/mstile-150x150.png',
  vibrate: [100, 50, 100],
  data: {
    dateOfArrival: Date.now(),
    primaryKey: 1,
  },
};

const sendNotification = () => {
 return navigator.serviceWorker.ready.then(function(registration) {
    registration.showNotification('Bonjour, epta', options);
  });
};

if (Notification.permission == 'granted') {
  const permStatus = document.getElementById('perm-status');
  permStatus.textContent = 'granted';
  permStatus.style.color = '#078761';

  const sendButton = document.getElementById('notifications-button');
  sendButton.style.background = '#078761'
  sendButton.style.color = '#FFFFFF'
  sendButton.addEventListener('click', sendNotification)
}

document
  .getElementById('enable-notification')
  .addEventListener('click', getPermission);
