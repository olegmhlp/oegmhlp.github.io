if (!('Notification' in window)) {
  console.log('This browser does not support notifications!');
}

const getPermission = () => {
  Notification.requestPermission((status) => {
    console.log('Notification permission status:', status);
  });
};

const options = {
  body: 'Local notification',
  icon: '/favicons/mstile-150x150.png',
  vibrate: [100, 50, 100],
  data: {
    dateOfArrival: Date.now(),
    primaryKey: 1,
  },
};

const sendLocalNotification = () => {
  return navigator.serviceWorker.ready.then(function (registration) {
    registration.showNotification('Bonjour, epta', options);
  });
};

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  let reg;

  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function (sub) {
      if (sub === null) {
        // Create a new subscription
        var vapidPublicKey =
          'BALz6Dk2o2PZgzYlii0kCSAFweTVFqESg0MkqzJfZYC3ymwHf2E09ZjgOgNoILLJpLAXztSSzgBkEmomFJrx870';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey,
        });
      } else {
        // We have a subscription
      }
    })
    .then(function (newSub) {
      console.log('triggered');
      return fetch('http://localhost:5000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newSub),
      });
    })
    .then(function (res) {
      if (res.ok) {
        return navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification('Successfully subscribed');
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

if (Notification.permission == 'granted') {
  const permStatus = document.getElementById('perm-status');
  permStatus.textContent = 'granted';
  permStatus.style.color = '#078761';

  const sendButton = document.getElementById('notifications-button');
  sendButton.style.background = '#078761';
  sendButton.style.color = '#FFFFFF';
  sendButton.addEventListener('click', sendLocalNotification);
  configurePushSub();
}

document
  .getElementById('enable-notification')
  .addEventListener('click', getPermission);
