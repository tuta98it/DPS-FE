importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyB0TiUAevN2RDc8AKaHqdBV9Y4gDJQDf_I",
    authDomain: "dps-test-8c62d.firebaseapp.com",
    databaseURL: "https://dps-test-8c62d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dps-test-8c62d",
    storageBucket: "dps-test-8c62d.appspot.com",
    messagingSenderId: "446679539096",
    appId: "1:446679539096:web:b32f9139b2349cb58cdfed"
});

if (firebase.messaging.isSupported()) {
    firebase.messaging();
}