<template>
  <q-layout view="lHh Lpr lFf">
    <q-header header-bar elevated>
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
          <q-avatar square size="md">
            <img :src="storeUser.profileImageUrl" />
          </q-avatar>
        </div>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
      <TabBar />
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
    <PricesBar />
  </q-layout>
</template>

<script setup>
import { defineComponent, onMounted, ref } from 'vue'
import { getAppDetails } from 'src/components/getAppDetails.js'
import PricesBar from 'src/components/PricesBar.vue'
import LogoTest from 'components/LogoTest.vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useStoreUser } from 'src/stores/storeUser'
import TabBar from 'src/Layout/TabBar.vue'
import { useMeta } from 'quasar'

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
]
const leftDrawerOpen = ref(false)
const { appName, appVersion } = getAppDetails()
const essentialLinks = ref(linksList)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function clearAllStorage() {
  console.log('clearing local storage')
  window.sessionStorage.clear()
  window.localStorage.clear()
}


// need to move this to somewhere else
let albyNameContent = ''
let albyImageContent = ''
let albyLightningContent = ''

if (storeUser.isLoggedIn) {
  storeUser.getHiveProfile()
  albyNameContent = storeUser.hiveProfile
    ? storeUser.hiveProfile.name
    : storeUser.hiveAccname
  albyImageContent = storeUser.profileImageUrl
  albyLightningContent = `${storeUser.hiveAccname}@v4v.app`
} else {
  albyNameContent = ''
  albyImageContent = ''
  albyLightningContent = ''
}

const metaData = {
  // sets document title
  title: 'V4VAPP v4v.app',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title) => `${title} - My Website`,

  // meta tags
  meta: {
    description: { name: 'V4VAPP Dev Site', content: 'Page 1' },
    keywords: { name: 'V4VAPP', content: 'V4VAPP ' },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    albyName: {
      name: 'alby:name',
      content: albyNameContent,
    },
    albyImage: {
      name: 'alby:image',
      content: albyImageContent,
    },
    property: {
      name: 'lightning',
      content: albyLightningContent,
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${ogTitle} - My Website`
      },
    },
    noscript: {
      default: 'This site is going to need JavaScript to run.',
    },
  },

  // CSS tags
  link: {
    material: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    },
  },

  // JS tags
  script: {
    ldJson: {
      type: 'application/ld+json',
      innerHTML: `{ "@context": "http://schema.org" }`,
    },
  },

  // <html> attributes
  htmlAttr: {
    'xmlns:cc': 'http://creativecommons.org/ns#', // generates <html xmlns:cc="http://creativecommons.org/ns#">,
    empty: undefined, // generates <html empty>
  },

  // <body> attributes
  bodyAttr: {
    'action-scope': 'xyz', // generates <body action-scope="xyz">
    empty: undefined, // generates <body empty>
  },

  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)',
  },
}

useMeta(metaData)

onMounted(() => {
  // clearAllStorage()
})
</script>


<style lang="scss">


</style>
