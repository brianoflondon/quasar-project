<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> {{ appName }} v{{ appVersion }} </q-toolbar-title>
        <div class="on-left">
          <LogoTest :size="50" class="q-pa-sm" />
        </div>
        <div v-if="storeUser.hiveProfile">
          ▪️ {{ storeUser.hiveProfile.name }} @{{ storeUser.hiveAccname }} ▪️
        </div>
        <div v-if="storeUser.profileImageUrl" class="q-pa-sm">
          <img :src="storeUser.profileImageUrl" width="50" height="50" />
        </div>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import { getAppDetails } from 'src/components/getAppDetails.js'
import LogoTest from 'components/LogoTest.vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useStoreUser } from 'src/stores/storeUser'

const storeUser = useStoreUser()

defineComponent({
  name: 'MainLayout',
})

const linksList = [
  {
    title: 'Testing Login',
    caption: 'Testing Login',
    icon: 'school',
    link: '/login',
  },
  {
    title: 'Testing',
    caption: 'Testing',
    icon: 'school',
    link: '/testing',
  },
  {
    title: 'Testing Images',
    caption: 'Testing Images',
    icon: 'school',
    link: '/images',
  },
  {
    title: 'V4V.app',
    caption: 'V4V.app',
    icon: 'fa-brands fa-hive',
    link: 'https://v4v.app/',
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
]
const leftDrawerOpen = ref(false)
const { appName, appVersion } = getAppDetails()
const essentialLinks = ref(linksList)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<!-- <script>


export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    LogoTest,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const { appName, appVersion } = getAppDetails()
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      appName,
      appVersion,
    }
  },
})
</script> -->
