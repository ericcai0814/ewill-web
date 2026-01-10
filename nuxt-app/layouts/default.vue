<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1 pt-20">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
