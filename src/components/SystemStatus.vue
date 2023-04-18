<template>
  <q-dialog> Hello </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
const t = useI18n().t

const $q = useQuasar()
defineComponent({
  name: 'SystemStatus',
})

const longString = `
  <em>I can</em>
  < span class="text-red" > use</ > <strong>HTML</strong>
  ${t('system_status_intro')}
  `


const showDialog = () => {
  dialog({
    title: t('system_status_intro'),
    message: longString,
    html: true,
  })
    .onOk(() => {
      // console.log('OK')
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}
</script>
