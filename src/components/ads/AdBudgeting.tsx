
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  DollarSign, 
  PieChart, 
  BarChart4, 
  TrendingUp,
  AlertCircle,
  BadgeCheck,
  Wallet,
  Plus,
  Settings
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

// Mock data for budget allocation
const budgetAllocationData = [
  { name: 'Anuncios en Feed', value: 40 },
  { name: 'Anuncios en Historia', value: 30 },
  { name: 'Anuncios con Encuesta', value: 15 },
  { name: 'Anuncios de Tienda', value: 15 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdBudgeting = () => {
  const [totalBudget, setTotalBudget] = useState<number>(1000);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [autoRenewal, setAutoRenewal] = useState<boolean>(true);
  
  // Budget already spent
  const budgetSpent = 385;
  const budgetRemaining = totalBudget - budgetSpent;
  const budgetPercentage = (budgetSpent / totalBudget) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Gestión de Presupuesto</h2>
        
        <div className="flex gap-3">
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Todas las campañas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las campañas</SelectItem>
              <SelectItem value="campaign1">Campaña de verano</SelectItem>
              <SelectItem value="campaign2">Lanzamiento de producto</SelectItem>
              <SelectItem value="campaign3">Promoción especial</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Button>
        </div>
      </div>
      
      {/* Budget Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Presupuesto Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">${totalBudget.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Presupuesto mensual</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-blue-600" />
              Presupuesto Utilizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">${budgetSpent.toLocaleString()}</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{Math.round(budgetPercentage)}%</span>
              </div>
              <Progress value={budgetPercentage} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Presupuesto Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">${budgetRemaining.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Disponible para este mes</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Budget Allocation and Budget Adjustment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución del Presupuesto</CardTitle>
            <CardDescription>
              Cómo se distribuye tu presupuesto entre diferentes tipos de anuncios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={budgetAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {budgetAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ajustar Presupuesto</CardTitle>
            <CardDescription>
              Modifica tu presupuesto mensual para todas tus campañas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="budget-slider">Presupuesto mensual</Label>
                  <span className="font-medium">${totalBudget.toLocaleString()}</span>
                </div>
                <Slider
                  id="budget-slider"
                  min={100}
                  max={10000}
                  step={100}
                  value={[totalBudget]}
                  onValueChange={(values) => setTotalBudget(values[0])}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$100</span>
                  <span>$10,000</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Método de pago</h3>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="credit-card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="h-4 w-4 text-fusion-primary"
                    />
                    <Label htmlFor="credit-card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Tarjeta de crédito (•••• 4832)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="h-4 w-4 text-fusion-primary"
                    />
                    <Label htmlFor="paypal" className="flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      PayPal (ejemplo@correo.com)
                    </Label>
                  </div>
                  
                  <Button variant="outline" className="mt-2 w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir método de pago
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3 pt-2">
                  <Switch
                    id="auto-renewal"
                    checked={autoRenewal}
                    onCheckedChange={setAutoRenewal}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="auto-renewal">Renovación automática</Label>
                    <p className="text-sm text-muted-foreground">
                      Renovar automáticamente el presupuesto cada mes
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Guardar cambios</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Facturación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Descripción</th>
                  <th className="px-6 py-3">Monto</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">15/05/2023</td>
                  <td className="px-6 py-4">Cargo mensual de anuncios</td>
                  <td className="px-6 py-4">$1,000.00</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Completado
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Ver recibo</Button>
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">15/04/2023</td>
                  <td className="px-6 py-4">Cargo mensual de anuncios</td>
                  <td className="px-6 py-4">$850.00</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Completado
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Ver recibo</Button>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4">15/03/2023</td>
                  <td className="px-6 py-4">Cargo mensual de anuncios</td>
                  <td className="px-6 py-4">$750.00</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Completado
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Ver recibo</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Tax Information */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Información fiscal importante</AlertTitle>
        <AlertDescription>
          Configura tu información fiscal para recibir facturas y cumplir con las regulaciones de impuestos locales.
          <Button variant="link" className="p-0 h-auto font-normal">Configurar ahora</Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdBudgeting;
