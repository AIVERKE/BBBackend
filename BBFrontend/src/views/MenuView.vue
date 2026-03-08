<template>
  <div class="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
    <div class="layout-container flex h-full grow flex-col">
      <header class="sticky top-0 z-50 glass-aero border-b border-slate-200 dark:border-slate-800 px-6 lg:px-20 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
            <div class="size-8 bg-primary rounded-lg flex items-center justify-center text-white overflow-hidden">
              <img v-if="tenant?.logoUrl" :src="tenant.logoUrl" class="w-full h-full object-cover">
              <span v-else class="material-symbols-outlined text-xl">restaurant</span>
            </div>
            <h2 class="text-slate-900 dark:text-slate-100 text-xl font-extrabold tracking-tight uppercase">
              {{ tenant?.businessName || 'ORKO' }}
            </h2>
          </div>
          <div class="hidden md:flex items-center gap-10">
            <a class="text-slate-900 dark:text-slate-100 text-sm font-semibold hover:opacity-70 transition-opacity" href="#">Menu</a>
            <a class="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-colors" href="#">Reservations</a>
            <a class="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-colors" href="#">Orders</a>
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" @click="logout">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>
      <main class="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-8">
        <section class="mb-10">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div class="max-w-xl">
              <h1 class="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Curated Flavors</h1>
              <p class="text-slate-500 dark:text-slate-400">Experience artisanal cuisine delivered to your doorstep.</p>
            </div>
            <div class="w-full md:w-80">
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                  v-model="searchQuery" 
                  @input="handleSearch"
                  class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                  placeholder="Search our menu..." 
                  type="text"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Categories Navigation -->
        <nav class="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          <button 
            @click="selectCategory(null)"
            :class="[
              'px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors',
              selectedCategoryId === null 
                ? 'bg-primary text-white' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
          >
            All Items
          </button>
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="selectCategory(category.id)"
            :class="[
              'px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors',
              selectedCategoryId === category.id 
                ? 'bg-primary text-white border border-primary' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
          >
            {{ category.name }}
          </button>
        </nav>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 text-red-500 font-medium">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="products.length === 0" class="text-center py-20">
          <div class="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-2xl text-slate-400">restaurant_menu</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">No products found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Try adjusting your filters or search query.</p>
        </div>

        <!-- Product Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <div 
                v-if="product.imageUrl"
                class="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" 
                :style="`background-image: url('${product.imageUrl}')`"
              ></div>
              <span v-else class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700">fastfood</span>
              
              <div v-if="product.isPopular" class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                BEST SELLER
              </div>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex justify-between items-start mb-2 gap-4">
                <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{{ product.name }}</h3>
                <span class="text-lg font-semibold text-primary whitespace-nowrap">${{ Number(product.price).toFixed(2) }}</span>
              </div>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-2">{{ product.description || 'Delicately prepared for your enjoyment.' }}</p>
              <button 
                @click="addToCart(product)"
                class="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                <span class="material-symbols-outlined text-xl">add_shopping_cart</span>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer class="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-12 px-6 lg:px-20 mt-20">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-3">
            <div class="size-6 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-slate-600 dark:text-slate-400 overflow-hidden">
              <img v-if="tenant?.logoUrl" :src="tenant.logoUrl" class="w-full h-full object-cover">
              <span v-else class="material-symbols-outlined text-sm">restaurant</span>
            </div>
            <h2 class="text-slate-900 dark:text-slate-100 text-sm font-extrabold tracking-tight uppercase">
              {{ tenant?.businessName || 'ORKO' }}
            </h2>
          </div>
          <div class="flex gap-8">
            <a class="text-slate-400 hover:text-primary transition-colors text-xs font-medium uppercase tracking-widest" href="#">Privacy</a>
            <a class="text-slate-400 hover:text-primary transition-colors text-xs font-medium uppercase tracking-widest" href="#">Terms</a>
            <a class="text-slate-400 hover:text-primary transition-colors text-xs font-medium uppercase tracking-widest" href="#">Support</a>
          </div>
          <p class="text-slate-400 text-xs">© 2024 {{ tenant?.businessName || 'Orko' }} SaaS. All rights reserved.</p>
        </div>
      </footer>

      <!-- Shopping Cart Sticky Bar -->
      <div v-if="cart.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4 transform transition-transform duration-300 translate-y-0">
        <div class="glass-aero shadow-2xl rounded-2xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="size-12 bg-primary rounded-xl flex items-center justify-center text-white">
                <span class="material-symbols-outlined">shopping_bag</span>
              </div>
              <span class="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold size-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                {{ cartItemCount }}
              </span>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-900 dark:text-slate-100">Your Cart</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ cartItemCount }} items selected</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Subtotal</p>
              <p class="text-lg font-extrabold text-slate-900 dark:text-slate-100">${{ cartSubtotal.toFixed(2) }}</p>
            </div>
            <button 
              @click="processCheckout"
              :disabled="checkoutLoading"
              class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center min-w-[120px]"
            >
              <span v-if="checkoutLoading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              <span v-else>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service';
