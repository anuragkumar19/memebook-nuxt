<template>
  <v-list-item :style="`background: ${notification.seen ? '#fff' : '#f4f4f4'}`">
    <template v-if="notification.type == 'follow'">
      <v-list-item-avatar>
        <v-img :src="notification.followedBy.avatar"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <nuxt-link :to="`/user/${notification.followedBy.username}`">{{
            notification.followedBy.username
          }}</nuxt-link>
          started following you
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $moment(notification.createdAt).fromNow() }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template v-if="notification.type == 'comment'">
      <v-list-item-avatar>
        <v-img :src="notification.comment.user.avatar"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <nuxt-link :to="`/user/${notification.comment.user.username}`">{{
            notification.comment.user.username
          }}</nuxt-link>
          commented on your
          <nuxt-link :to="`/post/${notification.post._id}`">post</nuxt-link> :
          {{ notification.comment.text }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $moment(notification.createdAt).fromNow() }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template v-if="notification.type == 'likePost'">
      <v-list-item-avatar>
        <v-img :src="notification.likedBy.avatar"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <nuxt-link :to="`/user/${notification.likedBy.username}`">{{
            notification.likedBy.username
          }}</nuxt-link>
          liked your
          <nuxt-link :to="`/post/${notification.post._id}`">post</nuxt-link>
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $moment(notification.createdAt).fromNow() }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template v-if="notification.type == 'likeComment'">
      <v-list-item-avatar>
        <v-img :src="notification.likedBy.avatar"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>
          <nuxt-link :to="`/user/${notification.likedBy.username}`">{{
            notification.likedBy.username
          }}</nuxt-link>
          liked comment on this
          <nuxt-link :to="`/post/${notification.post._id}`">post</nuxt-link> :
          {{ notification.comment.text }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ $moment(notification.createdAt).fromNow() }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-list-item>
</template>
<script>
export default {
  props: ["notification"],
  async created() {
    if (!this.notification.seen) {
      await this.$axios.$post(`/notification/${this.notification._id}`);
    }
  },
  keepAlive: false,
};
</script>
