
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target, Sparkles, Users, BarChart, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdvertiseWithUs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/ad-management?tab=onboarding');
  };
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 bg-gradient-to-r from-fusion-primary/10 to-fusion-accent/10 p-8 rounded-2xl">
          <h1 className="text-4xl font-bold mb-4">Advertise with Vira Social – The Future of Digital Advertising</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Reach Your Audience with Precision and Impact
          </p>
          <div className="mt-6 max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              Vira Social is revolutionizing digital advertising by combining advanced AI-driven targeting, 
              high user engagement, and dynamic content interactions to deliver exceptional ad performance. 
              Unlike traditional platforms, our unique algorithm ensures that your advertisements reach the 
              right audience at the right time, maximizing conversions and brand impact.
            </p>
          </div>
        </div>
        
        {/* Main Content Section */}
        <h2 className="text-2xl font-bold mb-6 text-center">Why Advertise on Vira Social?</h2>
        
        {/* Feature 1 */}
        <Card className="border shadow-sm mb-10">
          <CardHeader className="pb-4 bg-gradient-to-r from-fusion-primary/5 to-fusion-secondary/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white shadow-sm">
                <Target className="h-6 w-6 text-fusion-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">1. AI-Enhanced Targeting & Precision Marketing</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <p className="text-gray-700 mb-4">
                  Our powerful AI-driven algorithm analyzes user behavior, preferences, and engagement patterns 
                  to ensure that your ads are displayed to the most relevant audience. With our predictive 
                  analytics, your business can target customers based on:
                </p>
                <ul className="space-y-2">
                  {["Interests & Browsing Behavior", "Purchase Intent & Past Interactions", 
                    "Location & Demographics", "Real-Time Engagement Signals"].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-fusion-secondary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  By leveraging machine learning, we continuously optimize ad placements to increase 
                  visibility and maximize engagement, ensuring higher ROI and conversion rates.
                </p>
              </div>
              <div className="lg:w-1/2 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475" 
                  alt="AI-Enhanced targeting visualization" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature 2 */}
        <Card className="border shadow-sm mb-10">
          <CardHeader className="pb-4 bg-gradient-to-r from-fusion-secondary/5 to-fusion-primary/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white shadow-sm">
                <Sparkles className="h-6 w-6 text-fusion-secondary" />
              </div>
              <CardTitle className="text-2xl font-bold">2. Highly Engaging and Interactive Ads</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row-reverse gap-8">
              <div className="lg:w-1/2">
                <p className="text-gray-700 mb-4">
                  Vira Social offers next-generation ad formats that encourage active user participation 
                  rather than passive scrolling. Our platform supports:
                </p>
                <ul className="space-y-2">
                  {["Native Feed Ads – Seamlessly integrated into the user experience without disruption.", 
                    "Story & Video Ads – Full-screen, immersive content that drives action.", 
                    "Interactive Polls & Gamified Ads – Engage users in decision-making and fun challenges.", 
                    "Sponsored Livestreams & Influencer Partnerships – Authentic brand collaboration with top creators.", 
                    "AI-Powered Dynamic Ads – Automatically adjust content based on user engagement."].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-fusion-secondary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  With higher engagement rates than traditional social media platforms, 
                  Vira Social ensures your brand stands out in a meaningful way.
                </p>
              </div>
              <div className="lg:w-1/2 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Interactive ad experiences" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature 3 */}
        <Card className="border shadow-sm mb-10">
          <CardHeader className="pb-4 bg-gradient-to-r from-fusion-accent/5 to-fusion-secondary/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white shadow-sm">
                <Users className="h-6 w-6 text-fusion-accent" />
              </div>
              <CardTitle className="text-2xl font-bold">3. Better User Participation, More Meaningful Engagement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <p className="text-gray-700 mb-4">
                  At Vira Social, we prioritize active user engagement, making advertising more effective than ever. 
                  Unlike platforms that rely on forced ad placements, we integrate ads organically into the user experience. 
                  Our users interact more with content thanks to:
                </p>
                <ul className="space-y-2">
                  {["Personalized Feeds – Ads tailored to user preferences, leading to more meaningful interactions.", 
                    "AI-Optimized Ad Timing – Delivering ads at the moments users are most likely to engage.", 
                    "Reward-Based Ad System – Users are incentivized for engaging with sponsored content."].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-fusion-secondary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  This ensures a higher click-through rate (CTR), better engagement, and more brand loyalty.
                </p>
              </div>
              <div className="lg:w-1/2 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                  alt="Users engaging with content" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature 4 */}
        <Card className="border shadow-sm mb-10">
          <CardHeader className="pb-4 bg-gradient-to-r from-fusion-primary/5 to-fusion-accent/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white shadow-sm">
                <BarChart className="h-6 w-6 text-fusion-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">4. Cost-Effective Advertising with Real-Time Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row-reverse gap-8">
              <div className="lg:w-1/2">
                <p className="text-gray-700 mb-4">
                  Our self-service ad platform allows businesses of all sizes to create campaigns with flexible budgeting. 
                  You can set your own spending limits and monitor performance in real-time with:
                </p>
                <ul className="space-y-2">
                  {["Live Performance Tracking – Access data on impressions, engagement, and conversions.", 
                    "A/B Testing – Optimize ad creatives for the best results.", 
                    "AI Budget Optimization – Automatically reallocates spend to high-performing ads.", 
                    "Retargeting Features – Re-engage potential customers who have interacted with your brand."].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-fusion-secondary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 mt-4">
                  Vira Social provides detailed analytics dashboards that allow advertisers to make 
                  data-driven decisions for optimal campaign performance.
                </p>
              </div>
              <div className="lg:w-1/2 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                  alt="Analytics dashboard" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-fusion-primary/20 to-fusion-accent/20 rounded-2xl p-8 text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Partner with Us and Grow Your Brand</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            Whether you're a small business looking to increase visibility or a global brand 
            seeking to engage the Latino market more effectively, Vira Social offers the 
            perfect advertising solution. Our community-driven, AI-enhanced platform delivers 
            measurable results with unmatched engagement.
          </p>
          <Button 
            onClick={handleGetStarted} 
            size="lg" 
            className="bg-fusion-primary hover:bg-fusion-primary/90 text-white gap-2"
          >
            Get Started Today <ChevronRight className="h-4 w-4" />
          </Button>
          <p className="mt-4 text-gray-600">
            Contact our advertising team at <span className="font-medium">ads@virasocial.com</span> or visit our 
            Ad Manager Portal to launch your first campaign.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdvertiseWithUs;
