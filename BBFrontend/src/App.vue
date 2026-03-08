<template>
  <v-app>
    <v-app-bar flat border color="surface" v-if="!isLoginPage">
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-orbit-variant" class="mr-2" color="primary"></v-icon>
        Orko Management
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
      <v-btn icon="mdi-logout" @click="logout"></v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { authService } from './services/auth.service';

const theme = useTheme();
const route = useRoute();
const router = useRouter();

const isLoginPage = computed(() => route.path === '/login');

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
