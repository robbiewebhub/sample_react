
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    // Auth page
    welcome: "Welcome",
    signInOrCreate: "Sign in or create an account to continue",
    signIn: "Sign In",
    createAccount: "Create Account",
    email: "Enter your email",
    password: "Enter your password",
    fullName: "Enter your full name",
    username: "Choose a username",
    usernameAvailable: "Username is available",
    usernameTaken: "Username is already taken",
    signingIn: "Signing in...",
    creatingAccount: "Creating account...",
    // Footer
    adManagement: "Ad Management",
    about: "About",
    privacy: "Privacy",
    language: "Language",
    // Error messages
    fillAllFields: "Please fill in all fields",
    usernameLength: "Username must be at least 3 characters long",
    // App name
    appName: "Vira",
    appTagline: "Connect and share with the world",
    // About page
    aboutTitle: "About Us",
    aboutOurMission: "Our Mission",
    aboutMissionText: "Our mission is to connect people from around the world, allowing them to share experiences, ideas, and moments that matter. We're dedicated to creating a platform that's safe, inclusive, and empowering for all users.",
    aboutOurStory: "Our Story",
    aboutStoryText: "Founded in 2023, our platform began as a small project with big ambitions. Through dedication, innovation, and a focus on user needs, we've grown into a thriving community where millions of people connect daily.",
    aboutOurTeam: "Our Team",
    aboutTeamText: "Our diverse team of engineers, designers, and community managers work collaboratively to create and maintain a platform that reflects our values of innovation, inclusivity, and user privacy.",
    aboutContactUs: "Contact Us",
    aboutContactText: "We'd love to hear from you! For inquiries, feedback, or support, please email us at support@vira.com or use our contact form.",
    // Privacy page
    privacyTitle: "Privacy Policy",
    privacyIntro: "Introduction",
    privacyIntroText: "At Vira, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform.",
    privacyCollection: "Information We Collect",
    privacyCollectionText: "We collect information you provide when creating an account, including your email, name, and username. We also collect usage data to improve our service and provide a better user experience.",
    privacyUsage: "How We Use Your Information",
    privacyUsageText: "We use your information to provide our services, personalize your experience, and communicate with you. We also use data to improve our platform and ensure a safe environment for all users.",
    privacyCookies: "Cookies and Tracking",
    privacyCookiesText: "We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze how our platform is used. You can manage cookie preferences through your browser settings.",
    privacyContact: "Contact Us About Privacy",
    privacyContactText: "If you have questions about our privacy practices or wish to exercise your data rights, please contact us at privacy@vira.com."
  },
  es: {
    // Auth page
    welcome: "Bienvenido",
    signInOrCreate: "Inicia sesión o crea una cuenta para continuar",
    signIn: "Iniciar Sesión",
    createAccount: "Crear Cuenta",
    email: "Ingresa tu correo electrónico",
    password: "Ingresa tu contraseña",
    fullName: "Ingresa tu nombre completo",
    username: "Elige un nombre de usuario",
    usernameAvailable: "Nombre de usuario disponible",
    usernameTaken: "Nombre de usuario ya está en uso",
    signingIn: "Iniciando sesión...",
    creatingAccount: "Creando cuenta...",
    // Footer
    adManagement: "Gestión de Anuncios",
    about: "Acerca de",
    privacy: "Privacidad",
    language: "Idioma",
    // Error messages
    fillAllFields: "Por favor completa todos los campos",
    usernameLength: "El nombre de usuario debe tener al menos 3 caracteres",
    // App name
    appName: "Vira",
    appTagline: "Conéctate y comparte con el mundo",
    // About page
    aboutTitle: "Sobre Nosotros",
    aboutOurMission: "Nuestra Misión",
    aboutMissionText: "Nuestra misión es conectar a personas de todo el mundo, permitiéndoles compartir experiencias, ideas y momentos importantes. Estamos dedicados a crear una plataforma segura, inclusiva y empoderadora para todos los usuarios.",
    aboutOurStory: "Nuestra Historia",
    aboutStoryText: "Fundada en 2023, nuestra plataforma comenzó como un pequeño proyecto con grandes ambiciones. A través de la dedicación, la innovación y un enfoque en las necesidades del usuario, nos hemos convertido en una comunidad próspera donde millones de personas se conectan diariamente.",
    aboutOurTeam: "Nuestro Equipo",
    aboutTeamText: "Nuestro diverso equipo de ingenieros, diseñadores y gestores comunitarios trabaja de forma colaborativa para crear y mantener una plataforma que refleje nuestros valores de innovación, inclusión y privacidad del usuario.",
    aboutContactUs: "Contáctanos",
    aboutContactText: "¡Nos encantaría saber de ti! Para consultas, comentarios o soporte, envíanos un correo electrónico a soporte@vira.com o utiliza nuestro formulario de contacto.",
    // Privacy page
    privacyTitle: "Política de Privacidad",
    privacyIntro: "Introducción",
    privacyIntroText: "En Vira, tomamos tu privacidad en serio. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal cuando utilizas nuestra plataforma.",
    privacyCollection: "Información que Recopilamos",
    privacyCollectionText: "Recopilamos la información que proporcionas al crear una cuenta, incluyendo tu correo electrónico, nombre y nombre de usuario. También recopilamos datos de uso para mejorar nuestro servicio y proporcionar una mejor experiencia de usuario.",
    privacyUsage: "Cómo Utilizamos tu Información",
    privacyUsageText: "Utilizamos tu información para proporcionar nuestros servicios, personalizar tu experiencia y comunicarnos contigo. También utilizamos datos para mejorar nuestra plataforma y garantizar un entorno seguro para todos los usuarios.",
    privacyCookies: "Cookies y Seguimiento",
    privacyCookiesText: "Utilizamos cookies y tecnologías similares para mejorar tu experiencia, recordar tus preferencias y analizar cómo se utiliza nuestra plataforma. Puedes gestionar las preferencias de cookies a través de la configuración de tu navegador.",
    privacyContact: "Contáctanos sobre Privacidad",
    privacyContactText: "Si tienes preguntas sobre nuestras prácticas de privacidad o deseas ejercer tus derechos de datos, contáctanos en privacidad@vira.com."
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage, default to browser language, or fallback to 'en'
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'es'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language);
    // Update html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
