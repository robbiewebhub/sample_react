
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BarChart3, Clock, DollarSign, LineChart, Plus, RefreshCw, Target, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AdDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  // Mock campaign data
  const campaigns = [
    {
      id: '1',
      name: 'Campaña de primavera',
      goal: 'Reconocimiento de marca',
      budget: 500,
      spent: 320,
      impressions: 24500,
      clicks: 1240,
      ctr: 5.06,
      status: 'active'
    },
    {
      id: '2',
      name: 'Promoción de verano',
      goal: 'Conversiones',
      budget: 750,
      spent: 750,
      impressions: 45000,
      clicks: 3200,
      ctr: 7.11,
      status: 'completed'
    },
    {
      id: '3',
      name: 'Lanzamiento de producto',
      goal: 'Tráfico',
      budget: 1200,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      status: 'scheduled',
      scheduledFor: '2023-12-15'
    }
  ];
  
  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'active') return campaign.status === 'active';
    if (activeTab === 'completed') return campaign.status === 'completed';
    if (activeTab === 'scheduled') return campaign.status === 'scheduled';
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Presupuesto total</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              $2,450 <span className="text-sm text-green-500 ml-2 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1" /> 12%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">$1,590 usado de $2,450</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Impresiones</CardDescription>
            <CardTitle className="text-2xl">69,500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              <span>8.2% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clics</CardDescription>
            <CardTitle className="text-2xl">4,440</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              <span>5.7% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>CTR promedio</CardDescription>
            <CardTitle className="text-2xl">6.39%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              <span>0.8% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tus campañas</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva campaña
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="scheduled">Programadas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Nombre</th>
                      <th className="text-left p-4">Objetivo</th>
                      <th className="text-left p-4">Presupuesto</th>
                      <th className="text-left p-4">Gastado</th>
                      <th className="text-left p-4">Impresiones</th>
                      <th className="text-left p-4">Clics</th>
                      <th className="text-left p-4">CTR</th>
                      <th className="text-left p-4">Estado</th>
                      <th className="text-right p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{campaign.name}</td>
                          <td className="p-4 flex items-center">
                            <Target className="h-4 w-4 mr-2 text-fusion-primary" />
                            {campaign.goal}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                              {campaign.budget}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                              {campaign.spent}
                            </div>
                            {campaign.status === 'active' && (
                              <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1 mt-1" />
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-gray-500" />
                              {campaign.impressions.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <BarChart3 className="h-4 w-4 mr-1 text-gray-500" />
                              {campaign.clicks.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <LineChart className="h-4 w-4 mr-1 text-gray-500" />
                              {campaign.ctr}%
                            </div>
                          </td>
                          <td className="p-4">
                            {campaign.status === 'active' && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Activa
                              </span>
                            )}
                            {campaign.status === 'completed' && (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                Completada
                              </span>
                            )}
                            {campaign.status === 'scheduled' && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Programada
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="outline" size="sm">
                              Ver detalles
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-4 text-center text-gray-500">
                          No hay campañas en esta categoría
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdDashboard;
