export function digitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

export function telefoneFormatado(valor) {
  const numero = digitos(valor).slice(0, 11);
  if (numero.length <= 2) return numero;
  const tamanho = numero.length > 10 ? 5 : 4;
  const local = numero.slice(2);
  return `(${numero.slice(0, 2)}) ${local.slice(0, tamanho)}${local.length > tamanho ? `-${local.slice(tamanho)}` : ''}`;
}

export function documentoFormatado(valor) {
  const numero = digitos(valor).slice(0, 14);
  if (numero.length <= 11)
    return numero
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  return numero
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}
