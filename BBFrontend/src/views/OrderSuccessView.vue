<template>
  <div class="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 items-center justify-center p-6">
    
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <span class="material-symbols-outlined animate-spin text-5xl text-primary">progress_activity</span>
      <p class="text-slate-500 font-medium">Preparing your order...</p>
    </div>
    
    <div v-else-if="error" class="text-center max-w-md w-full glass-aero rounded-3xl p-8 bg-white/50 dark:bg-slate-900/50 shadow-2xl">
      <div class="size-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">error</span>
      </div>
      <h2 class="text-2xl font-extrabold mb-2">Oops!</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-8">{{ error }}</p>
      <button 
        @click="router.push('/')"
        class="w-full bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
      >
        Return to Menu
      </button>
    </div>

    <div v-else-if="order" class="w-full max-w-md">
      <!-- Success Card -->
      <div class="glass-aero rounded-3xl p-8 bg-white/50 dark:bg-slate-900/50 shadow-2xl backdrop-blur-xl border border-white/60 dark:border-slate-800/60 relative overflow-hidden">
        
        <!-- Decorative Header Background -->
        <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-transparent"></div>
        
        <div class="relative z-10 text-center">
          <div class="size-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 overflow-hidden">
            <img v-if="tenant?.logoUrl" :src="tenant.logoUrl" class="w-full h-full object-cover">
            <span v-else class="material-symbols-outlined text-4xl text-white">check_circle</span>
          </div>
          
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Order Confirmed</h1>
          <p class="text-sm font-semibold text-primary mb-6 uppercase tracking-widest">{{ tenant?.businessName || 'Orko' }} - Order #{{ String(order.id).padStart(4, '0') }}</p>
          
          <p class="text-slate-600 dark:text-slate-300 text-sm mb-8 leading-relaxed max-w-[280px] mx-auto">
            Your order has been successfully placed. Please head to the cashier and present this code to pay and pick up your items.
          </p>
          
          <!-- QR Code Container -->
          <div class="bg-white p-4 rounded-2xl shadow-inner inline-block mx-auto mb-8 border border-slate-100">
            <img :src="order.qrImage" alt="Payment QR Code" class="size-48 object-contain" />
          </div>
          
          <!-- Order Summary -->
          <div class="text-left mt-2">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">receipt_long</span>
              Order Summary
            </h3>
            
            <div class="flex justify-between items-center py-3 border-t border-slate-200 dark:border-slate-800">
              <span class="text-slate-600 dark:text-slate-400 font-medium">Total Amount</span>
              <span class="text-xl font-extrabold text-slate-900 dark:text-white">${{ Number(order.totalAmount).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-slate-500 dark:text-slate-500 text-sm">Status</span>
              <span class="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Back to Menu Button -->
      <button 
        @click="router.push('/')"
        class="w-full mt-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-4 rounded-xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
      >
        Return to Menu
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { orderService, type OrderResponse } from '../services/order.service';
import { authService } from '../services/auth.service';
import { tenantsService, type Tenant } from '../services/tenants.service';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');
const order = ref<OrderResponse | null>(null);
const tenant = ref<Tenant | null>(null);

const fetchOrderDetails = async () => {
  const orderId = route.params.id as string;
  if (!orderId) {
    error.value = "Invalid order requested.";
    loading.value = false;
    return;
  }

  try {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch Tenant Info
    try {
      tenant.value = await tenantsService.getTenant(user.tenantId);
    } catch (err) {
      console.error('Failed to load tenant info for success page', err);
    }

    // Since our backend doesn't currently return a single order by ID directly for customers 
    // with the QR image attached (unless via POST), we can look it up in "my-orders"
    // Note: A more robust backend would have a GET /orders/:id/qr endpoint for customers.
    // For now, if the POST /orders call succeeded, it passed the order ID to this route.
    // We fetch the pending orders to find the one matching this ID to prove it exists.
    
    const myOrders = await orderService.getMyOrders(user.tenantId);
    const foundOrder = myOrders.find(o => String(o.id) === orderId);
    
    if (foundOrder) {
      // Because GET /orders/my-orders doesn't return the raw Base64 QR code image,
      // we generate a fallback placeholder or we could modify the backend.
      // For this SaaS Demo, we will ask the backend to generate the QR from the token.
      
      // In a real scenario, the backend would return `qrImage` here.
      order.value = {
        ...foundOrder,
        // Fallback fake QR for UI demonstration purposes if the backend didn't supply it in GET
        qrImage: foundOrder.qrImage || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${foundOrder.qrToken}`
      };
    } else {
      error.value = "Order not found or you don't have permission to view it.";
    }

  } catch (err) {
    console.error(err);
    error.value = 'Could not load your order details. Please try again.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrderDetails();
});
</script>

<style scoped>
.glass-aero {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
