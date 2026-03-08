<template>
  <div class="p-6 lg:p-10 w-full font-display">
    
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Menu Editor</h2>
        <p class="text-slate-500 text-sm mt-1">Manage your catalog, pricing, and availability.</p>
      </div>
      
      <button 
        @click="openModal()" 
        class="bg-primary text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
      >
        <span class="material-symbols-outlined text-sm font-black">add</span>
        New Product
      </button>
    </div>

    <!-- Data Table / Grid -->
    <div v-if="loading" class="flex justify-center p-16">
      <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>
    
    <div v-else-if="products.length === 0" class="text-center py-20 glass-aero rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30">
      <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="material-symbols-outlined text-3xl text-slate-400">restaurant_menu</span>
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
      <p class="text-slate-500 mb-6 max-w-sm mx-auto">Your menu is currently empty. Start building your catalog by adding your first product.</p>
      <button @click="openModal()" class="text-primary font-bold hover:underline">Create First Product</button>
    </div>

    <div v-else class="glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-slate-500">
              <th class="p-4 pl-6">Product</th>
              <th class="p-4">Category</th>
              <th class="p-4">Price</th>
              <th class="p-4 text-center">Status</th>
              <th class="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
            <tr 
              v-for="product in products" 
              :key="product.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
            >
              <td class="p-4 pl-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover">
                    <span v-else class="material-symbols-outlined text-slate-300">broken_image</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">{{ product.name }}</h4>
                    <p class="text-xs text-slate-500 truncate max-w-[200px]">{{ product.description || 'No description' }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                  {{ getCategoryName(product.categoryId) }}
                </span>
              </td>
              <td class="p-4 font-black text-slate-900 dark:text-white">
                ${{ Number(product.price).toFixed(2) }}
              </td>
              <td class="p-4 text-center">
                <span 
                  class="px-2.5 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 w-max mx-auto"
                  :class="product.isAvailable ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50' : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="product.isAvailable ? 'bg-green-500' : 'bg-slate-400'"></span>
                  {{ product.isAvailable ? 'Active' : 'Hidden' }}
                </span>
              </td>
              <td class="p-4 text-right pr-6">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openModal(product)" class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                    <span class="material-symbols-outlined text-sm font-bold">edit</span>
                  </button>
                  <button @click="confirmDelete(product)" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                    <span class="material-symbols-outlined text-sm font-bold">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal (Create / Edit) -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
        <div class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
          
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0">
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">
              {{ isEditing ? 'Edit Product' : 'Create New Product' }}
            </h3>
            <button @click="closeModal" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span class="material-symbols-outlined text-sm font-bold">close</span>
            </button>
          </div>

          <div class="p-6 overflow-y-auto flex-1">
            <form @submit.prevent="saveProduct" class="space-y-6">
              
              <!-- Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name *</label>
                  <input required v-model="form.name" type="text" class="w-full bg-slate-50 dark:bg-slate-800 border bg-transparent border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                </div>
                
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea v-model="form.description" rows="2" class="w-full bg-slate-50 dark:bg-slate-800 border bg-transparent border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Price *</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input required v-model.number="form.price" type="number" step="0.01" min="0" class="w-full bg-slate-50 dark:bg-slate-800 border bg-transparent border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category *</label>
                  <div class="relative">
                    <select required v-model.number="form.categoryId" class="w-full appearance-none bg-slate-50 dark:bg-slate-800 border bg-transparent border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                      <option value="" disabled>Select a category</option>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                  </div>
                </div>
                
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Image URL</label>
                  <div class="flex gap-4 items-center">
                    <input v-model="form.imageUrl" type="url" placeholder="https://example.com/image.png" class="flex-1 bg-slate-50 dark:bg-slate-800 border bg-transparent border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    <div class="w-12 h-12 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <img v-if="form.imageUrl" :src="form.imageUrl" class="w-full h-full object-cover">
                      <span v-else class="material-symbols-outlined text-slate-300 text-sm">image</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Toggles -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label class="flex items-center gap-3 cursor-pointer">
                  <div class="relative">
                    <input type="checkbox" v-model="form.isAvailable" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                  </div>
                  <span class="text-sm font-bold text-slate-900 dark:text-white">Active (Visible in Menu)</span>
                </label>
              </div>
            </form>
          </div>

          <!-- Footer Actions -->
          <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0 flex justify-end gap-3">
            <button @click="closeModal" type="button" class="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button 
              @click="saveProduct" 
              :disabled="saving"
              class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              {{ isEditing ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { menuService, type Product, type Category, type CreateProductDto } from '../services/menu.service';
import { authService } from '../services/auth.service';

const loading = ref(true);
const saving = ref(false);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const tenantId = ref<number>(0);

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const defaultForm = (): CreateProductDto => ({
  name: '',
  description: '',
  price: 0,
  categoryId: 1, // Will be overridden dynamically
  tenantId: tenantId.value || 0,
  imageUrl: '',
  isAvailable: true
});

const form = ref<CreateProductDto>(defaultForm());

const fetchData = async () => {
  loading.value = true;
  try {
    const user = authService.getCurrentUser();
    if (user) {
      tenantId.value = user.tenantId;
      const [cats, prods] = await Promise.all([
        menuService.getCategories(tenantId.value),
        menuService.getProducts()
      ]);
      categories.value = cats;
      products.value = prods;
      
      // Auto-select first category for the form
      if (cats.length > 0 && !isEditing.value) {
        form.value.categoryId = cats[0].id;
      }
    }
  } catch (err) {
    console.error('Error fetching admin data', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const getCategoryName = (id: number) => {
  const cat = categories.value.find(c => c.id === id);
  return cat ? cat.name : 'Unknown';
};

const openModal = (product?: Product) => {
  if (product) {
    isEditing.value = true;
    editingId.value = product.id;
    form.value = {
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      categoryId: product.categoryId,
      tenantId: product.tenantId,
      imageUrl: product.imageUrl || '',
      isAvailable: product.isAvailable !== false
    };
  } else {
    isEditing.value = false;
    editingId.value = null;
    form.value = defaultForm();
    if (categories.value && categories.value.length > 0) {
      form.value.categoryId = categories.value[0]?.id || 1;
    }
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  if (saving.value) return;
  isModalOpen.value = false;
};

const saveProduct = async () => {
  if (!form.value.name || !form.value.price || !form.value.categoryId) {
    alert("Please fill all required fields.");
    return;
  }

  saving.value = true;
  try {
    // Ensure tenantId is injected just before sending
    form.value.tenantId = tenantId.value;

    if (isEditing.value && editingId.value) {
      // The backend UPDATE dto might not strictly need tenantId but it's safe to send
      await menuService.updateProduct(editingId.value, form.value);
    } else {
      await menuService.createProduct(form.value);
    }
    closeModal();
    await fetchData(); // Refresh table
  } catch (err: any) {
    console.error('Failed to save product:', err.response?.data || err);
    alert(err.response?.data?.message || "There was an error saving the product. Please check all fields.");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (product: Product) => {
  if (confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
    try {
      await menuService.deleteProduct(product.id);
      await fetchData();
    } catch (err) {
      console.error('Fail to delete', err);
      alert('Could not delete product.');
    }
  }
};
</script>

<style scoped>
.glass-aero {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
