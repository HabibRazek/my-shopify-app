import { countries, ICountry } from 'countries-list';
import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';
import { Country } from '@/types/shopify';

// Helper function to generate country flag emoji
const getCountryFlag = (countryCode: string): string => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

export const getCountries = (): Country[] => {
    return Object.entries(countries).map(([code, data]: [string, ICountry]) => ({
        code,
        name: data.name,
        phone: String(data.phone[0] || ''),
        // Use flag emoji generator since ICountry doesn't have emoji property
        emoji: getCountryFlag(code)
    }));
};

export const formatPhoneNumber = (phone: string, countryCode: string) => {
    try {
        const phoneNumber = parsePhoneNumber(phone, countryCode as CountryCode);
        return phoneNumber?.format('INTERNATIONAL') || phone;
    } catch {
        return phone;
    }
};

export const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
    try {
        return isValidPhoneNumber(phone, countryCode as CountryCode);
    } catch {
        return false;
    }
};