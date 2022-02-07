self.addEventListener("push", (event) => {
  const notification = event.data.json();

  if (notification.message) {
    self.registration.showNotification("Memebook", {
      body: notification.message,
      icon: "https://memebook.vercel.app/logo.png",
    });
  } else {
    try {
      let msg;
      let icon;
      if (notification.type == "follow") {
        msg = `${notification.followedBy.username} started following you`;
        icon = notification.followedBy.avatar;
      } else if (notification.type == "comment") {
        msg = `${notification.comment.user.username} commented on your post: ${notification.comment.text}`;
        icon = notification.comment.user.avatar;
      } else if (notification.type == "likePost") {
        msg = `${notification.likedBy.username} liked your post`;
        icon = notification.likedBy.avatar;
      } else if (notification.type == "likeComment") {
        msg = `${notification.likedBy.username} liked your comment`;
        icon = notification.likedBy.avatar;
      }

      self.registration.showNotification("Memebook", {
        body: msg,
        icon,
      });
    } catch (err) {
      //...
    }
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://memebook.vercel.app/notifications")
  );
});
