
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, CreditCard, Globe, Target, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdOnboardingProps {
  onComplete: () => void;
}

const formSchema = z.object({
  businessName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  industry: z.string().min(1, { message: "Selecciona una industria" }),
  country: z.string().min(1, { message: "Selecciona un país" }),
  currency: z.string().min(1, { message: "Selecciona una moneda" }),
  paymentMethod: z.string().min(1, { message: "Selecciona un método de pago" }),
  adGoal: z.string().min(1, { message: "Selecciona un objetivo" }),
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

const AdOnboarding: React.FC<AdOnboardingProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      country: "México",
      currency: "MXN",
      paymentMethod: "",
      adGoal: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una cuenta de anunciante",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting advertiser details:', values);
      
      // Insert data into Supabase - creating a completely separate advertiser profile
      const { data, error } = await supabase
        .from('advertiser_profiles')
        .insert([
          {
            user_id: user.id,
            business_name: values.businessName,
            industry: values.industry,
            country: values.country,
            currency: values.currency,
            payment_method: values.paymentMethod,
            ad_goal: values.adGoal
            // We don't store email/password in the advertiser profile table
            // Those credentials belong to the auth system
          }
        ]);
      
      if (error) {
        console.error('Error saving advertiser profile:', error);
        throw error;
      }
      
      // Call Supabase RPC function to check if user is now an advertiser
      const { data: isAdvertiser, error: rpcError } = await supabase.rpc(
        'is_user_advertiser',
        { user_id_param: user.id }
      );
      
      if (rpcError) {
        console.error('Error checking advertiser status:', rpcError);
      } else {
        console.log('User is now an advertiser:', isAdvertiser);
      }
      
      // Store advertiser credentials securely - in a real app this would use a separate auth system
      // For now, we log the success but would implement proper credential storage in production
      console.log('Advertiser credentials (would be stored separately):', {
        email: values.email,
        password: '********' // Never log actual passwords
      });
      
      toast({
        title: "Perfil creado",
        description: "Tu perfil de anunciante ha sido creado correctamente",
      });
      
      // Call the onComplete callback to navigate to the dashboard
      onComplete();
    } catch (error) {
      console.error('Error submitting advertiser details:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar los detalles",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    // Get fields to validate based on current step
    const fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    if (currentStep === 1) {
      fieldsToValidate.push('businessName', 'industry');
    } else if (currentStep === 2) {
      fieldsToValidate.push('country', 'currency', 'paymentMethod');
    } else if (currentStep === 3) {
      fieldsToValidate.push('adGoal');
    } else if (currentStep === 4) {
      fieldsToValidate.push('email', 'password');
    }

    // Validate only the fields for the current step
    const isStepValid = await form.trigger(fieldsToValidate);
    console.log(`Step ${currentStep} validation:`, isStepValid, fieldsToValidate);

    if (isStepValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit the form when on the last step and validation passes
        form.handleSubmit(onSubmit)();
      }
    } else {
      console.log('Validation failed for step', currentStep);
      // Show which fields failed validation
      const errors = form.formState.errors;
      console.log('Form errors:', errors);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-6 flex items-center">
              <Building2 className="h-8 w-8 text-fusion-primary mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Información del negocio</h3>
                <p className="text-gray-500">Cuéntanos sobre tu empresa y su sector</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Nombre del negocio</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de tu empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una industria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="retail">Comercio minorista</SelectItem>
                      <SelectItem value="tech">Tecnología</SelectItem>
                      <SelectItem value="food">Alimentación y Restaurantes</SelectItem>
                      <SelectItem value="health">Salud y Bienestar</SelectItem>
                      <SelectItem value="fashion">Moda y Belleza</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="finance">Finanzas</SelectItem>
                      <SelectItem value="entertainment">Entretenimiento</SelectItem>
                      <SelectItem value="travel">Viajes y Turismo</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 2:
        return (
          <>
            <div className="mb-6 flex items-center">
              <Globe className="h-8 w-8 text-fusion-primary mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Configuración de la cuenta</h3>
                <p className="text-gray-500">Configura tu región y preferencias de moneda</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>País</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="México">México</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Colombia">Colombia</SelectItem>
                      <SelectItem value="Chile">Chile</SelectItem>
                      <SelectItem value="Perú">Perú</SelectItem>
                      <SelectItem value="España">España</SelectItem>
                      <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Moneda</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                      <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                      <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                      <SelectItem value="PEN">Sol Peruano (PEN)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pago</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un método de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="credit_card">Tarjeta de crédito</SelectItem>
                      <SelectItem value="debit_card">Tarjeta de débito</SelectItem>
                      <SelectItem value="bank_transfer">Transferencia bancaria</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 3:
        return (
          <>
            <div className="mb-6 flex items-center">
              <Target className="h-8 w-8 text-fusion-primary mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Objetivos publicitarios</h3>
                <p className="text-gray-500">¿Qué deseas lograr con tus anuncios?</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="adGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo principal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un objetivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="awareness">Reconocimiento de marca</SelectItem>
                      <SelectItem value="engagement">Interacción con la audiencia</SelectItem>
                      <SelectItem value="traffic">Tráfico al sitio web</SelectItem>
                      <SelectItem value="leads">Generación de leads</SelectItem>
                      <SelectItem value="conversions">Conversiones</SelectItem>
                      <SelectItem value="sales">Ventas directas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Este será el objetivo principal para tus campañas. Podrás crear campañas con diferentes objetivos más adelante.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 4:
        return (
          <>
            <div className="mb-6 flex items-center">
              <Mail className="h-8 w-8 text-fusion-primary mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Credenciales de la cuenta</h3>
                <p className="text-gray-500">Información de acceso para tu cuenta de anunciante</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Correo electrónico para anuncios</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="ads@tuempresa.com" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este correo será utilizado para notificaciones relacionadas con tus anuncios.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña para anuncios</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Contraseña" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Crea una contraseña segura de al menos 8 caracteres para acceder a tu cuenta de anunciante.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuración de cuenta de anunciante</CardTitle>
            <CardDescription>
              Complete los siguientes pasos para configurar su cuenta de anunciante.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between mb-8 px-4 relative">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center z-10">
                  <div 
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium mb-2
                      ${currentStep === step 
                        ? 'bg-fusion-primary text-white' 
                        : currentStep > step 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'}`}
                  >
                    {step}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step === 1 && 'Negocio'}
                    {step === 2 && 'Cuenta'}
                    {step === 3 && 'Objetivos'}
                    {step === 4 && 'Acceso'}
                  </div>
                </div>
              ))}
              
              {/* Connecting lines */}
              <div className="absolute h-0.5 bg-gray-200 w-2/3 left-1/6 top-5 z-0"></div>
            </div>

            {renderStepContent()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1 || isSubmitting}
            >
              Anterior
            </Button>
            
            <Button 
              type="button" 
              onClick={handleContinue} 
              disabled={isSubmitting}
              className={currentStep === 4 ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              {isSubmitting ? 'Guardando...' : currentStep < 4 ? 'Continuar' : 'Finalizar'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AdOnboarding;
