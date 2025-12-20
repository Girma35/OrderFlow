export interface StoreBrand {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    textOnPrimary: string;
    accentGradient: string;
    glow: string;
}

export const STORE_BRANDS: Record<string, StoreBrand> = {
    'X': {
        name: 'Motia Prime',
        primaryColor: '#2563eb',
        secondaryColor: '#dbeafe',
        textOnPrimary: '#0f172a',
        accentGradient: 'linear-gradient(120deg, #2563eb, #7c3aed)',
        glow: 'rgba(37, 99, 235, 0.25)'
    },
    'Y': {
        name: 'Nexus Shop',
        primaryColor: '#059669',
        secondaryColor: '#d1fae5',
        textOnPrimary: '#064e3b',
        accentGradient: 'linear-gradient(120deg, #059669, #0ea5e9)',
        glow: 'rgba(16, 185, 129, 0.25)'
    },
    'Z': {
        name: 'Aura Luxe',
        primaryColor: '#e11d48',
        secondaryColor: '#ffe4e6',
        textOnPrimary: '#831843',
        accentGradient: 'linear-gradient(120deg, #e11d48, #f97316)',
        glow: 'rgba(225, 29, 72, 0.25)'
    }
};

export const getBrand = (storeId: string = 'X'): StoreBrand => {
    return STORE_BRANDS[storeId] || STORE_BRANDS['X'];
};
