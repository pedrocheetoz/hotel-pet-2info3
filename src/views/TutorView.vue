<template>
  <div >
  <h1>
    Tutores
  </h1>
  <p></p>
</div>


</template>
<script setup>
import { computed,onMounted,ref } from 'vue';

 const API_URL = "https://localhost:3000"

  const tutores = ref([]);
  const pets = ref([]);

  async function carregarDados() {
  const respostaPets = await fetch(`${API_URL}/pets`);
  pets.value = await respostaPets.json();

  const respostaTutores = await fetch(`${API_URL}/tutores`);
  tutores.value = await respostaTutores.json();
}
function petNome(petId) {
  for (const pet of pets.value) {
    if (pet.id === petId) {
      return pet.nome;
    }
    else{
      'Pet não encontrado!'
    }
  }
}
onMounted(carregarDados)
</script>
<style scoped></style>
