<template>
  <div class="p-6 lg:p-10 w-full font-display">
    
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Overview</h2>
        <p class="text-slate-500 text-sm mt-1">Real-time performance metrics for your business.</p>
      </div>
      
      <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
        <button class="px-4 py-2 rounded-lg text-sm font-bold bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white">Today</button>
        <button class="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">7 Days</button>
        <button class="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Month</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center p-20">
      <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>

    <div v-else class="space-y-6">
      
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Gross Revenue -->
        <div class="glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-colors"></div>
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Gross Revenue</h3>
            <div class="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">payments</span>
            </div>
          </div>
          <p class="text-4xl font-black text-slate-900 dark:text-white">${{ summary.today.total.toFixed(2) }}</p>
          <div class="flex items-center gap-2 mt-4 text-sm font-bold">
            <span class="flex items-center text-green-600 dark:text-green-400">
              <span class="material-symbols-outlined text-xs">arrow_upward</span>
              12%
            </span>
            <span class="text-slate-400">vs yesterday</span>
          </div>
        </div>

        <!-- Orders Processed -->
        <div class="glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Orders Today</h3>
            <div class="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">receipt_long</span>
            </div>
          </div>
          <p class="text-4xl font-black text-slate-900 dark:text-white">{{ summary.today.count }}</p>
          <div class="flex items-center gap-2 mt-4 text-sm font-bold">
            <span class="text-slate-400">Total tickets finalized</span>
          </div>
        </div>

        <!-- Average Ticket -->
        <div class="glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Avg Ticket</h3>
            <div class="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">analytics</span>
            </div>
          </div>
          <p class="text-4xl font-black text-slate-900 dark:text-white">${{ averageTicket.toFixed(2) }}</p>
          <div class="flex items-center gap-2 mt-4 text-sm font-bold">
            <span class="text-slate-400">Revenue per order</span>
          </div>
        </div>

      </div>

      <!-- Second Row: Top Products & Staff -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Top Products List -->
        <div class="glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <span class="material-symbols-outlined text-sm font-bold">local_fire_department</span>
              </div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">Top Products</h3>
            </div>
          </div>
          <div class="p-6 flex-1">
            <div v-if="topProducts.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 py-10">
              <span class="material-symbols-outlined text-4xl mb-2">trending_flat</span>
              <p class="font-bold text-sm">No sales data yet</p>
            </div>
            <div v-else class="space-y-5">
              <div v-for="(product, index) in topProducts" :key="index" class="flex items-center gap-4 group">
                <div class="text-2xl font-black text-slate-300 dark:text-slate-700 w-8 text-center tabular-nums transition-colors group-hover:text-primary">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-slate-900 dark:text-white truncate">{{ product.name }}</h4>
                  <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <!-- Fake progress bar based on top seller relative max -->
                    <div class="h-full bg-primary rounded-full transition-all" :style="`width: ${(product.soldCount / maxSoldCount) * 100}%`"></div>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="font-black text-slate-900 dark:text-white tabular-nums">${{ product.revenue.toFixed(2) }}</p>
                  <p class="text-xs font-bold text-slate-500">{{ product.soldCount }} sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Staff Performance -->
        <div class="glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div class="p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <span class="material-symbols-outlined text-sm font-bold">badge</span>
              </div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">Staff Performance</h3>
            </div>
          </div>
          <div class="p-0 flex-1 overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-slate-500">
                  <th class="py-3 px-6">Employee</th>
                  <th class="py-3 px-6 text-center">Orders</th>
                  <th class="py-3 px-6 text-right">Collected</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
                <tr v-if="staffPerformance.length === 0">
                  <td colspan="3" class="py-10 text-center text-slate-400 font-bold text-sm">No activity recorded today</td>
                </tr>
                <tr v-for="staff in staffPerformance" :key="staff.name" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3 px-6">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300 uppercase">
                        {{ staff.name.substring(0, 2) }}
                      </div>
                      <span class="font-bold text-slate-900 dark:text-white">{{ staff.name }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-6 text-center font-bold text-slate-600 dark:text-slate-400">
                    {{ staff.ordersProcessed }}
                  </td>
                  <td class="py-3 px-6 text-right font-black text-green-600 dark:text-green-400 tabular-nums">
                    +${{ staff.totalCollected.toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { analyticsService, type SalesSummary, type TopProduct, type StaffPerformance } from '../services/analytics.service';

const loading = ref(true);
const summary = ref<SalesSummary>({ today: { total: 0, count: 0 }, month: { total: 0 } });
const topProducts = ref<TopProduct[]>([]);
const staffPerformance = ref<StaffPerformance[]>([]);

const averageTicket = computed(() => {
  if (summary.value.today.count === 0) return 0;
  return summary.value.today.total / summary.value.today.count;
});

const maxSoldCount = computed(() => {
  if (topProducts.value.length === 0) return 1;
  return Math.max(...topProducts.value.map(p => p.soldCount));
});

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const [sumData, prodData, staffData] = await Promise.all([
      analyticsService.getSummary(),
      analyticsService.getTopProducts(5),
      analyticsService.getStaffPerformance()
    ]);
    
    summary.value = sumData;
    topProducts.value = prodData;
    staffPerformance.value = staffData;
  } catch (error) {
    console.error("Failed to load analytics data", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.glass-aero {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
