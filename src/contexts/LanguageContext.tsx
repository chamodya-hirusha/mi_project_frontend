"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { getInitialLocale, saveLocalePreference, type SupportedLocale } from "@/lib/i18n";

import enData from "@/translations/en.json";
import siData from "@/translations/si.json";
import taData from "@/translations/ta.json";

export type LanguageCode = SupportedLocale;

export interface LanguageOption {
    code: LanguageCode;
    name: string;
    nativeName: string;
    flag: string;
}

export const LANGUAGES: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇱🇰" },
];

/**
 * Type inferred from the JSON structure
 * This ensures TypeScript knows all keys available in our translation files
 */
export type Translations = typeof enData;

const translationMap: Record<LanguageCode, Translations> = {
    en: enData as Translations,
    si: siData as Translations,
    ta: taData as Translations,
};

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: Translations;
    currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => {},
    t: enData as Translations,
    currentLanguageOption: LANGUAGES[0],
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // getInitialLocale() checks: 1) localStorage pref → 2) browser locale → 3) "en"
    const [language, setLanguageState] = useState<LanguageCode>(getInitialLocale);

    const setLanguage = useCallback((lang: LanguageCode) => {
        setLanguageState(lang);
        saveLocalePreference(lang);
    }, []);

    const t = translationMap[language];
    const currentLanguageOption = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageOption }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
