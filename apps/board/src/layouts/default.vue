<template>
  <div>
    <!-- Toolbar -->
    <v-app-bar app flat color="transparent pa-1">
      <v-card class="flex-grow-1 d-flex pa-1 mt-2 align-center">
        <a href="https://firelayer.io" target="_blank">
          <img src="/images/firelayer.png" height="38" class="ml-1" alt="firelayer"/>
        </a>
        <v-spacer/>
        <v-btn class="mr-1" href="https://github.com/firelayer/firelayer" target="_blank" icon>
          <v-icon>mdi-github</v-icon>
        </v-btn>
        <UserMenu/>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container fill-height fluid>
        <v-layout>
          <slot v-if="user && !settings.maintenance"></slot>
          <div v-if="settings.maintenance" class="my-5 text-center d-flex flex-column flex-grow-1">
            <v-img
              class="mb-5"
              height="200px"
              contain
              src="/images/maintenance.svg"
            />

            <h1>In Maintenance</h1>
            <p>We promise to be quick. Please come back later.</p>
          </div>
        </v-layout>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { realtime } from '../firebase'
import UserMenu from '../components/common/UserMenu'

export default {
  components: {
    UserMenu
  },
  computed: {
    ...mapState('app', ['user', 'settings'])
  },
  mounted() {
    realtime().ref('/_settings').on('value', (snapshot) => {
      this.setSettings(snapshot.val() || this.settings)
    })
  },
  beforeDestroy() {
    realtime().ref('/_settings').off()
  },
  methods: {
    ...mapMutations('app', {
      setSettings: 'SET_SETTINGS'
    })
  }
}
</script>
