if (!('Notification' in window)) {
  console.log('This browser does not support notifications!');
}

const getPermission = () => {
  Notification.requestPermission((status) => {
    console.log('Notification permission status:', status);
  });
};

if (Notification.permission == 'granted') {
  const permStatus = document.getElementById('perm-status');
  permStatus.textContent = 'granted';
  permStatus.style.color = '#078761';
  navigator.serviceWorker.getRegistration().then((reg) => {
    // TODO 2.4 - Add 'options' object to configure the notification

    reg.showNotification('Hello world!');
  });
}

document
  .getElementById('enable-notification')
  .addEventListener('click', getPermission);
