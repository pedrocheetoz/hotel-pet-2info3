<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav aria-label="Menu da PetSchool">
    <div class="nav flex-column nav-pills gap-1">
      <RouterLink
        class="nav-link"
        active-class="active"
        to="/pets"
      >
        <i
          class="bi bi-heart me-2"
          aria-hidden="true"
        ></i>
        Pets
      </RouterLink>

      <RouterLink
        class="nav-link"
        active-class="active"
        to="/pets/novo"
      >
        <i
          class="bi bi-plus-circle me-2"
          aria-hidden="true"
        ></i>
        Novo pet
      </RouterLink>

      <RouterLink to="/tutores"
      class="nav-link"
      active-class="active"
      
      >
        <i
          class="bi bi-people me-2"
          aria-hidden="true"
        ></i>
        Tutores
</RouterLink>
    </div>
  </nav>
</template>
