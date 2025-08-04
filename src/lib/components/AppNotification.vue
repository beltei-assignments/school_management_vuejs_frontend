<template>
  <div ref="notif" class="alert">
    <v-slide-x-reverse-transition group>
      <v-alert
        v-for="notification of notifications"
        :key="notification.id"
        class="mt-2 mr-2"
        closable
        :text="notification.msg"
        v-bind:="notification.opts"
        @click:close="close(notification.id)"
      />
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    setup () {
      // data
      const notifications = ref([])

      // methods
      function pushNotif (msg, options) {
        const id = Date.now() + Math.random()
        const opts = {
          timeout: 5000,
          ...options,
        }
        notifications.value.push({
          id,
          msg,
          opts,
        })
        if (opts.timeout) {
          setTimeout(() => {
            close(id)
          }, opts.timeout)
        }
      }
      function close (id) {
        notifications.value = notifications.value.filter(
          item => item.id !== id,
        )
      }

      return {
        // data
        notifications,

        // methods
        pushNotif,
        close,
      }
    },
  }
</script>

<style scoped>
.alert {
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100000;
}
</style>
