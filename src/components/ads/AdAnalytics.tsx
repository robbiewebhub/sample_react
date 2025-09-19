
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DownloadIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data for charts
const mockImpressionsData = [
  { day: 'Lun', impressions: 1200 },
  { day: 'Mar', impressions: 1800 },
  { day: 'Mié', impressions: 1400 },
  { day: 'Jue', impressions: 2000 },
  { day: 'Vie', impressions: 2400 },
  { day: 'Sáb', impressions: 1800 },
  { day: 'Dom', impressions: 1200 },
];

const mockClicksData = [
  { day: 'Lun', clicks: 320 },
  { day: 'Mar', clicks: 480 },
  { day: 'Mié', clicks: 380 },
  { day: 'Jue', clicks: 520 },
  { day: 'Vie', clicks: 620 },
  { day: 'Sáb', clicks: 450 },
  { day: 'Dom', clicks: 300 },
];

const mockConversionsData = [
  { day: 'Lun', conversions: 45 },
  { day: 'Mar', conversions: 65 },
  { day: 'Mié', conversions: 52 },
  { day: 'Jue', conversions: 78 },
  { day: 'Vie', conversions: 95 },
  { day: 'Sáb', conversions: 68 },
  { day: 'Dom', conversions: 42 },
];

const mockDemographicData = [
  { age: '18-24', male: 420, female: 380 },
  { age: '25-34', male: 680, female: 720 },
  { age: '35-44', male: 520, female: 580 },
  { age: '45-54', male: 320, female: 380 },
  { age: '55+', male: 180, female: 220 },
];

const AdAnalytics = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  
  const [adFilter, setAdFilter] = useState<string>("all");
  const [metricType, setMetricType] = useState<string>("impressions");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Análisis de Campañas</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "d 'de' MMMM", { locale: es })} -{" "}
                      {format(dateRange.to, "d 'de' MMMM", { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, "d 'de' MMMM", { locale: es })
                  )
                ) : (
                  <span>Selecciona un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => range && setDateRange(range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Select value={adFilter} onValueChange={setAdFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos los anuncios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los anuncios</SelectItem>
              <SelectItem value="campaign1">Campaña de verano</SelectItem>
              <SelectItem value="campaign2">Lanzamiento de producto</SelectItem>
              <SelectItem value="campaign3">Promoción especial</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* Performance summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Impresiones</p>
              <h3 className="text-2xl font-bold">12,482</h3>
              <p className="text-sm text-green-600 flex items-center">
                <span className="text-xs mr-1">▲</span> 18.2% vs período anterior
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Clics</p>
              <h3 className="text-2xl font-bold">3,284</h3>
              <p className="text-sm text-green-600 flex items-center">
                <span className="text-xs mr-1">▲</span> 12.5% vs período anterior
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">CTR</p>
              <h3 className="text-2xl font-bold">26.31%</h3>
              <p className="text-sm text-red-600 flex items-center">
                <span className="text-xs mr-1">▼</span> 2.4% vs período anterior
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Conversiones</p>
              <h3 className="text-2xl font-bold">486</h3>
              <p className="text-sm text-green-600 flex items-center">
                <span className="text-xs mr-1">▲</span> 8.7% vs período anterior
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main analytics charts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Rendimiento de la campaña</CardTitle>
            
            <Tabs value={metricType} onValueChange={setMetricType} className="w-[400px]">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="impressions">Impresiones</TabsTrigger>
                <TabsTrigger value="clicks">Clics</TabsTrigger>
                <TabsTrigger value="conversions">Conversiones</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {metricType === 'impressions' ? (
                <BarChart data={mockImpressionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="impressions" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : metricType === 'clicks' ? (
                <LineChart data={mockClicksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              ) : (
                <LineChart data={mockConversionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversions" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Demografía</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDemographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="male" name="Hombres" fill="#3b82f6" radius={[4, 0, 0, 4]} />
                <Bar dataKey="female" name="Mujeres" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdAnalytics;
