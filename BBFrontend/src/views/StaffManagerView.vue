<template>
  <div class="p-6 lg:p-10 w-full font-display h-full flex flex-col">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Staff Manager</h2>
        <p class="text-slate-500 text-sm mt-1">Manage your restaurant employees and roles.</p>
      </div>

      <button 
        @click="openModal()" 
        class="flex items-center gap-2 bg-primary hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-primary/20"
      >
        <span class="material-symbols-outlined text-sm">person_add</span>
        Add Employee
      </button>
    </div>

    <!-- Data Grid -->
    <div class="flex-1 glass-aero bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col relative">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>

      <div class="overflow-x-auto flex-1">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider font-extrabold text-slate-500">
              <th class="py-4 px-6 w-16">Profile</th>
              <th class="py-4 px-6">Name</th>
              <th class="py-4 px-6">Email</th>
              <th class="py-4 px-6">Role</th>
              <th class="py-4 px-6">Registered</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
            <tr v-if="!loading && users.length === 0">
              <td colspan="6" class="py-16 text-center text-slate-400">
                <div class="flex flex-col items-center justify-center">
                  <span class="material-symbols-outlined text-5xl mb-3 text-slate-300 dark:text-slate-700">group_off</span>
                  <p class="font-bold">No staff members found.</p>
                  <p class="text-sm mt-1">Click "Add Employee" to create a new account.</p>
                </div>
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
              <td class="py-3 px-6">
                <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">
                  {{ user.fullName.substring(0, 2) }}
                </div>
              </td>
              <td class="py-4 px-6 font-bold text-slate-900 dark:text-white">
                {{ user.fullName }}
                <span v-if="user.id === currentUserId" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">You</span>
              </td>
              <td class="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm font-medium">
                {{ user.email }}
              </td>
              <td class="py-4 px-6">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                  :class="getRoleClass(user.role)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getRoleDotClass(user.role)"></span>
                  {{ user.role }}
                </span>
              </td>
              <td class="py-4 px-6 text-slate-400 dark:text-slate-500 text-sm font-medium">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button 
                    v-if="user.role !== 'SUPER_USER'"
                    @click="openModal(user)" 
                    class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors"
                    title="Edit User"
                  >
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button 
                    v-if="user.id !== currentUserId && user.role !== 'SUPER_USER'"
                    @click="confirmDelete(user)" 
                    class="p-2 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    title="Delete User"
                  >
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">{{ isEditing ? 'Edit Employee' : 'New Employee' }}</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="saveUser" class="space-y-5">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Full Name *</label>
                <input 
                  v-model="form.fullName" 
                  type="text" 
                  required 
                  class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium"
                  placeholder="e.g. Maria Gonzalez"
                >
              </div>

              <div>
                <label class="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Role *</label>
                <select 
                  v-model="form.role" 
                  class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium appearance-none"
                  :disabled="isEditing && editingRole === 'admin'"
                >
                  <option value="employee">Employee (Cashier)</option>
                  <option value="admin" v-if="currentUserRole === 'superuser'">Admin (Manager)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Email Address *</label>
              <input 
                v-model="form.email" 
                type="email" 
                required 
                class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium"
                placeholder="maria@orko.com"
              >
            </div>

            <div v-if="!isEditing">
              <label class="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Temporary Password *</label>
              <input 
                v-model="form.password" 
                type="password" 
                required 
                class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900 dark:text-white transition-all font-medium"
                placeholder="••••••••"
              >
              <p class="text-xs text-slate-400 mt-2">The employee will use this to sign in.</p>
            </div>

          </form>
        </div>

        <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-end gap-3 mt-auto">
          <button 
            type="button" 
            @click="closeModal" 
            class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveUser" 
            :disabled="saving"
            class="px-5 py-2.5 text-sm font-bold bg-primary hover:bg-slate-800 text-white rounded-xl transition-colors shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
          >
            <span v-if="saving" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            {{ isEditing ? 'Save Changes' : 'Create Employee' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usersService, type User, type CreateUserDto } from '../services/users.service';
import { authService } from '../services/auth.service';

const users = ref<User[]>([]);
const loading = ref(true);
const saving = ref(false);

const currentUserPayload = computed(() => authService.getCurrentUser());
const tenantId = computed(() => currentUserPayload.value?.tenantId);
const currentUserId = computed(() => currentUserPayload.value?.sub);
const currentUserRole = computed(() => currentUserPayload.value?.role);

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const editingRole = ref<string>('');

const defaultForm = (): CreateUserDto => ({
  fullName: '',
  email: '',
  password: '',
  role: 'EMPLOYEE',
  tenantId: tenantId.value
});

const form = ref<CreateUserDto>(defaultForm());

const fetchData = async () => {
  loading.value = true;
  try {
    // If admin, fetch only their tenant. If SuperUser, fetch all (or pass tenant if specified)
    const tid = currentUserRole.value === 'SUPER_USER' ? undefined : tenantId.value;
    const response = await usersService.getUsers(tid);
    users.value = response;
  } catch (error) {
    console.error("Failed to load staff list", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const openModal = (user?: User) => {
  if (user) {
    isEditing.value = true;
    editingId.value = user.id;
    editingRole.value = user.role;
    form.value = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || undefined
    };
  } else {
    isEditing.value = false;
    editingId.value = null;
    editingRole.value = '';
    form.value = defaultForm();
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  form.value = defaultForm();
};

const saveUser = async () => {
  if (!form.value.fullName || !form.value.email || (!isEditing.value && !form.value.password)) {
    alert("Please fill in all required fields.");
    return;
  }

  saving.value = true;
  try {
    // Always enforce the creator's tenant if Admin
    if (currentUserRole.value === 'ADMIN') {
        form.value.tenantId = tenantId.value;
    }

    if (isEditing.value && editingId.value) {
      await usersService.updateUser(editingId.value, {
        fullName: form.value.fullName,
        email: form.value.email,
        role: form.value.role
      });
    } else {
      await usersService.createUser(form.value);
    }
    closeModal();
    await fetchData();
  } catch (err: any) {
    console.error('Failed to save user:', err.response?.data || err);
    alert(err.response?.data?.message || "There was an error saving the employee. The email might already be in use.");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (user: User) => {
  if (confirm(`Are you sure you want to remove ${user.fullName} from the staff list? They will lose access to the system immediately.`)) {
    try {
      await usersService.deleteUser(user.id);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete user', err);
      alert("There was an error deleting the user.");
    }
  }
};

const getRoleClass = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    case 'EMPLOYEE': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    case 'SUPER_USER': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  }
};

const getRoleDotClass = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'bg-amber-500';
    case 'EMPLOYEE': return 'bg-blue-500';
    case 'SUPER_USER': return 'bg-purple-500';
    default: return 'bg-slate-500';
  }
};
</script>

<style scoped>
.glass-aero {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
