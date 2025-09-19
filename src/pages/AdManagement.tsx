
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdDashboard from '@/components/ads/AdDashboard';
import AdCreation from '@/components/ads/AdCreation';
import AdAnalytics from '@/components/ads/AdAnalytics';
import AdBudgeting from '@/components/ads/AdBudgeting';
import AdOnboarding from '@/components/ads/AdOnboarding';
import MarketingProfile from '@/components/ads/MarketingProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

const AdManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isAdvertiser, setIsAdvertiser] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Check URL for tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setCurrentTab(tabParam);
    }
  }, [searchParams]);
  
  // Check if user has advertiser account from Supabase
  useEffect(() => {
    const checkAdvertiserStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Use the is_user_advertiser function to check if user has an advertiser profile
        const { data, error } = await supabase.rpc(
          'is_user_advertiser', 
          { user_id_param: user.id }
        );
        
        if (error) {
          console.error('Error calling is_user_advertiser function:', error);
          throw error;
        }
        
        console.log('is_user_advertiser result:', data);
        setIsAdvertiser(!!data);
        setLoading(false);
      } catch (error) {
        console.error('Error checking advertiser status:', error);
        toast({
          title: "Error",
          description: "No se pudo verificar el estado de la cuenta de anunciante.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    checkAdvertiserStatus();
  }, [user, toast]);

  const handleCreateAdvertiserAccount = () => {
    setCurrentTab('onboarding');
  };

  const handleOnboardingComplete = async () => {
    setIsAdvertiser(true);
    setShowProfile(true);
    setCurrentTab('dashboard'); // Direct to the dashboard tab after completion
    toast({
      title: "¡Cuenta creada!",
      description: "Tu cuenta de anunciante ha sido configurada correctamente.",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acceso denegado</AlertTitle>
            <AlertDescription>
              Debes iniciar sesión para acceder a la plataforma de anuncios.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.href = '/auth'}>
            Iniciar sesión
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Administrador de anuncios</h1>
        
        {!isAdvertiser && currentTab !== 'onboarding' ? (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Bienvenido al Centro de Anuncios de Fusion</h2>
            <p className="text-gray-600 mb-4">
              Crea y gestiona campañas publicitarias para llegar a tu audiencia ideal. Nuestro sistema de anuncios ofrece:
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-600 space-y-2">
              <li>Segmentación precisa para llegar a usuarios más relevantes que en otras plataformas</li>
              <li>Costos más bajos y mayor retorno de inversión que plataformas tradicionales</li>
              <li>Formatos de anuncios nativos que generan más engagement</li>
              <li>Análisis detallados en tiempo real para optimizar tus campañas</li>
            </ul>
            <Button onClick={handleCreateAdvertiserAccount}>
              Crear cuenta de anunciante
            </Button>
          </div>
        ) : (
          <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="dashboard">Panel</TabsTrigger>
              <TabsTrigger value="creation">Crear anuncio</TabsTrigger>
              <TabsTrigger value="analytics">Análisis</TabsTrigger>
              <TabsTrigger value="budgeting">Presupuesto</TabsTrigger>
              <TabsTrigger value="onboarding">Configuración</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              {showProfile ? (
                <MarketingProfile />
              ) : (
                <AdDashboard />
              )}
            </TabsContent>
            
            <TabsContent value="creation">
              <AdCreation />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AdAnalytics />
            </TabsContent>
            
            <TabsContent value="budgeting">
              <AdBudgeting />
            </TabsContent>
            
            <TabsContent value="onboarding">
              {isAdvertiser ? (
                <MarketingProfile />
              ) : (
                <AdOnboarding onComplete={handleOnboardingComplete} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default AdManagement;
