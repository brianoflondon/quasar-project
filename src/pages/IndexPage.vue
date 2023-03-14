<!-- <Suspense> -->
  <template>
    <q-page class="flex flex-center">
      <q-col>
        <q-row>
          <img
            alt="Quasar logo"
            src="~assets/quasar-logo-vertical.svg"
            style="width: 200px; height: 200px"
          />
        </q-row>
        <q-row>
          <q-badge>{{ message }}</q-badge>
        </q-row>
        <q-row>
          <q-input v-model="message" label="Standard" />
        </q-row>
      </q-col>
    </q-page>
  </template>
  <!-- <template #fallback>
    Loading...
  </template> -->
<!-- </Suspense> -->
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const message = ref('my message')

    return { message }
  },
})
</script>
