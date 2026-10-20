<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { requisicao } from '../services/api';
import { telefoneFormatado } from '../utils/mascaras';

const tutores = ref([]);
const pets = ref([]);
const carregando = ref(true);
const removendo = ref(null);
const erro = ref('');
const linhas = computed(() =>
  tutores.value.map((tutor) => ({
    ...tutor,
    pets: pets.value.filter((pet) => String(pet.tutorId) === String(tutor.id)),
  })),
);

async function carregarDados() {
  carregando.value = true;
  erro.value = '';
  try {
    [tutores.value, pets.value] = await Promise.all([
      requisicao('/tutores'),
      requisicao('/pets'),
    ]);
  } catch (e) {
    erro.value = `Erro ao carregar tutores. ${e.message}`;
  } finally {
    carregando.value = false;
  }
}

async function removerTutor(id) {
  if (removendo.value !== null) return;
  if (!window.confirm('Deseja realmente remover este tutor?')) return;
  removendo.value = id;
  erro.value = '';
  try {
    const vinculados = await requisicao(
      `/pets?tutorId=${encodeURIComponent(id)}`,
    );
    if (vinculados.length) {
      erro.value =
        'Este tutor possui pets vinculados. Remova ou transfira os pets antes de remover o tutor.';
      return;
    }
    await requisicao(`/tutores/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await carregarDados();
  } catch (e) {
    erro.value = `Erro ao remover tutor. ${e.message}`;
  } finally {
    removendo.value = null;
  }
}
onMounted(carregarDados);
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Listagem de Tutores</h1>
      <p class="text-body-secondary mb-0">
        Listagem dos tutores cadastrados no sistema.
      </p>
    </header>
    <RouterLink
      to="/tutores/novo"
      class="btn btn-primary mb-3"
      >Adicionar Tutor</RouterLink
    >
    <div
      v-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>
    <p
      v-if="carregando"
      role="status"
    >
      Carregando tutores...
    </p>
    <div
      v-else
      class="table-responsive"
    >
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome completo</th>
            <th>Telefone</th>
            <th>Quantidade de pets</th>
            <th>Pets vinculados</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tutor in linhas"
            :key="tutor.id"
          >
            <td>{{ tutor.id }}</td>
            <td>{{ tutor.nome }}</td>
            <td>{{ telefoneFormatado(tutor.telefone) }}</td>
            <td>{{ tutor.pets.length }}</td>
            <td>
              {{
                tutor.pets.map((pet) => pet.nome).join(', ') ||
                'Nenhum pet vinculado'
              }}
            </td>
            <td class="text-nowrap">
              <RouterLink
                :to="`/tutores/${tutor.id}`"
                class="btn btn-primary btn-sm me-2"
                >Visualizar</RouterLink
              >
              <button
                class="btn btn-danger btn-sm"
                :disabled="removendo !== null"
                @click="removerTutor(tutor.id)"
              >
                {{ removendo === tutor.id ? 'Removendo...' : 'Excluir' }}
              </button>
            </td>
          </tr>
          <tr v-if="!linhas.length">
            <td colspan="6">Nenhum tutor cadastrado.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
