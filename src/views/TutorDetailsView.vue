<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { cadastrar, requisicao } from '../services/api';
import { telefoneFormatado } from '../utils/mascaras';

const route = useRoute();
const tutor = ref(null);
const pets = ref([]);
const carregando = ref(false);
const salvando = ref(false);
const erro = ref('');
const erroPet = ref('');
const nome = ref('');
const especie = ref('');
const podeSalvar = computed(
  () => nome.value.trim() && especie.value.trim() && !salvando.value,
);
let carregamento = 0;

async function carregarTutor() {
  const atual = ++carregamento;
  const tutorId = route.params.id;
  carregando.value = true;
  tutor.value = null;
  pets.value = [];
  erro.value = '';
  erroPet.value = '';
  nome.value = '';
  especie.value = '';
  try {
    const [dadosTutor, dadosPets] = await Promise.all([
      requisicao(`/tutores/${encodeURIComponent(tutorId)}`),
      requisicao(`/pets?tutorId=${encodeURIComponent(tutorId)}`),
    ]);
    if (atual !== carregamento) return;
    tutor.value = dadosTutor;
    pets.value = dadosPets;
  } catch (e) {
    if (atual === carregamento)
      erro.value = `Erro ao carregar tutor. ${e.message}`;
  } finally {
    if (atual === carregamento) carregando.value = false;
  }
}

async function salvarPet() {
  if (!podeSalvar.value || !tutor.value) return;
  const tutorId = route.params.id;
  salvando.value = true;
  erroPet.value = '';
  try {
    const pet = await cadastrar('/pets', {
      nome: nome.value.trim(),
      especie: especie.value.trim(),
      tutorId: String(tutorId),
    });
    if (String(route.params.id) !== String(tutorId)) return;
    pets.value.push(pet);
    nome.value = '';
    especie.value = '';
  } catch (e) {
    if (String(route.params.id) === String(tutorId))
      erroPet.value = `Erro ao cadastrar pet. ${e.message}`;
  } finally {
    salvando.value = false;
  }
}
watch(() => route.params.id, carregarTutor, { immediate: true });
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Detalhes do Tutor</h1>
      <p class="text-body-secondary mb-0">
        Dados do tutor e seus pets vinculados.
      </p>
    </header>
    <RouterLink
      to="/tutores"
      class="btn btn-secondary mb-3"
      >Voltar</RouterLink
    >
    <p
      v-if="carregando"
      role="status"
    >
      Carregando tutor...
    </p>
    <div
      v-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>
    <template v-if="tutor && !carregando">
      <section
        class="mb-4"
        aria-labelledby="dados-tutor"
      >
        <h2
          id="dados-tutor"
          class="h4"
        >
          Dados do tutor
        </h2>
        <dl>
          <dt>ID</dt>
          <dd>{{ tutor.id }}</dd>
          <dt>Nome completo</dt>
          <dd>{{ tutor.nome }}</dd>
          <dt>Telefone</dt>
          <dd>{{ telefoneFormatado(tutor.telefone) }}</dd>
        </dl>
      </section>
      <section
        class="mb-4"
        aria-labelledby="pets-tutor"
      >
        <h2
          id="pets-tutor"
          class="h4"
        >
          Pets vinculados
        </h2>
        <div
          v-if="pets.length"
          class="table-responsive"
        >
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Espécie</th>
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
                  <RouterLink
                    :to="`/pets/${pet.id}`"
                    class="btn btn-primary btn-sm"
                    >Visualizar</RouterLink
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else>Nenhum pet vinculado a este tutor.</p>
      </section>
      <section aria-labelledby="novo-pet">
        <h2
          id="novo-pet"
          class="h4"
        >
          Cadastrar pet para este tutor
        </h2>
        <div
          v-if="erroPet"
          class="alert alert-danger"
          role="alert"
        >
          {{ erroPet }}
        </div>
        <form @submit.prevent="salvarPet">
          <div class="col-md-6 mb-3">
            <label
              for="nome-pet"
              class="form-label"
              >Nome do pet</label
            >
            <input
              id="nome-pet"
              v-model="nome"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label
              for="especie-pet"
              class="form-label"
              >Espécie</label
            >
            <input
              id="especie-pet"
              v-model="especie"
              class="form-control"
              list="especies"
              placeholder="Selecione ou informe a espécie"
              required
            />
            <datalist id="especies">
              <option value="Cachorro" />
              <option value="Gato" />
              <option value="Hamster" />
            </datalist>
          </div>
          <button
            type="submit"
            class="btn btn-success"
            :disabled="!podeSalvar"
          >
            {{ salvando ? 'Salvando...' : 'Salvar Pet' }}
          </button>
        </form>
      </section>
    </template>
  </div>
</template>
