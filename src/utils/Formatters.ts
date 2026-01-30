export function formatCpf(cpf?: string | null) {
  if (!cpf) return '-';

  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCnpj(cnpj?: string | null) {
  if (!cnpj) return '-';

  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return cnpj;

  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatPhone(phone?: string | null) {
  if (!phone) return '-';

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;

  return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatMoney(value: number, locale: string, currency: string) {
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
  });
}

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDate(dateStr: string | null, locale: string) {
  if (!dateStr) return '-';

  const date = new Date(dateStr);

  return date.toLocaleDateString(locale, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return bytes + ' B';
  }

  if (bytes < 1024 ** 2) {
    return (bytes / 1024).toFixed(1) + ' KB';
  }

  return (bytes / 1024 ** 2).toFixed(2) + ' MB';
}
