// public/sw.js

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting(); // باعث می‌شود نسخه جدید سریعاً نصب شود
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(clients.claim()); // کنترل کلاینت‌ها را سریعاً به دست می‌گیرد
});

// بخش fetch را کلاً حذف کردیم تا وارنینگ overhead برطرف شود.
// بعداً که خواستیم قابلیت آفلاین واقعی اضافه کنیم، این بخش را با استراتژی درست برمی‌گردانیم.