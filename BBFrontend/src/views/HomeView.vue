<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mx-auto pa-6" elevation="4" rounded="xl">
          <v-card-item>
            <div class="text-overline mb-1">WELCOME TO ORKO</div>
            <div class="text-h4 font-weight-black mb-4">
              Welcome back!
            </div>
            <div class="text-subtitle-1 text-medium-emphasis mb-6">
              Everything you need to manage your business in one place.
            </div>
          </v-card-item>

          <v-row>
            <v-col v-for="card in quickActions" :key="card.title" cols="12" sm="6">
              <v-card
                :color="card.color"
                variant="tonal"
                link
                class="h-100 pa-4"
                rounded="lg"
              >
                <v-icon :icon="card.icon" size="32" class="mb-4"></v-icon>
                <div class="text-h6 font-weight-bold">{{ card.title }}</div>
                <div class="text-body-2">{{ card.description }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const quickActions = [
  {
    title: 'Orders',
    description: 'Track and manage customer orders',
    icon: 'mdi-cart-outline',
    color: 'primary',
  },
  {
    title: 'Products',
    description: 'Inventory and pricing management',
    icon: 'mdi-package-variant-closed',
    color: 'secondary',
  },
  {
    title: 'Customers',
    description: 'Customer relations and history',
    icon: 'mdi-account-group-outline',
    color: 'info',
  },
  {
    title: 'Analytics',
    description: 'Performance and growth metrics',
    icon: 'mdi-chart-line',
    color: 'success',
  },
];
</script>
