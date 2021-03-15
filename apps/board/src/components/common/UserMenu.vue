<template>
  <v-menu v-if="user" offset-y bottom left>
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar size="40" color="elevation-1">
          <v-img v-if="user.photoURL" :src="user.photoURL" />
          <span v-else>{{ getInitials(user.displayName) }}</span>
          <v-icon v-if="!user.email">mdi-incognito</v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item >
        <v-list-item-title class="px-1" @click.stop.prevent="setDark">
          <v-switch
            v-model="darkMode"
            dense
            inset
            label="Dark mode"
          />
        </v-list-item-title>
      </v-list-item>
      <v-divider/>
      <v-list-item @click="signOut">
        <v-list-item-title>Sign Out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
import { auth } from '../../firebase'

export default {
  data() {
    return {
      darkMode: false,
    }
  },
  computed: {
    ...mapState('app', ['user']),
  },
  created() {
    try {
      this.darkMode = JSON.parse(localStorage.getItem('darkMode'))

      this.$vuetify.theme.dark = this.darkMode
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    setDark() {
      this.$vuetify.theme.dark = this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
    },
    getInitials(name) {
      if (this.user && !this.user.email) return ''

      if (name) {
        const initials = name.match(/\b\w/g) || []

        return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
      }

      return ''
    },
    async signOut() {
      try {
        await auth().signOut()

        window.location = '/'
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
