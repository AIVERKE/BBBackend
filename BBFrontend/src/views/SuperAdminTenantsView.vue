<template>
  <div class="p-6 max-w-7xl mx-auto font-display">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Global Tenants</h1>
        <p class="text-slate-500">Manage all businesses and workspaces on the platform.</p>
      </div>
      <button 
        @click="showCreateModal = true"
        class="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        <span class="material-symbols-outlined">add_business</span>
        Create Business
      </button>
    </div>

    <!-- Error/Loading states -->
    <div v-if="loading" class="flex justify-center p-12">
      <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
      <span class="material-symbols-outlined">error</span>
      {{ error }}
    </div>

    <!-- Tenants Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="tenant in tenants" 
        :key="tenant.id"
        class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col items-center group"
      >
        <div class="absolute top-0 right-0 p-4 flex items-center gap-2">
          <button 
            @click="openEditModal(tenant)"
            class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            title="Edit Workspace"
          >
            <span class="material-symbols-outlined text-sm">edit</span>
          </button>
          <span class="px-3 py-1 text-xs font-bold rounded-full" :class="tenant.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ tenant.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <div class="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 overflow-hidden border border-slate-200 dark:border-slate-600">
          <img v-if="tenant.logoUrl" :src="tenant.logoUrl" :alt="tenant.businessName" class="w-full h-full object-cover">
          <span v-else class="material-symbols-outlined text-3xl text-slate-400">storefront</span>
        </div>
        
        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white text-center mb-1">{{ tenant.businessName }}</h3>
        <p class="text-xs text-slate-500 font-medium uppercase tracking-widest">ID: {{ tenant.id }} • Created: {{ new Date(tenant.createdAt).toLocaleDateString() }}</p>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
          
          <div class="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">store</span> 
              New Business Workspace
            </h2>
            <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="handleCreate" class="p-6">
            <div class="space-y-6">
              
              <!-- Business Section -->
              <div>
                <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Workspace Info</h3>
                
                <div class="mb-4">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                  <input 
                    v-model="form.businessName" 
                    type="text" 
                    required
                    class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:border-slate-700 dark:text-white"
                    placeholder="e.g. Gourmet Burger Central"
                  >
                </div>

                <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Logo URL (Optional)</label>
                  <label 
                    class="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      class="hidden"
                      @change="handleLogoSelect($event, 'create')"
                    >
                    <div class="flex flex-col items-center gap-2">
                      <span class="material-symbols-outlined text-slate-400 text-3xl">upload_file</span>
                      <span v-if="createLogoFile" class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ createLogoFile.name }}</span>
                      <span v-else class="text-sm font-medium text-slate-500">Click to upload image file</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Admin User Section -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Initial Admin Setup</h3>
                
                <div class="mb-4">
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Full Name</label>
                  <input 
                    v-model="form.adminName" 
                    type="text" 
                    required
                    class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:border-slate-700 dark:text-white"
                    placeholder="John Doe"
                  >
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input 
                      v-model="form.adminEmail" 
                      type="email" 
                      required
                      class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:border-slate-700 dark:text-white"
                      placeholder="admin@business.com"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                    <input 
                      v-model="form.adminPassword" 
                      type="password" 
                      required
                      class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:border-slate-700 dark:text-white"
                      placeholder="••••••••"
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 flex gap-3">
              <button 
                type="button" 
                @click="showCreateModal = false"
                class="flex-1 py-3 px-4 font-bold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-[2] py-3 px-4 font-bold rounded-xl text-white bg-primary hover:bg-primary/90 flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                {{ isSubmitting ? 'Creating...' : 'Create Workspace & Admin' }}
              </button>
            </div>
            
            <p v-if="submitError" class="mt-4 text-sm text-red-500 text-center font-medium">{{ submitError }}</p>
          </form>
        </div>
      </div>
    </Teleport>
    <Teleport to="body">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
          
          <div class="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">edit_square</span> 
              Edit Workspace
            </h2>
            <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form @submit.prevent="handleEdit" class="p-6">
            <div class="space-y-6">
              
              <div class="mb-4">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                <input 
                  v-model="editForm.businessName" 
                  type="text" 
                  required
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:border-slate-700 dark:text-white"
                >
              </div>

              <div class="mb-4">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Logo Image (Optional)</label>
                <!-- Existing Thumbnail preview if not replacing -->
                <div v-if="editForm.logoUrl && !editLogoFile" class="flex items-center gap-4 mb-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <img :src="editForm.logoUrl" class="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700">
                  <p class="text-xs text-slate-500 truncate flex-1">{{ editForm.logoUrl }}</p>
                  <button type="button" @click="editForm.logoUrl = ''" class="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
                <!-- File Upload Trigger -->
                <label 
                  class="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    class="hidden"
                    @change="handleLogoSelect($event, 'edit')"
                  >
                  <div class="flex flex-col items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400 text-2xl">upload_file</span>
                    <span v-if="editLogoFile" class="text-sm font-medium text-primary">{{ editLogoFile.name }} (Pending upload)</span>
                    <span v-else class="text-sm font-medium text-slate-500">{{ editForm.logoUrl ? 'Upload a new file to replace it' : 'Click to upload image file' }}</span>
                  </div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">Active Status</h4>
                  <p class="text-xs text-slate-500">Enable or disable this workspace</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="editForm.isActive" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div class="mt-8 flex gap-3">
              <button 
                type="button" 
                @click="showEditModal = false"
                class="flex-1 py-3 px-4 font-bold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="flex-[2] py-3 px-4 font-bold rounded-xl text-white bg-primary hover:bg-primary/90 flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
            
            <p v-if="submitError" class="mt-4 text-sm text-red-500 text-center font-medium">{{ submitError }}</p>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { tenantsService, type Tenant } from '../services/tenants.service';

