export function formatCurrency(value: number, currencySymbol: string = 'Rp'): string {
    const dec = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Format angka biasa
        minimumFractionDigits: 2, // Minimal 2 digit desimal
        maximumFractionDigits: 2, // Maksimal 2 digit desimal
    }).format(value);

    return `${currencySymbol} ${dec}`
}