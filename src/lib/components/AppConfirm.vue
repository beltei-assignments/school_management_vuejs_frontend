<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :persistent="isPersistent"
    @click:outside="isPersistent ? null : cancel"
    @keydown.esc="isPersistent ? null : cancel"
  >
    <v-card>
      <v-card-title class="pa-0">
        <v-toolbar :color="bgColor" dark dense elevation="0">
          <v-toolbar-title :class="'text-capitalize title ' + textColorClass">
            {{ title }}
          </v-toolbar-title>
        </v-toolbar>
      </v-card-title>
      <!-- eslint-disable vue/no-v-text-v-html-on-component -->
      <v-card-text
        v-show="!!msg"
        class="capitalize-first-letter py-2 pt-6 pb-4"
        v-html="msg"
      />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          class="d-block"
          :color="btnColor"
          elevation="0"
          variant="text"
          @click="agree"
        >
          {{ options.agreeBtnText }}
        </v-btn>
        <v-btn
          ref="btnNo"
          :class="'d-block ml-4 cancel-btn btn-' + options.type"
          elevation="0"
          variant="text"
          @click="cancel"
        >
          {{ options.denyBtnText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ConfirmDialog',
    data () {
      return {
        dialog: false,
        agreeCallback: null,
        cancelCallback: null,
        msg: null,
        title: null,
        options: {
          type: 'error',
          width: 290,
          agreeBtnText: 'Yes',
          denyBtnText: 'Cancel',
        },
        isPersistent: false,
      }
    },
    computed: {
      bgColor () {
        const colors = {
          info: 'info',
          error: 'error',
          warning: 'warning',
        }

        return colors[this.options.type || 'info']
      },
      textColorClass () {
        const colors = {
          info: 'primary--text',
          error: 'error--text',
          warning: 'warning--text',
        }

        return colors[this.options.type || 'info']
      },
      btnColor () {
        const colors = {
          info: 'primary',
          error: 'error',
          warning: 'warning',
        }

        return colors[this.options.type || 'info']
      },
    },
    methods: {
      open ({
        title,
        msg,
        options,
        agree = () => {},
        cancel = () => {},
        isPersistent = false,
      }) {
        this.dialog = true
        this.title = title
        this.msg = msg
        this.options = Object.assign(this.options, options)
        this.agreeCallback = agree
        this.cancelCallback = cancel
        this.isPersistent = isPersistent
      },
      async agree () {
        try {
          await this.agreeCallback()
        } catch (error) {
          console.error(error)
        } finally {
          this.dialog = false
        }
      },
      async cancel () {
        await this.cancelCallback()
        this.dialog = false
      },
    },
  }
</script>

<style scoped>
  .title {
    font-size: 1rem !important;
  }
  .cancel-btn {
    background: transparent !important;
  }
  .cancel-btn.btn-info {
    border: 1px solid rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-primary));
  }
  .cancel-btn.btn-error {
    border: 1px solid rgb(var(--v-theme-error));
    color: rgb(var(--v-theme-error));
  }
</style>
