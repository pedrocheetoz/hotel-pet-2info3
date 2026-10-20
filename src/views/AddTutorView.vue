<script setup>
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { cadastrar } from '../services/api';
import {
  digitos,
  documentoFormatado,
  telefoneFormatado,
} from '../utils/mascaras';

const router = useRouter();
const nome = ref('');
const telefone = ref('');
const email = ref('');
const documento = ref('');
const salvando = ref(false);
const erro = ref('');
const obrigatorio = 'Ops, campo obrigatório, por favor preencha-o!';
const erros = computed(() => ({
  nome: nome.value.trim() ? '' : obrigatorio,
  telefone: !digitos(telefone.value)
    ? obrigatorio
    : ![10, 11].includes(digitos(telefone.value).length)
      ? 'Informe um telefone com DDD e 10 ou 11 dígitos.'
      : '',
  email:
    email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
      ? 'Informe um e-mail válido.'
      : '',
  documento:
    documento.value && ![11, 14].includes(digitos(documento.value).length)
      ? 'Informe 11 dígitos para CPF ou 14 para CNPJ.'
      : '',
}));
const valido = computed(() =>
  Object.values(erros.value).every((mensagem) => !mensagem),
);

async function salvarTutor() {
  if (!valido.value || salvando.value) return;
  salvando.value = true;
  erro.value = '';
  try {
    const dados = {
      nome: nome.value.trim(),
      telefone: digitos(telefone.value),
    };
    if (email.value) dados.email = email.value;
    if (documento.value) dados.cpfCnpj = digitos(documento.value);
    await cadastrar('/tutores', dados);
    await router.push('/tutores');
  } catch (e) {
    erro.value = `Erro ao cadastrar tutor. ${e.message}`;
  } finally {
    salvando.value = false;
  }
}
</script>

<template>
  <div>
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Cadastro de Tutor</h1>
      <p class="text-body-secondary mb-0">
        Apenas nome e telefone são obrigatórios.
      </p>
    </header>
    <div
      v-if="erro"
      class="alert alert-danger"
      role="alert"
    >
      {{ erro }}
    </div>
    <form
      novalidate
      @submit.prevent="salvarTutor"
    >
      <div class="col-md-6 mb-3">
        <label
          for="nome"
          class="form-label"
          >Nome completo *</label
        >
        <input
          id="nome"
          v-model="nome"
          class="form-control"
          :class="{ 'is-invalid': erros.nome }"
          autocomplete="name"
          required
          :aria-invalid="!!erros.nome"
          aria-describedby="erro-nome"
        />
        <div
          v-if="erros.nome"
          id="erro-nome"
          class="invalid-feedback"
        >
          {{ erros.nome }}
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <label
          for="telefone"
          class="form-label"
          >Telefone *</label
        >
        <input
          id="telefone"
          :value="telefone"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          placeholder="(47) 99999-0001"
          maxlength="15"
          class="form-control"
          :class="{ 'is-invalid': erros.telefone }"
          required
          :aria-invalid="!!erros.telefone"
          aria-describedby="erro-telefone"
          @input="telefone = telefoneFormatado($event.target.value)"
        />
        <div
          v-if="erros.telefone"
          id="erro-telefone"
          class="invalid-feedback"
        >
          {{ erros.telefone }}
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <label
          for="email"
          class="form-label"
          >E-mail (opcional)</label
        >
        <input
          id="email"
          :value="email"
          type="email"
          autocomplete="email"
          class="form-control"
          :class="{ 'is-invalid': erros.email }"
          :aria-invalid="!!erros.email"
          aria-describedby="erro-email"
          @input="email = $event.target.value.replace(/\s/g, '')"
        />
        <div
          v-if="erros.email"
          id="erro-email"
          class="invalid-feedback"
        >
          {{ erros.email }}
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <label
          for="documento"
          class="form-label"
          >CPF/CNPJ (opcional)</label
        >
        <input
          id="documento"
          :value="documento"
          inputmode="numeric"
          maxlength="18"
          class="form-control"
          :class="{ 'is-invalid': erros.documento }"
          :aria-invalid="!!erros.documento"
          aria-describedby="erro-documento"
          @input="documento = documentoFormatado($event.target.value)"
        />
        <div
          v-if="erros.documento"
          id="erro-documento"
          class="invalid-feedback"
        >
          {{ erros.documento }}
        </div>
      </div>
      <button
        type="submit"
        class="btn btn-success me-2"
        :disabled="!valido || salvando"
      >
        {{ salvando ? 'Salvando...' : 'Salvar Tutor' }}
      </button>
      <RouterLink
        to="/tutores"
        class="btn btn-secondary"
        >Cancelar</RouterLink
      >
    </form>
  </div>
</template>
