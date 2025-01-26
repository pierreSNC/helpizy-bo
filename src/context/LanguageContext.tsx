import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type LanguageContextType = {
    language: number;
    switchLanguage: (newLanguage: number) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const savedLanguage = localStorage.getItem('language');
    const initialLanguage = savedLanguage ? parseInt(savedLanguage) : 1; // Par défaut, FR (id_lang = 1)

    const [language, setLanguage] = useState<number>(initialLanguage);

    const switchLanguage = (newLanguage: number) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage.toString());
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(parseInt(savedLanguage));
        }
    }, []);

    return (
        <LanguageContext.Provider value={{ language, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
