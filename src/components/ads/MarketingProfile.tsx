
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Building2, Globe, Target, Mail, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdvertiserProfile {
  id: string;
  business_name: string;
  industry: string;
  country: string;
  currency: string;
  payment_method: string;
  ad_goal: string;
  created_at: string;
}

const MarketingProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdvertiserProfile | null>(null);

  useEffect(() => {
    const fetchAdvertiserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Changed from .single() to get the most recent profile
        const { data, error } = await supabase
          .from('advertiser_profiles')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error fetching advertiser profile:', error);
          throw error;
        }
        
        // Check if we have any profiles
        if (data && data.length > 0) {
          setProfile(data[0]);
        } else {
          console.log('No advertiser profile found for user');
          setProfile(null);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil de anunciante.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertiserProfile();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Perfil no encontrado</CardTitle>
          <CardDescription>
            No se encontró información de perfil de anunciante para este usuario.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Helper function to get industry label from value
  const getIndustryLabel = (value: string) => {
    const industries: Record<string, string> = {
      retail: 'Comercio minorista',
      tech: 'Tecnología',
      food: 'Alimentación y Restaurantes',
      health: 'Salud y Bienestar',
      fashion: 'Moda y Belleza',
      education: 'Educación',
      finance: 'Finanzas',
      entertainment: 'Entretenimiento',
      travel: 'Viajes y Turismo',
      other: 'Otro',
    };
    return industries[value] || value;
  };

  // Helper function to get payment method label from value
  const getPaymentMethodLabel = (value: string) => {
    const methods: Record<string, string> = {
      credit_card: 'Tarjeta de crédito',
      debit_card: 'Tarjeta de débito',
      bank_transfer: 'Transferencia bancaria',
      paypal: 'PayPal',
    };
    return methods[value] || value;
  };

  // Helper function to get ad goal label from value
  const getAdGoalLabel = (value: string) => {
    const goals: Record<string, string> = {
      awareness: 'Reconocimiento de marca',
      engagement: 'Interacción con la audiencia',
      traffic: 'Tráfico al sitio web',
      leads: 'Generación de leads',
      conversions: 'Conversiones',
      sales: 'Ventas directas',
    };
    return goals[value] || value;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Anunciante</CardTitle>
          <CardDescription>
            Información completa de tu cuenta de anunciante
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Building2 className="h-5 w-5 mr-2 text-fusion-primary" />
              <h3 className="text-lg font-medium">Información del Negocio</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">Nombre del negocio</p>
                <p className="font-medium">{profile.business_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industria</p>
                <p className="font-medium">{getIndustryLabel(profile.industry)}</p>
              </div>
            </div>
          </div>
          
          {/* Account Configuration */}
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Globe className="h-5 w-5 mr-2 text-fusion-primary" />
              <h3 className="text-lg font-medium">Configuración de la Cuenta</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">País</p>
                <p className="font-medium">{profile.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Moneda</p>
                <p className="font-medium">{profile.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Método de pago</p>
                <p className="font-medium">{getPaymentMethodLabel(profile.payment_method)}</p>
              </div>
            </div>
          </div>
          
          {/* Campaign Goals */}
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 mr-2 text-fusion-primary" />
              <h3 className="text-lg font-medium">Objetivos de Campaña</h3>
            </div>
            <div className="pl-7">
              <p className="text-sm text-gray-500">Objetivo principal</p>
              <p className="font-medium">{getAdGoalLabel(profile.ad_goal)}</p>
            </div>
          </div>
          
          {/* Account Created */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Cuenta creada el {new Date(profile.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/ad-management?tab=creation"}
        >
          Crear mi primer anuncio
        </Button>
      </div>
    </div>
  );
};

export default MarketingProfile;
