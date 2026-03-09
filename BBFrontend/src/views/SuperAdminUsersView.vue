<template>
  <div class="p-6 max-w-7xl mx-auto font-display">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Global Users Database</h1>
        <p class="text-slate-500">Manage all personal accounts, admins, and staff across the platform.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-slate-900/10 dark:shadow-white/10 flex items-center justify-center gap-2"
      >
        <span class="material-symbols-outlined text-xl">person_add</span>
        New User
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined">error</span>
        {{ error }}
      </div>
      <button @click="error = ''" class="material-symbols-outlined hover:text-red-800 transition-colors">close</button>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center p-12">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="users.length === 0" class="text-center p-16">
        <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">group_off</span>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No users found</h3>
        <p class="text-slate-500 max-w-sm mx-auto">There are no user accounts registered in the database currently.</p>
      </div>

      <!-- Users Grid -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th class="p-4 font-bold">ID</th>
              <th class="p-4 font-bold">Name & Email</th>
              <th class="p-4 font-bold">Role</th>
              <th class="p-4 font-bold">Workspace (Tenant)</th>
              <th class="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="p-4 text-sm font-medium text-slate-500">#{{ user.id }}</td>
              <td class="p-4">
                <p class="font-bold text-slate-900 dark:text-white">{{ user.fullName }}</p>
                <p class="text-sm text-slate-500">{{ user.email }}</p>
              </td>
              <td class="p-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase',
                  user.role === 'SUPER_USER' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                  user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                ]">
                  {{ user.role }}
                </span>
              </td>
              <td class="p-4">
                <div v-if="user.tenantId && tenantMap[user.tenantId]" class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    <img v-if="tenantMap[user.tenantId].logoUrl" :src="tenantMap[user.tenantId].logoUrl" class="w-full h-full object-cover">
                    <span v-else class="text-[10px] font-bold text-slate-400">{{ tenantMap[user.tenantId].businessName.charAt(0) }}</span>
                  </span>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ tenantMap[user.tenantId].businessName }}</span>
                </div>
                <span v-else class="text-sm text-slate-400 italic">No Workspace (Global)</span>
              </td>
              <td class="p-4 text-right">
                <button 
                  @click="openEditModal(user)"
                  class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 mr-1"
                  title="Edit User"
                >
                  <span class="material-symbols-outlined text-lg">edit</span>
                </button>
                <button 
                  @click="openDeleteModal(user)"
                  class="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                  title="Delete User"
                >
                  <span class="material-symbols-outlined text-lg">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Modal Backdrop Overlay -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      
      <!-- Create/Edit Modal Box -->
      <div v-if="modalType === 'create' || modalType === 'edit'" class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ modalType === 'create' ? 'Register New User' : 'Edit User' }}
          </h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6">
          <div class="space-y-4">
            
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input 
                v-model="form.fullName" 
                type="text" 
                required 
                class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                placeholder="John Doe"
              >
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input 
                v-model="form.email" 
                type="email" 
                required 
                class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                placeholder="john@example.com"
              >
            </div>

            <!-- Password (Create Only) -->
            <div v-if="modalType === 'create'">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
              <input 
                v-model="form.password" 
                type="password" 
                :required="modalType === 'create'" 
                class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                placeholder="••••••••"
              >
            </div>

            <!-- Role Selector -->
            <div>
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
              <div class="relative">
                <select 
                  v-model="form.role" 
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none text-slate-900 dark:text-white font-medium"
                >
                  <option value="EMPLOYEE">Staff / Employee</option>
                  <option value="ADMIN">Restaurant Admin</option>
                  <option value="SUPER_USER">Platform Super User</option>
                </select>
                <span class="material-symbols-outlined absolute right-4 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Workspace Assignment -->
            <div v-if="form.role !== 'SUPER_USER'">
              <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Workspace</label>
              <div class="relative">
                <select 
                  v-model.number="form.tenantId" 
                  required
                  class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none text-slate-900 dark:text-white font-medium"
                >
                  <option disabled value="">Select a business...</option>
                  <option v-for="t in tenants" :key="t.id" :value="t.id">
                    {{ t.businessName }} (ID: {{ t.id }})
                  </option>
                </select>
                <span class="material-symbols-outlined absolute right-4 top-3.5 text-slate-400 pointer-events-none">workspace_premium</span>
              </div>
            </div>

          </div>

          <div class="mt-8 flex gap-3">
            <button 
              type="button" 
              @click="closeModal"
              class="flex-1 px-4 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="submitting"
              class="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="submitting" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              {{ modalType === 'create' ? 'Create User' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Delete Confirmation Modal Box -->
      <div v-if="modalType === 'delete'" class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-center p-8">
        <div class="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-3xl">warning</span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete {{ selectedUser?.fullName }}?</h2>
        <p class="text-slate-500 mb-8 max-w-[240px] mx-auto text-sm">
          This action cannot be undone. This user will lose all access to their workspace immediately.
        </p>
        
        <div class="flex flex-col gap-3">
          <button 
            @click="confirmDelete"
            :disabled="submitting"
            class="w-full px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span v-if="submitting" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            Yes, permanently delete
          </button>
          <button 
            @click="closeModal"
            class="w-full px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usersService, type User } from '../services/users.service';