const tenants = ref<Tenant[]>([]);
const loading = ref(true);
const error = ref('');

const showCreateModal = ref(false);
const showEditModal = ref(false);
const isSubmitting = ref(false);
const submitError = ref('');

// File state variables
const createLogoFile = ref<File | null>(null);
const editLogoFile = ref<File | null>(null);

const form = ref({
  businessName: '',
  logoUrl: '',
  adminName: '',
  adminEmail: '',
  adminPassword: ''
});

const editForm = ref({
  id: 0,
  businessName: '',
  logoUrl: '',
  isActive: true
});

const loadTenants = async () => {
  loading.value = true;
  error.value = '';
  try {
    tenants.value = await tenantsService.getTenants();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load workspaces.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTenants();
});

const handleLogoSelect = (event: Event, type: 'create' | 'edit') => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files.item(0);
    if (file) {
      if (type === 'create') {
        createLogoFile.value = file;
      } else {
        editLogoFile.value = file;
      }
    }
  }
};

const handleCreate = async () => {
  isSubmitting.value = true;
  submitError.value = '';
  try {
    let finalLogoUrl = form.value.logoUrl;
    
    // Process logo upload first if a file was selected
    if (createLogoFile.value) {
      const uploadResult = await tenantsService.uploadLogo(createLogoFile.value);
      finalLogoUrl = uploadResult.url;
    }

    const payload = {
      businessName: form.value.businessName,
      logoUrl: finalLogoUrl || undefined,
      isActive: true, // Default to true
      adminName: form.value.adminName,
      adminEmail: form.value.adminEmail,
      adminPassword: form.value.adminPassword
    };
    
    await tenantsService.createTenant(payload);
    
    // Reset and close
    form.value = {
      businessName: '', logoUrl: '', adminName: '', adminEmail: '', adminPassword: ''
    };
    createLogoFile.value = null;
    showCreateModal.value = false;
    
    // Reload list
    await loadTenants();
  } catch (err: any) {
    submitError.value = err.response?.data?.message || 'Failed to create workspace. Verify email uniqueness.';
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const openEditModal = (t: Tenant) => {
  editForm.value = {
    id: t.id,
    businessName: t.businessName,
    logoUrl: t.logoUrl || '',
    isActive: t.isActive
  };
  editLogoFile.value = null;
  showEditModal.value = true;
};

const handleEdit = async () => {
  isSubmitting.value = true;
  submitError.value = '';
  try {
    let finalLogoUrl = editForm.value.logoUrl;
    
    // Process logo upload first if a file was selected
    if (editLogoFile.value) {
      const uploadResult = await tenantsService.uploadLogo(editLogoFile.value);
      finalLogoUrl = uploadResult.url;
    }

    await tenantsService.updateTenant(editForm.value.id, {
      businessName: editForm.value.businessName,
      logoUrl: finalLogoUrl || undefined,
      isActive: editForm.value.isActive
    });
    showEditModal.value = false;
    await loadTenants();
  } catch (err: any) {
    submitError.value = err.response?.data?.message || 'Failed to update workspace.';
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
