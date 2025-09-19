
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AuthFooter: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <footer className="w-full max-w-md mx-auto mt-6 text-xs text-gray-500">
      <div className="flex flex-wrap justify-between items-center py-3 px-3 border-t border-gray-200">
        <div className="flex space-x-4">
          <Link 
            to="/advertise" 
            className="hover:text-fusion-primary transition-colors"
            aria-label={t('advertiseWithUs')}
          >
            {t('advertiseWithUs')}
          </Link>
          <Link 
            to="/about" 
            className="hover:text-fusion-primary transition-colors"
            aria-label={t('about')}
          >
            {t('about')}
          </Link>
          <Link 
            to="/privacy" 
            className="hover:text-fusion-primary transition-colors"
            aria-label={t('privacy')}
          >
            {t('privacyPolicy')}
          </Link>
          <Link 
            to="/terms" 
            className="hover:text-fusion-primary transition-colors"
            aria-label={t('termsOfService')}
          >
            {t('termsOfService')}
          </Link>
        </div>
        
        <div className="flex items-center mt-2 sm:mt-0">
          <Globe className="h-3 w-3 mr-1" />
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as 'en' | 'es')}
          >
            <SelectTrigger className="h-7 w-24 text-xs border-none bg-transparent hover:bg-gray-100 focus:ring-0">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;
