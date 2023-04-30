<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <div>HAS Login for {{ hiveAccname }}</div>
      <div ref="qrCodeContainer" />
      <div
        class="qr-code-text"
        style="overflow-wrap: break-word; word-break: break-all"
      >
        {{ qrCodeText }}
      </div>
      <!--
        ...content
        ... use q-card-section for it?
      -->

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { defineComponent, ref } from 'vue'
import { useHiveAvatarURL } from 'src/use/useHive'
import { HAS } from 'boot/has'
// import HAS from 'hive-auth-wrapper'
import QRCodeStyling from 'qr-code-styling'

defineComponent({
  name: 'HASAuthenticate',
})

const props = defineProps({
  hiveAccname: {
    type: String,
    default: '',
  },
})
const onScreen = ref('Waiting...')
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])
const res = ref('waiting...')
const qrCodeText = ref('waiting...')
const qrCodeContainer = ref(null)

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

console.log('Running in the HAS component hiveAccname', props.hiveAccname)
HAFAuth()

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK()
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}

/*************************************************
 ****   Hive Authentication Services HAS Functions
 **************************************************/

async function HAFAuth() {
  const status = HAS.status()
  console.log(status)
  const APP_META = {
    name: 'V4VAPP',
    description: 'Value 4 Value Lightning Hive',
    icon: 'https://v4v.app/hivelightning-dark.png',
  }
  const auth = {
    username: props.hiveAccname,
    token: undefined,
    expire: undefined,
    key: undefined,
  }
  const challenge_data = {
    key_type: 'posting',
    challenge: JSON.stringify({
      login: auth.username,
      ts: Date.now(),
    }),
  }
  res.value = await HAS.authenticate(
    auth,
    APP_META,
    challenge_data,
    processAuthWaitEvent
  )
  console.log(res)
}

function processAuthWaitEvent(evt) {
  console.log(evt)
  const authPayload = {
    account: props.hiveAccname,
    uuid: evt.uuid,
    key: evt.key,
    host: 'v4v.app',
  }
  const encoded = btoa(JSON.stringify(authPayload))
  const url = `has://auth_req/${encoded}`
  qrCodeText.value = url
  onScreen.value = url
  console.log(url)
  const hiveAvatar = useHiveAvatarURL({ hiveAccname: props.hiveAccname })
  console.log(hiveAvatar)
  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg',
    data: url,
    // image: hiveAvatar,
    dotsOptions: {
      color: '#4267b2',
      type: 'rounded',
    },
    backgroundOptions: {
      color: '#e9ebee',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 20,
    },
  })
  qrCode.append(qrCodeContainer.value)
  console.log(qrCode)
}
</script>
