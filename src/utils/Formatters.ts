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

export function formatMoney(value: number) {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	});
}