import { tenantsService, type Tenant } from '../services/tenants.service';

const users = ref<User[]>([]);
const tenants = ref<Tenant[]>([]);
const tenantMap = ref<Record<number, Tenant>>({});
const loading = ref(true);
const submitting = ref(false);
const error = ref('');

// Modal state
const showModal = ref(false);
const modalType = ref<'create' | 'edit' | 'delete'>('create');
const selectedUser = ref<User | null>(null);

const form = ref({
  fullName: '',
  email: '',
  password: '',
  role: 'EMPLOYEE',
  tenantId: '' as number | ''
});

const loadInitialData = async () => {
  loading.value = true;
  error.value = '';
  try {
    // Superusers fetching without tenantId will get ALL users and ALL tenants
    const [fetchedUsers, fetchedTenants] = await Promise.all([
      usersService.getUsers(),
      tenantsService.getTenants()
    ]);
    
    users.value = fetchedUsers;
    tenants.value = fetchedTenants;
    
    // Create lookup map to easily display workspaces in the user table
    const map: Record<number, Tenant> = {};
    for (const t of fetchedTenants) {
      map[t.id] = t;
    }
    tenantMap.value = map;

  } catch (err: any) {
    console.error(err);
    error.value = 'Failed to load user database. Please ensure you have super admin privileges.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadInitialData();
});

const openCreateModal = () => {
  modalType.value = 'create';
  selectedUser.value = null;
  form.value = {
    fullName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    tenantId: ''
  };
  showModal.value = true;
};

const openEditModal = (user: User) => {
  modalType.value = 'edit';
  selectedUser.value = user;
  form.value = {
    fullName: user.fullName,
    email: user.email,
    password: '', // Hidden in edit
    role: user.role,
    tenantId: user.tenantId !== null ? user.tenantId : ''
  };
  showModal.value = true;
};

const openDeleteModal = (user: User) => {
  modalType.value = 'delete';
  selectedUser.value = user;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    selectedUser.value = null;
    error.value = '';
  }, 200);
};

const submitForm = async () => {
  submitting.value = true;
  error.value = '';
  
  try {
    // If SUPER_USER, tenantId should technically be ignored by the backend, but let's clear it
    const submissionData = { ...form.value };
    if (submissionData.role === 'SUPER_USER') {
      delete submissionData.tenantId; // or set to null ideally
    } else if (submissionData.tenantId === '') {
      throw new Error("Please select an assigned workspace for this role.");
    }

    if (modalType.value === 'create') {
      await usersService.createUser({
        fullName: submissionData.fullName,
        email: submissionData.email,
        password: submissionData.password,
        role: submissionData.role,
        tenantId: submissionData.tenantId as number | undefined
      });
    } else if (modalType.value === 'edit' && selectedUser.value) {
      await usersService.updateUser(selectedUser.value.id, {
        fullName: submissionData.fullName,
        email: submissionData.email,
        role: submissionData.role,
        tenantId: submissionData.tenantId as number | undefined
      } as any); // UpdateUserDto in backend receives tenantId
    }

    await loadInitialData();
    closeModal();
  } catch (err: any) {
    console.error(err);
    error.value = err.response?.data?.message || err.message || 'Operation failed. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = async () => {
  if (!selectedUser.value) return;
  
  submitting.value = true;
  error.value = '';
  try {
    await usersService.deleteUser(selectedUser.value.id);
    await loadInitialData();
    closeModal();
  } catch (err: any) {
    console.error(err);
    error.value = err.response?.data?.message || 'Failed to delete user.';
  } finally {
    submitting.value = false;
  }
};
</script>
