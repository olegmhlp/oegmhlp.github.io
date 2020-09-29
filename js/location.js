function getLocation() {
  const status = document.getElementById('location-status');

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = 'granted';
    status.style.color = '#078761';
    document.getElementById('latitude').innerHTML = latitude.toFixed(7);
    document.getElementById('longitude').innerHTML = longitude.toFixed(7);
  };

  const error = () => {
    status.textContent = 'denied';
    status.style.color = '#e42c02';
  };

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'pending';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.getElementById('get-location').addEventListener('click', getLocation);