import { menuService, type Category, type Product } from '../services/menu.service';
import { tenantsService, type Tenant } from '../services/tenants.service';
import { orderService, type CreateOrderDto } from '../services/order.service';

const router = useRouter();

// State
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategoryId = ref<number | null>(null);
const searchQuery = ref('');
const loading = ref(true);
const error = ref('');
const checkoutLoading = ref(false);
const tenant = ref<Tenant | null>(null);

// Cart State
interface CartItem extends Product {
  quantity: number;
  isPopular?: boolean; // Fix lint
}
const cart = ref<CartItem[]>([]);

const cartItemCount = computed(() => cart.value.length);
const cartSubtotal = computed(() => {
  return cart.value.reduce((total, item) => total + Number(item.price), 0);
});

// Mock Images for aesthetics since backend has no dummy data
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1481070555726-e2fe83477d15?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=800&auto=format&fit=crop'
];

// Methods
const fetchMenuData = async () => {
  loading.value = true;
  error.value = '';
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
      console.error('Failed to load tenant info', err);
    }

    // Fetch Categories
    categories.value = await menuService.getCategories(user.tenantId);

    // Fetch Products
    const fetchedProducts = await menuService.getProducts(
      selectedCategoryId.value || undefined, 
      searchQuery.value || undefined
    );
    
    // Inject mock images if they don't have one for visual presentation
    products.value = fetchedProducts.map((p, i) => ({
      ...p,
      imageUrl: p.imageUrl || MOCK_IMAGES[i % MOCK_IMAGES.length],
      isPopular: i % 3 === 0 // Make every 3rd item "Best Seller" for aesthetics
    }));

  } catch (err: any) {
    console.error(err);
    error.value = 'Failed to load the menu. Please try again later.';
  } finally {
    loading.value = false;
  }
};

const selectCategory = (id: number | null) => {
  selectedCategoryId.value = id;
  fetchMenuData(); // Re-fetch products based on category
};

// Debounce search slightly
let searchTimeout: any;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchMenuData();
  }, 500);
};

const addToCart = (product: Product) => {
  const existingItem = cart.value.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

const processCheckout = async () => {
  if (cart.value.length === 0 || checkoutLoading.value) return;
  
  checkoutLoading.value = true;
  try {
    const user = authService.getCurrentUser();
    
    // Map cart items exactly as DTO expects
    const orderDto: CreateOrderDto = {
      tenantId: user.tenantId,
      orderReference: 'Table/Pickup Order',
      items: cart.value.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    const result = await orderService.createOrder(orderDto);
    
    // Clear cart after successful creation
    cart.value = [];
    
    // Redirect to success view to display QR code
    router.push({
      name: 'order-success',
      params: { id: result.id }
    });
    
  } catch (err) {
    console.error('Checkout failed', err);
    alert('Oops! There was an issue processing your order. Please try again.');
  } finally {
    checkoutLoading.value = false;
  }
};

const logout = () => {
  authService.logout();
  router.push('/login');
};

// Lifecycle
onMounted(() => {
  fetchMenuData();
});
</script>
