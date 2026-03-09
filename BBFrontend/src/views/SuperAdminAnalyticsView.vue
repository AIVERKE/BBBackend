<template>
  <div class="p-6 max-w-7xl mx-auto font-display">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Platform Overview</h1>
      <p class="text-slate-500">Live global metrics across all registered workspaces and tenants.</p>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
      <span class="material-symbols-outlined">error</span>
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Metric 1: Active Workspaces -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">storefront</span>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">{{ globalStats?.activeTenants || 0 }}</h3>
          <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Active Workspaces</p>
        </div>
      </div>

      <!-- Metric 2: Total Users -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">group</span>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">{{ globalStats?.totalUsers || 0 }}</h3>
          <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Registered Users</p>
        </div>
      </div>

      <!-- Metric 3: Total Orders -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">receipt_long</span>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">{{ globalStats?.totalOrders.toLocaleString() || 0 }}</h3>
          <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Global Orders</p>
        </div>
      </div>

      <!-- Metric 4: Total Platform Revenue -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">payments</span>
          </div>
        </div>
        <div>
          <h3 class="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ${{ (globalStats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
          </h3>
          <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Platform Revenue</p>
        </div>
      </div>

    </div>

    <!-- Future expansion area -->
    <div v-if="!loading && !error" class="mt-8 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 border-dashed dark:border-slate-700 p-12 text-center text-slate-400">
      <span class="material-symbols-outlined text-4xl mb-2 opacity-50">query_stats</span>
      <h4 class="font-bold text-slate-600 dark:text-slate-300">Detailed Analytics Coming Soon</h4>
      <p class="text-sm">Historical growth charts and cross-tenant comparative analysis will appear here.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { analyticsService, type GlobalSummary } from '../services/analytics.service';

const globalStats = ref<GlobalSummary | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    globalStats.value = await analyticsService.getGlobalSummary();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load global analytics.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
