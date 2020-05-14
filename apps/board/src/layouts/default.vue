<template>
  <div>
    <!-- Toolbar -->
    <v-app-bar app flat color="transparent pa-1">
      <v-card class="flex-grow-1 d-flex pa-1 mt-2 align-center">
        <a href="https://firelayer.io" target="_blank">
          <img src="/images/firelayer.png" height="38" class="ml-1" alt="firelayer">
        </a>
        <v-spacer></v-spacer>
        <v-btn class="mr-1" href="https://github.com/firelayer/firelayer" target="_blank" icon>
          <v-icon>mdi-github</v-icon>
        </v-btn>
        <UserMenu></UserMenu>
      </v-card>
    </v-app-bar>

    <v-content>
      <v-container fill-height fluid>
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import UserMenu from '../components/common/UserMenu'

export default {
  components: {
    UserMenu
  }
}
</script>
