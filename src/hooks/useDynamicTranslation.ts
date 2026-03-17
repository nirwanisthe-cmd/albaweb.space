import { useState, useEffect } from 'react';
import { translateText } from '../utils/translator';
import { useLanguage } from '../contexts/LanguageContext';

export const useDynamicTranslation = (text: string) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      if (language === 'en') {
        setTranslatedText(text);
        return;
      }

      setLoading(true);
      try {
        const result = await translateText(text, language);
        setTranslatedText(result);
      } catch (error) {
        console.error("Hook translation error:", error);
        setTranslatedText(text);
      } finally {
        setLoading(false);
      }
    };

    performTranslation();
  }, [text, language]);

  return { translatedText, loading };
};
