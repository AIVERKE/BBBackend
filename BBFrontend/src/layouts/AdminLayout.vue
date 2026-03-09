<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col md:flex-row">
    
    <!-- Mobile Header -->
    <header class="md:hidden glass-aero sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 p-4 px-6 flex justify-between items-center shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold overflow-hidden">
          <img v-if="tenant?.logoUrl" :src="tenant.logoUrl" class="w-full h-full object-cover">
          <span v-else class="material-symbols-outlined text-sm">storefront</span>
        </div>
        <h1 class="font-extrabold text-base tracking-tight text-slate-900 dark:text-white uppercase">{{ tenant?.businessName || 'Orko Admin' }}</h1>
      </div>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 text-slate-600 dark:text-slate-300">
        <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
      </button>
    </header>

    <!-- Sidebar Navigation -->
    <aside 
      :class="[
        'fixed md:sticky top-0 left-0 z-50 h-screen w-72 glass-aero bg-white/80 dark:bg-slate-900/80 border-r border-slate-200/50 dark:border-slate-800/50 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-8 hidden md:flex items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div class="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-primary/30 overflow-hidden">
          <img v-if="tenant?.logoUrl" :src="tenant.logoUrl" class="w-full h-full object-cover">
          <span v-else class="material-symbols-outlined text-2xl">storefront</span>
        </div>
        <div>
          <h1 class="font-black text-2xl tracking-tighter text-slate-900 dark:text-white leading-none uppercase">{{ tenant?.businessName || 'Orko' }}</h1>
          <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">Workspace</p>
        </div>
      </div>

      <div class="p-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{{ currentUser?.email || 'Staff' }}</p>
        <div class="mt-2 inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-500 uppercase">
          {{ currentUser?.role || 'User' }}
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <p class="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">Operations</p>
        
        <router-link 
          to="/cashier" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all"
          :class="isCurrentRoute('/cashier') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          @click="closeMobileMenu"
        >
          <span class="material-symbols-outlined" :class="{ 'text-white/80': isCurrentRoute('/cashier') }">point_of_sale</span>
          Cashier
        </router-link>

        <p class="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Management</p>

        <router-link 
          v-if="isAdmin"
          to="/admin/menu" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all"
          :class="isCurrentRoute('/admin/menu') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          @click="closeMobileMenu"
        >
          <span class="material-symbols-outlined" :class="{ 'text-white/80': isCurrentRoute('/admin/menu') }">restaurant_menu</span>
          Menu Editor
        </router-link>

        <router-link 
          v-if="isAdmin"
          to="/admin/analytics" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all"
          :class="isCurrentRoute('/admin/analytics') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          @click="closeMobileMenu"
        >
          <span class="material-symbols-outlined" :class="{ 'text-white/80': isCurrentRoute('/admin/analytics') }">monitoring</span>
          Analytics
        </router-link>

        <router-link 
          v-if="isAdmin"
          to="/admin/staff" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all"
          :class="isCurrentRoute('/admin/staff') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          @click="closeMobileMenu"
        >
          <span class="material-symbols-outlined" :class="{ 'text-white/80': isCurrentRoute('/admin/staff') }">badge</span>
          Staff
        </router-link>

        <router-link 
          v-if="isAdmin"
          to="/admin/settings" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all"
          :class="isCurrentRoute('/admin/settings') ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          @click="closeMobileMenu"
        >
          <span class="material-symbols-outlined" :class="{ 'text-white/80': isCurrentRoute('/admin/settings') }">settings</span>
          Settings
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <button 
          @click="logout" 
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <span class="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile sidebar -->
    <div 
      v-if="mobileMenuOpen" 
      @click="mobileMenuOpen = false"
      class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
    ></div>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 flex flex-col relative h-full min-h-screen">
      <!-- Decorator background -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 -translate-y-1/2 translate-x-1/3"></div>
      
      <!-- Vue Router injects the child views here -->
      <div class="flex-1 w-full max-w-7xl mx-auto">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '../services/auth.service';
import { tenantsService, type Tenant } from '../services/tenants.service';

const router = useRouter();
const route = useRoute();

const currentUser = ref<any>(null);
const tenant = ref<Tenant | null>(null);
const mobileMenuOpen = ref(false);

const isAdmin = computed(() => {
  if (!currentUser.value || !currentUser.value.role) return false;
  const r = currentUser.value.role.toUpperCase();
  return r === 'ADMIN' || r === 'SUPER_USER';
});

onMounted(async () => {
  const user = authService.getCurrentUser();
  if (!user || user.role?.toUpperCase() === 'CUSTOMER') {
    router.push('/login');
    return;
  }
  currentUser.value = user;

  if (user.tenantId) {
    try {
      tenant.value = await tenantsService.getTenant(user.tenantId);
    } catch (err) {
      console.error('Failed to load tenant info for layout', err);
    }
  }
});

const isCurrentRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
.glass-aero {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
