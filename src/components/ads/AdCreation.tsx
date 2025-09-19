
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Add this import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  ImagePlus, 
  Video, 
  BarChart3, 
  Target, 
  Globe, 
  Coins, 
  PenTool,
  ChevronDown,
  UploadCloud
} from 'lucide-react';

const AdCreation = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [adType, setAdType] = useState<string>("");
  const [adName, setAdName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [callToAction, setCallToAction] = useState<string>("learn_more");
  const [budget, setBudget] = useState<number>(20);
  const [duration, setDuration] = useState<string>("7_days");
  const [targetingAge, setTargetingAge] = useState<[number, number]>([18, 65]);
  const [targetGender, setTargetGender] = useState<string>("all");
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("image");
  const [preview, setPreview] = useState<boolean>(false);
  const [bidStrategy, setBidStrategy] = useState<string>("automatic");
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep === 1 && !adType) {
      toast({
        title: "Selecciona un tipo de anuncio",
        description: "Debes seleccionar un tipo de anuncio para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2) {
      if (!adName || !headline || !description) {
        toast({
          title: "Información incompleta",
          description: "Completa todos los campos requeridos para continuar.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 3 && !uploadedMedia) {
      toast({
        title: "Contenido multimedia requerido",
        description: "Sube una imagen o video para tu anuncio.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit ad for review
      toast({
        title: "¡Anuncio creado!",
        description: "Tu anuncio ha sido enviado para revisión y estará activo pronto.",
      });
      
      // Reset form
      setCurrentStep(1);
      setAdType("");
      setAdName("");
      setHeadline("");
      setDescription("");
      setCallToAction("learn_more");
      setBudget(20);
      setDuration("7_days");
      setTargetingAge([18, 65]);
      setTargetGender("all");
      setUploadedMedia(null);
      setMediaType("image");
      setPreview(false);
      setBidStrategy("automatic");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, this would upload to Supabase Storage
      // For now, create a local URL for preview
      const url = URL.createObjectURL(file);
      setUploadedMedia(url);
      
      toast({
        title: "Archivo subido",
        description: `${file.name} ha sido cargado correctamente.`,
      });
    }
  };

  const handleAdTypeSelect = (type: string) => {
    setAdType(type);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Selecciona el tipo de anuncio</h2>
            <p className="text-muted-foreground">Elige el formato que mejor se adapte a tus objetivos de marketing.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer border-2 hover:border-fusion-primary hover:shadow transition-all ${adType === 'feed' ? 'border-fusion-primary bg-fusion-primary/5' : ''}`}
                onClick={() => handleAdTypeSelect('feed')}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <ImagePlus className="h-12 w-12 mb-2 text-fusion-primary" />
                    <h3 className="font-bold">Anuncio en el Feed</h3>
                    <p className="text-sm text-muted-foreground">Anuncios nativos que aparecen en el feed principal de los usuarios.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer border-2 hover:border-fusion-primary hover:shadow transition-all ${adType === 'story' ? 'border-fusion-primary bg-fusion-primary/5' : ''}`}
                onClick={() => handleAdTypeSelect('story')}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Video className="h-12 w-12 mb-2 text-fusion-primary" />
                    <h3 className="font-bold">Anuncio en Historias</h3>
                    <p className="text-sm text-muted-foreground">Anuncios de pantalla completa que aparecen entre las historias de los usuarios.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer border-2 hover:border-fusion-primary hover:shadow transition-all ${adType === 'poll' ? 'border-fusion-primary bg-fusion-primary/5' : ''}`}
                onClick={() => handleAdTypeSelect('poll')}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <BarChart3 className="h-12 w-12 mb-2 text-fusion-primary" />
                    <h3 className="font-bold">Anuncio con Encuesta</h3>
                    <p className="text-sm text-muted-foreground">Anuncios interactivos que permiten a los usuarios responder una encuesta breve.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer border-2 hover:border-fusion-primary hover:shadow transition-all ${adType === 'shop' ? 'border-fusion-primary bg-fusion-primary/5' : ''}`}
                onClick={() => handleAdTypeSelect('shop')}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Coins className="h-12 w-12 mb-2 text-fusion-primary" />
                    <h3 className="font-bold">Anuncio de Tienda</h3>
                    <p className="text-sm text-muted-foreground">Anuncios de compra directa donde los usuarios pueden adquirir productos sin salir de la app.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Detalles del anuncio</h2>
            <p className="text-muted-foreground">Configura el contenido de tu anuncio para atraer a tu audiencia.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad-name">Nombre de la campaña *</Label>
                <Input 
                  id="ad-name" 
                  placeholder="Nombre para identificar tu campaña" 
                  value={adName}
                  onChange={(e) => setAdName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="headline">Titular *</Label>
                <Input 
                  id="headline" 
                  placeholder="Título principal del anuncio" 
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Máximo 40 caracteres</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe brevemente tu producto o servicio" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">Máximo 125 caracteres</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="call-to-action">Llamada a la acción</Label>
                <Select value={callToAction} onValueChange={setCallToAction}>
                  <SelectTrigger id="call-to-action">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learn_more">Más información</SelectItem>
                    <SelectItem value="shop_now">Comprar ahora</SelectItem>
                    <SelectItem value="sign_up">Registrarse</SelectItem>
                    <SelectItem value="download">Descargar</SelectItem>
                    <SelectItem value="contact_us">Contáctanos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Contenido multimedia</h2>
            <p className="text-muted-foreground">Sube imágenes o videos para tu anuncio. El contenido visual de alta calidad aumenta la efectividad.</p>
            
            <div className="space-y-4">
              <Tabs defaultValue="image" onValueChange={(value) => setMediaType(value)}>
                <TabsList className="grid grid-cols-2 w-[300px]">
                  <TabsTrigger value="image">Imagen</TabsTrigger>
                  <TabsTrigger value="video">Video</TabsTrigger>
                </TabsList>
                
                <TabsContent value="image" className="space-y-4 mt-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Arrastra y suelta o haz clic para subir</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP hasta 5MB</p>
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="image-upload"
                        onChange={handleMediaUpload}
                      />
                      <Label 
                        htmlFor="image-upload" 
                        className="mt-4 px-4 py-2 bg-fusion-primary text-white rounded-md cursor-pointer hover:bg-fusion-primary/90 transition-colors"
                      >
                        Seleccionar archivo
                      </Label>
                    </div>
                  </div>
                  
                  {uploadedMedia && mediaType === 'image' && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-full max-w-md">
                        <img 
                          src={uploadedMedia} 
                          alt="Ad preview" 
                          className="rounded-lg w-full object-cover max-h-[300px]" 
                        />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="absolute top-2 right-2"
                          onClick={() => setUploadedMedia(null)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="video" className="space-y-4 mt-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Arrastra y suelta o haz clic para subir</p>
                      <p className="text-xs text-muted-foreground mt-1">MP4, WebM hasta 30MB, máx. 60 segundos</p>
                      
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        id="video-upload"
                        onChange={handleMediaUpload}
                      />
                      <Label 
                        htmlFor="video-upload" 
                        className="mt-4 px-4 py-2 bg-fusion-primary text-white rounded-md cursor-pointer hover:bg-fusion-primary/90 transition-colors"
                      >
                        Seleccionar archivo
                      </Label>
                    </div>
                  </div>
                  
                  {uploadedMedia && mediaType === 'video' && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-full max-w-md">
                        <video 
                          src={uploadedMedia} 
                          controls
                          className="rounded-lg w-full object-cover max-h-[300px]" 
                        />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="absolute top-2 right-2"
                          onClick={() => setUploadedMedia(null)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Audiencia y Presupuesto</h2>
            <p className="text-muted-foreground">Define a quién quieres llegar y cuánto quieres invertir.</p>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Segmentación demográfica</h3>
                
                <div className="space-y-2">
                  <Label>Edad</Label>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>{targetingAge[0]}</span>
                    <span>{targetingAge[1]}</span>
                  </div>
                  <Slider
                    value={targetingAge}
                    min={13}
                    max={65}
                    step={1}
                    onValueChange={(value) => setTargetingAge(value as [number, number])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Género</Label>
                  <RadioGroup value={targetGender} onValueChange={setTargetGender}>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">Todos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Hombres</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Mujeres</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Presupuesto y duración</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="budget">Presupuesto diario</Label>
                    <span className="text-sm font-medium">${budget}</span>
                  </div>
                  <Slider
                    id="budget"
                    value={[budget]}
                    min={5}
                    max={1000}
                    step={5}
                    onValueChange={(value) => setBudget(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">Mínimo $5 por día</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración de la campaña</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Selecciona la duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7_days">7 días</SelectItem>
                      <SelectItem value="14_days">14 días</SelectItem>
                      <SelectItem value="30_days">30 días</SelectItem>
                      <SelectItem value="continuous">Continuo (hasta pausar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bid-strategy">Estrategia de puja</Label>
                  <Select value={bidStrategy} onValueChange={setBidStrategy}>
                    <SelectTrigger id="bid-strategy">
                      <SelectValue placeholder="Selecciona estrategia de puja" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automática (recomendado)</SelectItem>
                      <SelectItem value="cpc">Costo por clic (CPC)</SelectItem>
                      <SelectItem value="cpm">Costo por mil impresiones (CPM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Coins className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">Estimación de costos</p>
                    <p className="text-sm text-blue-600">
                      Total estimado: ${budget * (duration === '7_days' ? 7 : duration === '14_days' ? 14 : duration === '30_days' ? 30 : 30)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-none shadow-none bg-white">
        <CardHeader className="pb-4">
          <CardTitle>Crear nuevo anuncio</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Paso {currentStep} de {totalSteps}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} />
          </div>
          
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Atrás
            </Button>
            
            <Button onClick={handleNext}>
              {currentStep < totalSteps ? (
                <>
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : 'Crear anuncio'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdCreation;
