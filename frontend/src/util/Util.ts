export const formatCurrencyES = (value: number) => {
    return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        useGrouping: true
    });
}
