import { en } from '$lib/i18n/en';
import type { TranslationKey } from '$lib/i18n/en';

type Locale = 'en';

const translations: Record<Locale, TranslationKey> = {
	en
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
	currentLocale = locale;
}

export function getLocale(): Locale {
	return currentLocale;
}

type NestedKeyOf<T> = T extends object
	? {
			[K in keyof T]: K extends string ? (T[K] extends object ? `${K}` | `${K}.${NestedKeyOf<T[K]>}` : `${K}`) : never;
		}[keyof T]
	: never;

type TranslationPath = NestedKeyOf<TranslationKey>;

export function t(key: TranslationPath): string {
	const keys = key.split('.');
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let value: any = translations[currentLocale];

	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = value[k];
		} else {
			return key; // Return key if translation not found
		}
	}

	return typeof value === 'string' ? value : key;
}

export { en };
