<script setup>
import { onMounted, ref } from 'vue';

const API_URL = 'http://localhost:3000';

const pets = ref([]);
const tutores = ref([]);

async function carregarDados() {
  const respostaPets = await fetch(`${API_URL}/pets`);
  pets.value = await respostaPets.json();

  const respostaTutores = await fetch(`${API_URL}/tutores`);
  tutores.value = await respostaTutores.json();
}
function nomeDoTutor(tutorId) {
  for (const tutor of tutores.value) {
    if (tutor.id === tutorId) {
      return tutor.nome;
    }
  }
  return 'Tutor não encontrado';
}

 async function excluirPet (id) {
  //lógica para excluir o pet

  const confirmarExclusao = window.confirm(
    'Deseja realmente excluir esse pet?',
  );

  if (confirmarExclusao) {
    await fetch(`${API_URL}/pets/${id}`, {
      method: 'DELETE',
    });
    await carregarDados();
  }
}

onMounted(carregarDados);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Pets</h1>
      <p class="text-body-secondary mb-0">
        Listagem dos Pets cadastrados no sistema.
      </p>
    </header>
  </div>
  <table class="table table-scriped table-hover">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>Espécie</th>
        <th>Tutor</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="pet in pets"
        :key="pet.id"
      >
        <td>{{ pet.id }}</td>
        <td>{{ pet.nome }}</td>
        <td>{{ pet.especie }}</td>
        <td>
          {{ nomeDoTutor(pet.tutorId) }}
        </td>
        <td>
          <RouterLink :to="`pets/${pet.id}`"> Visualizar </RouterLink>
          <button
            class="btn btn-danger"
            @click="excluirPet(pet.id)"
          >
            Excluir
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

