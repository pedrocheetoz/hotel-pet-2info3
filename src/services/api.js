const API_URL = 'http://localhost:3000';

export async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  if (!resposta.ok)
    throw new Error(
      resposta.status === 404
        ? 'Registro não encontrado.'
        : 'Não foi possível concluir a operação. Tente novamente.',
    );
  return resposta.status === 204 ? null : resposta.json();
}

export function cadastrar(caminho, dados) {
  return requisicao(caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
}
