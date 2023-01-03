if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(function (reg) {
    console.log("register", reg);
  }).catch(function (err) {
    console.log("err", err);
  });
}

if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log("This is running as standalone.");
} else {
  console.log("This is running as webapp.");
}

try {
  localStorage.setItem("localstoragetest", "Hello World!");
  console.log("storage OK")
} catch (e) {
  alert("You need to enable Local Storage for wavemaker to work")
}

let deferredPrompt;
const installAlert = document.getElementById('install-alert');
const installBtn = document.getElementById('install-button');
const closeBtn = document.getElementById('close-button');
installAlert.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  installAlert.style.display = 'block';
  
  closeBtn.addEventListener('click', () => {
    installAlert.style.display = 'none';
  })

  installBtn.addEventListener('click', () => {
    // hide our user interface that shows our A2HS button
    installAlert.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        // console.log('User accepted the A2HS prompt');
      } else {
        //  console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});