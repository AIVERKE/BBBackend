<template>
  <div class="p-6 lg:p-10 w-full font-display h-full flex flex-col">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Business Profile</h2>
      <p class="text-slate-500 text-sm mt-1">Customize your brand identity and public storefront.</p>
    </div>

    <!-- Settings Card -->
    <div class="max-w-4xl glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm p-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>

      <form v-else @submit.prevent="saveSettings" class="space-y-10">
        <!-- Logo Section -->
        <div class="flex flex-col md:flex-row gap-10 items-start md:items-center">
          <div class="relative group">
            <div class="size-32 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
              <img 
                v-if="form.logoUrl" 
                :src="form.logoUrl" 
                class="w-full h-full object-cover transition-transform group-hover:scale-105"
                alt="Business Logo"
              />
              <span v-else class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">storefront</span>
              
              <!-- Upload Overlay -->
              <label class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input type="file" class="hidden" @change="handleLogoUpload" accept="image/*" :disabled="uploading">
                <div class="text-white text-center">
                  <span class="material-symbols-outlined text-2xl mb-1">{{ uploading ? 'progress_activity' : 'upload' }}</span>
                  <p class="text-[10px] font-bold uppercase tracking-widest">{{ uploading ? 'Uploading...' : 'Change Logo' }}</p>
                </div>
              </label>
            </div>
            
            <!-- Remove Logo -->
            <button 
              v-if="form.logoUrl"
              type="button"
              @click="form.logoUrl = ''" 
              class="absolute -top-2 -right-2 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 rounded-full p-1.5 text-red-500 hover:text-red-600 transition-colors"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Business Logo</h3>
            <p class="text-sm text-slate-500 mb-4">This logo will appear on your digital menu, checkout, and tickets. Recommended size: 512x512px.</p>
            <div class="flex gap-3">
               <label class="px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Choose File
                  <input type="file" class="hidden" @change="handleLogoUpload" accept="image/*" :disabled="uploading">
               </label>
            </div>
          </div>
        </div>

        <div class="h-px bg-slate-100 dark:bg-slate-800"></div>

        <!-- Business Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Business Name</label>
            <input 
              v-model="form.businessName" 
              type="text" 
              required 
              class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium"
              placeholder="e.g. Mario's Pizza Hub"
            >
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Access Status</label>
            <div class="flex items-center gap-3 py-3 px-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Live & Active</span>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end pt-4">
          <button 
            type="submit" 
            :disabled="saving || uploading"
            class="px-8 py-3.5 bg-primary hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            Save Changes
          </button>
        </div>
      </form>
    </div>

    <!-- Preview Section -->
    <div class="mt-12">
      <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Storefront Preview</h3>
      <div class="max-w-md glass-aero bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4">
        <div class="size-10 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
          <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-cover">
          <span v-else class="material-symbols-outlined text-white">restaurant</span>
        </div>
        <div class="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">
          {{ form.businessName || 'LUXE DINING' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { authService } from '../services/auth.service';
import { tenantsService, type Tenant } from '../services/tenants.service';

const loading = ref(true);
const saving = ref(false);
const uploading = ref(false);

const currentUser = computed(() => authService.getCurrentUser());
const tenantId = computed(() => currentUser.value?.tenantId);

const form = ref({
  businessName: '',
  logoUrl: ''
});

const fetchData = async () => {
  if (!tenantId.value) return;
  loading.value = true;
  try {
    const tenant = await tenantsService.getTenant(tenantId.value);
    form.value.businessName = tenant.businessName;
    form.value.logoUrl = tenant.logoUrl || '';
  } catch (err) {
    console.error('Failed to load settings', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const handleLogoUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  uploading.value = true;
  try {
    const result = await tenantsService.uploadLogo(file);
    form.value.logoUrl = result.url;
  } catch (err) {
    console.error('Upload failed', err);
    alert('Failed to upload image. Please try again.');
  } finally {
    uploading.value = false;
  }
};

const saveSettings = async () => {
  if (!tenantId.value || !form.value.businessName) return;

  saving.value = true;
  try {
    await tenantsService.updateTenant(tenantId.value, {
      businessName: form.value.businessName,
      logoUrl: form.value.logoUrl
    });
    alert('Settings updated successfully!');
  } catch (err) {
    console.error('Update failed', err);
    alert('Failed to update settings.');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.glass-aero {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
