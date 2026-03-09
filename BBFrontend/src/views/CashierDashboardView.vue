<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col">
    <!-- Navbar -->
    <header class="glass-aero sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 p-4 px-6 flex justify-between items-center shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-primary/20 overflow-hidden">
          <img v-if="tenant?.logoUrl" :src="tenant.logoUrl" class="w-full h-full object-cover">
          <span v-else class="material-symbols-outlined">point_of_sale</span>
        </div>
        <div>
          <h1 class="font-extrabold text-xl tracking-tight leading-none text-slate-900 dark:text-white uppercase truncate max-w-[200px]">
            {{ tenant?.businessName || 'Dashboard' }}
          </h1>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">{{ currentUser?.email || 'Staff' }}</p>
        </div>
      </div>
      <button @click="logout" class="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
        <span class="material-symbols-outlined">logout</span>
      </button>
    </header>

    <main class="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <!-- Top Stats Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="glass-aero rounded-3xl p-6 bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/60 shadow-lg relative overflow-hidden">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Today's Orders</p>
              <h2 class="text-4xl font-extrabold text-slate-900 dark:text-white">{{ stats.ordersCount }}</h2>
            </div>
            <div class="p-3 bg-primary/10 text-primary rounded-2xl">
              <span class="material-symbols-outlined">receipt_long</span>
            </div>
          </div>
          <p class="text-sm font-semibold flex items-center gap-1" :class="stats.percentageChange >= 0 ? 'text-green-600' : 'text-red-500'">
            <span class="material-symbols-outlined text-sm">{{ stats.percentageChange >= 0 ? 'trending_up' : 'trending_down' }}</span>
            {{ Math.abs(stats.percentageChange) }}% vs yesterday
          </p>
        </div>
        
        <!-- Action Card: Scan QR -->
        <div @click="scanQrCode" class="md:col-span-2 glass-aero rounded-3xl p-6 bg-gradient-to-r from-primary to-primary/80 border border-white/20 shadow-lg shadow-primary/30 text-white flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform">
          <div>
            <h2 class="text-2xl font-extrabold mb-2">Scan New Order</h2>
            <p class="text-white/80 text-sm max-w-sm">Use the camera to scan a customer's QR code or select an order from the pending queue below.</p>
          </div>
          <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <span class="material-symbols-outlined text-3xl">qr_code_scanner</span>
          </div>
        </div>
      </section>

      <!-- Pending Orders Queue -->
      <section>
        <div class="flex justify-between items-end mb-6">
          <h2 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Pending Queue
            <span class="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 py-1 px-3 text-xs rounded-full font-black">{{ pendingOrders.length }}</span>
          </h2>
          <button @click="fetchData" class="text-sm text-primary font-bold hover:underline flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        <div v-if="loading" class="flex justify-center p-12">
          <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
        
        <div v-else-if="pendingOrders.length === 0" class="text-center py-16 glass-aero rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30">
          <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 inline-block">inbox</span>
          <h3 class="text-xl font-bold text-slate-500 mb-1">Queue is empty</h3>
          <p class="text-sm text-slate-400">Waiting for new orders...</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="order in pendingOrders" 
            :key="order.id"
            @click="openPaymentModal(order)"
            class="glass-aero bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-6 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Order #{{ String(order.id).padStart(4, '0') }}</h3>
              </div>
              <span class="bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 p-2 rounded-xl">
                <span class="material-symbols-outlined text-xl">pending_actions</span>
              </span>
            </div>
            
            <p v-if="order.orderReference" class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4 bg-slate-100 dark:bg-slate-700/50 py-1.5 px-3 rounded-lg inline-block">
              {{ order.orderReference }}
            </p>

            <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
              <span class="text-sm font-bold text-slate-500">Total</span>
              <span class="text-xl font-black text-slate-900 dark:text-white">${{ Number(order.totalAmount).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Payment Modal -->
    <Teleport to="body">
      <div v-if="selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
        <div class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
          
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">Process Payment</h3>
            <button @click="closeModal" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span class="material-symbols-outlined text-sm font-bold">close</span>
            </button>
          </div>

          <div class="p-8">
            <p class="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Order #{{ String(selectedOrder.id).padStart(4, '0') }}</p>
            <h2 class="text-center text-4xl font-black text-slate-900 dark:text-white mb-8">${{ Number(selectedOrder.totalAmount).toFixed(2) }}</h2>
            
            <div class="mb-6">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Amount Received (Cash)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">$</span>
                <input 
                  type="number" 
                  v-model.number="amountReceived" 
                  class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-10 pr-4 text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:bg-white transition-colors"
                  placeholder="0.00"
                  step="0.01"
                >
              </div>
            </div>

            <!-- Change Calculation -->
            <div class="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 flex justify-between items-center mb-8 border border-slate-200 dark:border-slate-700/50">
              <span class="font-bold text-slate-600 dark:text-slate-400">Change Due:</span>
              <span class="text-2xl font-black" :class="(amountReceived || 0) >= Number(selectedOrder.totalAmount) ? 'text-green-600 dark:text-green-400' : 'text-slate-400'">
                ${{ changeDue.toFixed(2) }}
              </span>
            </div>

            <button 
              @click="confirmPayment"
              :disabled="!isValidPayment || paymentLoading"
              class="w-full bg-primary text-white py-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="paymentLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
              <template v-else>
                <span class="material-symbols-outlined">payments</span> 
                Confirm Payment
              </template>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';
import { tenantsService, type Tenant } from '../services/tenants.service';
import { orderService, type OrderResponse, type OrderStatsDto } from '../services/order.service';

const router = useRouter();
const currentUser = ref<any>(null);
const tenant = ref<Tenant | null>(null);

const loading = ref(true);
const pendingOrders = ref<OrderResponse[]>([]);
const stats = ref<OrderStatsDto>({ ordersCount: 0, percentageChange: 0 });

// Modal State
const selectedOrder = ref<OrderResponse | null>(null);
const amountReceived = ref<number | null>(null);
const paymentLoading = ref(false);

const changeDue = computed(() => {
  if (!selectedOrder.value || !amountReceived.value) return 0.00;
  const change = amountReceived.value - Number(selectedOrder.value.totalAmount);
  return change > 0 ? change : 0.00;
});

const isValidPayment = computed(() => {
  if (!selectedOrder.value || !amountReceived.value) return false;
  return amountReceived.value >= Number(selectedOrder.value.totalAmount);
});

const fetchData = async () => {
  loading.value = true;
  try {
    if (!currentUser.value) return;
    const tenantId = currentUser.value.tenantId;
    
    // Fetch both calls simultaneously
    const [ordersData, statsData] = await Promise.all([
      orderService.getPendingOrders(tenantId),
      orderService.getTodayStats(tenantId)
    ]);
    
    pendingOrders.value = ordersData;
    stats.value = statsData;
  } catch (err) {
    console.error('Failed to fetch dashboard data', err);
  } finally {
    loading.value = false;
  }
};

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
      console.error('Failed to load tenant info for cashier', err);
    }
  }
  
  fetchData();
});

const scanQrCode = () => {
  const token = prompt('Scanner simulated! Please enter or scan the QR Code string (UUID):');
  if (token && token.trim() !== '') {
    const order = pendingOrders.value.find(o => o.qrToken === token.trim());
    if (order) {
      openPaymentModal(order);
    } else {
      alert('Order not found or already paid in this queue. Please verify the QR code.');
    }
  }
};

const openPaymentModal = (order: OrderResponse) => {
  selectedOrder.value = order;
  amountReceived.value = null; // Reset input
};

const closeModal = () => {
  if (paymentLoading.value) return;
  selectedOrder.value = null;
};

const confirmPayment = async () => {
  if (!isValidPayment.value || !selectedOrder.value) return;
  
  paymentLoading.value = true;
  try {
    await orderService.confirmCashPayment({
      qrToken: selectedOrder.value.qrToken,
      amountReceived: amountReceived.value!
    });
    
    // Success: Close modal and refresh list
    closeModal();
    await fetchData();
    
    // Optional: Could trigger an independent success toast here
  } catch (err) {
    console.error('Payment confirmation failed', err);
    alert('Failed to process payment. Please verify the QR token or network connection.');
  } finally {
    paymentLoading.value = false;
  }
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
