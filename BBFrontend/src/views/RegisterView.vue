<template>
  <v-container fluid class="pa-0 fill-height login-container bg-background-light dark:bg-background-dark">
    <v-row no-gutters class="fill-height">
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
          <div class="d-flex flex-column align-center text-center mb-8">
            <v-sheet
              rounded="xl"
              color="primary"
              variant="tonal"
              class="pa-5 mb-5 d-flex justify-center align-center"
              height="80"
              width="80"
            >
              <v-icon
                icon="mdi-account-plus"
                size="48"
                color="primary"
              ></v-icon>
            </v-sheet>
            <h1 class="text-h3 font-weight-bold text-slate-900 dark:text-white mb-2 font-display">
              Crear cuenta
            </h1>
            <p class="text-blue-grey-lighten-1 text-subtitle-1">
              Únete a Orko y gestiona tus pedidos
            </p>
          </div>

          <!-- Form Section -->
          <v-form @submit.prevent="handleRegister" class="mt-2" ref="form">
            
            <div class="text-subtitle-2 font-weight-medium mb-1 text-medium-emphasis">Nombre de usuario</div>
            <v-text-field
              v-model="formData.username"
              placeholder="Ej. juanperez"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              prepend-inner-icon="mdi-account-outline"
              hide-details="auto"
              :rules="[v => !!v || 'Usuario requerido']"
              bg-color="background-light dark:bg-zinc-800"
              single-line
            ></v-text-field>

            <div class="text-subtitle-2 font-weight-medium mb-1 text-medium-emphasis">Teléfono</div>
            <v-text-field
              v-model="formData.phone"
              placeholder="Ej. 75858809"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              prepend-inner-icon="mdi-phone-outline"
              hide-details="auto"
              :rules="[v => !!v || 'Teléfono requerido']"
              bg-color="background-light dark:bg-zinc-800"
              single-line
            ></v-text-field>

            <div class="text-subtitle-2 font-weight-medium mb-1 text-medium-emphasis">Contraseña</div>
            <v-text-field
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 6 caracteres"
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-4"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              hide-details="auto"
              :rules="[
                v => !!v || 'Contraseña requerida',
                v => v.length >= 6 || 'Mínimo 6 caracteres'
              ]"
              bg-color="background-light dark:bg-zinc-800"
              single-line
            ></v-text-field>
            
            <div class="text-subtitle-2 font-weight-medium mb-1 text-medium-emphasis">Restaurante</div>
            <v-autocomplete
              v-model="formData.tenantId"
              :items="tenants"
              item-title="name"
              item-value="id"
              :loading="loadingTenants"
              placeholder="Buscar restaurante..."
              variant="outlined"
              color="primary"
              rounded="lg"
              class="mb-6"
              prepend-inner-icon="mdi-storefront-outline"
              hide-details="auto"
              :rules="[v => !!v || 'Debe seleccionar un restaurante']"
              bg-color="background-light dark:bg-zinc-800"
              single-line
              no-data-text="No se encontraron restaurantes"
            ></v-autocomplete>

            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mb-6 rounded-lg"
              density="compact"
            >
              {{ error }}
            </v-alert>
            
            <v-alert
              v-if="success"
              type="success"
              variant="tonal"
              class="mb-6 rounded-lg"
              density="compact"
            >
              ¡Cuenta creada exitosamente! Redirigiendo...
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              block
              size="x-large"
              rounded="lg"
              class="text-none font-weight-bold elevation-2 mb-4"
              :loading="loading"
              height="56"
            >
              Registrarse
            </v-btn>

            <v-btn
              variant="text"
              color="medium-emphasis"
              block
              class="text-none"
              to="/login"
            >
              ¿Ya tienes cuenta? <span class="text-primary font-weight-bold ml-1">Inicia sesión</span>
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
      
      <!-- Image side (Desktop only) -> Reversed position from Login -->
      <v-col
        cols="12"
        md="6"
        lg="7"
        class="hidden-sm-and-down fill-height position-relative border-l border-slate-200 dark:border-zinc-800"
      >
        <v-img
          src="/login-bg.png"
          cover
          class="fill-height"
        >
          <div class="fill-height bg-gradient-overlay d-flex flex-column justify-end pa-16 text-right">
            <h2 class="text-h2 font-weight-black text-white mb-4">
              Únete a <span class="text-primary">Orko</span>
            </h2>
            <p class="text-h5 text-white/90 font-weight-light max-w-lg ml-auto">
              Optimiza tu restaurante. Únete a la plataforma de gestión número uno.
            </p>
          </div>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';

const router = useRouter();
const form = ref<any>(null);

const formData = ref({
  username: '',
  phone: '',
  password: '',
  tenantId: null as number | null
});

const tenants = ref<any[]>([]);
const loadingTenants = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref(false);

onMounted(async () => {
  await fetchTenants();
});

const fetchTenants = async () => {
  loadingTenants.value = true;
  try {
    const data = await authService.getTenants();
    tenants.value = Array.isArray(data) ? data : (data.items || []);
  } catch (err) {
    console.error('Failed to load tenants', err);
    error.value = 'No se pudieron cargar los restaurantes. Intente actualizar la página.';
  } finally {
    loadingTenants.value = false;
  }
};

const handleRegister = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  
  loading.value = true;
  error.value = '';
  try {
    await authService.registerCustomer({
      ...formData.value,
      tenantId: formData.value.tenantId as number
    });
    success.value = true;
    setTimeout(() => {
      // Login automatically after registration or redirect to login
      router.push('/login');
    }, 1500);
  } catch (err: any) {
    if (err.response?.status === 409) {
      error.value = 'El nombre de usuario ya existe.';
    } else {
      error.value = 'Error al registrar la cuenta. Verifique los datos.';
    }
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

.border-l {
  border-left-width: 1px;
  border-left-style: solid;
}
</style>
