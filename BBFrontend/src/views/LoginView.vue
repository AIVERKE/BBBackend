<template>
  <v-container fluid class="pa-0 fill-height login-container bg-background-light dark:bg-background-dark">
    <v-row no-gutters class="fill-height">
      <!-- Image side (Desktop only) -->
      <v-col
        cols="12"
        md="6"
        lg="7"
        class="hidden-sm-and-down fill-height position-relative"
      >
        <v-img
          src="/login-bg.png"
          cover
          class="fill-height"
        >
          <div class="fill-height bg-gradient-overlay d-flex flex-column justify-end pa-16">
            <h2 class="text-h2 font-weight-black text-white mb-4">
              La Experiencia <span class="text-primary">Orko</span>
            </h2>
            <p class="text-h5 text-white/90 font-weight-light max-w-lg">
              Sabor artesanal, gestión digital. Ordena tu menú con un solo click.
            </p>
          </div>
        </v-img>
      </v-col>

      <!-- Form side -->
      <v-col
        cols="12"
        md="6"
        lg="5"
        class="d-flex align-center justify-center bg-white dark:bg-zinc-900 elevation-md-8 position-relative z-10"
      >
        <v-card
          flat
          class="bg-transparent w-100 px-6 py-12 px-sm-12 px-md-16"
          max-width="540"
        >
          <!-- Header Section -->
          <div class="d-flex flex-column align-center text-center mb-12">
            <v-sheet
              rounded="xl"
              color="primary"
              variant="tonal"
              class="pa-5 mb-6 d-flex justify-center align-center"
              height="80"
              width="80"
            >
              <v-icon
                icon="mdi-pizza"
                size="48"
                color="primary"
              ></v-icon>
            </v-sheet>
            <h1 class="text-h3 font-weight-bold text-slate-900 dark:text-white mb-3 font-display">
              Bienvenido de vuelta
            </h1>
            <p class="text-blue-grey-lighten-1 text-subtitle-1">
              Ingresa tus credenciales para acceder a tu panel
            </p>
          </div>

          <!-- Form Section -->
          <v-form @submit.prevent="handleLogin" class="mt-4">
            
            <div class="text-subtitle-2 font-weight-medium mb-2 text-medium-emphasis">Usuario o Email</div>
            <v-text-field
              v-model="username"
              placeholder="Ej. juanperez o admin@orko.com"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-6"
              prepend-inner-icon="mdi-account-outline"
              hide-details="auto"
              :rules="[v => !!v || 'Usuario requerido']"
              bg-color="background-light dark:bg-zinc-800"
              single-line
            ></v-text-field>

            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2 font-weight-medium text-medium-emphasis">Contraseña</span>
              <v-btn
                variant="plain"
                size="small"
                color="primary"
                class="text-none px-0 mt-n1 font-weight-medium"
                to="/forgot-password"
                :ripple="false"
              >
                ¿Olvidaste tu contraseña?
              </v-btn>
            </div>
            
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-8"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              hide-details="auto"
              :rules="[v => !!v || 'Contraseña requerida']"
              bg-color="background-light dark:bg-zinc-800"
              single-line
            ></v-text-field>

            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mb-6 rounded-lg"
              density="compact"
            >
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              block
              size="x-large"
              rounded="lg"
              class="text-none font-weight-bold elevation-2 mb-5"
              :loading="loading"
              height="56"
            >
              Ingresar a mi cuenta
            </v-btn>

            <v-btn
              variant="outlined"
              color="primary"
              block
              size="x-large"
              rounded="lg"
              class="text-none font-weight-bold"
              height="56"
              to="/register"
            >
              Registrarse
            </v-btn>
          </v-form>

          <!-- Footer -->
          <div class="mt-16 d-flex justify-center gap-6 pt-8 border-t border-slate-200 dark:border-zinc-800">
            <v-btn variant="text" size="small" color="medium-emphasis" class="text-none">Privacidad</v-btn>
            <v-btn variant="text" size="small" color="medium-emphasis" class="text-none">Términos</v-btn>
            <v-btn variant="text" size="small" color="medium-emphasis" class="text-none">Ayuda</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';

const router = useRouter();
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) return;
  
  loading.value = true;
  error.value = '';
  try {
    // If the input contains an @, treat it as a Staff email login, otherwise Customer username.
    if (username.value.includes('@')) {
      const response = await authService.loginUser(username.value, password.value);
      if (response.role === 'ADMIN' || response.role === 'EMPLOYEE' || response.role === 'SUPER_USER') {
        router.push('/cashier');
      } else {
        router.push('/');
      }
    } else {
      await authService.loginCustomer(username.value, password.value);
      router.push('/');
    }
  } catch (err: any) {
    error.value = 'Credenciales inválidas. Por favor verifique sus datos.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
}

.bg-gradient-overlay {
  background: linear-gradient(to top, rgba(16, 25, 36, 0.9) 0%, rgba(16, 25, 36, 0.4) 50%, transparent 100%);
}

.font-display {
  font-family: 'Public Sans', sans-serif !important;
  letter-spacing: -0.02em;
}

/* Make inputs look cleaner by removing the inner shadow and adjusting border */
:deep(.v-field__outline__start),
:deep(.v-field__outline__end) {
  border-width: 1.5px;
}

:deep(.v-field--focused .v-field__outline__start),
:deep(.v-field--focused .v-field__outline__end),
:deep(.v-field--focused .v-field__outline__notch::before),
:deep(.v-field--focused .v-field__outline__notch::after) {
  border-width: 2px;
}

:deep(.v-field) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.border-t {
  border-top-width: 1px;
  border-top-style: solid;
}
</style>
