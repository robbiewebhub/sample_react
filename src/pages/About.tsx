
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Users, Star, BriefcaseBusiness, Globe, Gift } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
            alt="People collaborating" 
            className="w-full h-64 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-fusion-primary/80 to-fusion-accent/80 mix-blend-multiply" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">About Vira Social</h1>
            <p className="text-xl md:text-2xl max-w-2xl font-medium drop-shadow-md">
              Connecting Latinos, Empowering Businesses, and Elevating Influencers
            </p>
          </div>
        </div>
        
        {/* Introduction Section */}
        <div className="prose prose-lg max-w-4xl mx-auto mb-12 text-center">
          <p className="text-xl text-gray-700 leading-relaxed">
            Welcome to Vira Social, the next-generation social media platform built to connect, empower, and elevate the Latino community. Unlike traditional social networks, Vira Social is designed for Latinos, by Latinos, creating a space where businesses, influencers, and everyday users can thrive together.
          </p>
        </div>
        
        {/* Mission Section */}
        <Card className="border shadow-lg mb-12 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-fusion-primary/10 to-fusion-accent/10 pb-2">
            <CardTitle className="text-3xl font-bold text-fusion-primary">A Platform for Latino Growth & Opportunity</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-3/5">
                <p className="text-gray-700 mb-6 text-lg">
                  Vira Social isn't just another social media app—it's a movement. We recognize that Latinos are one of the fastest-growing and most influential communities in the digital world, yet they often don't get the recognition and opportunities they deserve. Our mission is simple:
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-fusion-primary/10 p-3 rounded-full">
                      <BriefcaseBusiness className="h-8 w-8 text-fusion-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-fusion-primary">Empower Latino Businesses</h3>
                      <p className="text-gray-700">
                        We provide businesses of all sizes with powerful advertising tools, AI-driven audience targeting, and a supportive community to help them grow and connect with their ideal customers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-fusion-accent/10 p-3 rounded-full">
                      <Star className="h-8 w-8 text-fusion-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-fusion-accent">Support Influencers & Content Creators</h3>
                      <p className="text-gray-700">
                        Unlike other platforms that take large cuts from influencer earnings, Vira Social ensures that Latino creators earn more from ad revenue, sponsorships, and brand partnerships. Our monetization model gives influencers a bigger cut while providing better tools to engage and expand their audience.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-fusion-secondary/10 p-3 rounded-full">
                      <Gift className="h-8 w-8 text-fusion-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-fusion-secondary">Reward Users for Their Engagement</h3>
                      <p className="text-gray-700">
                        Our users are the heart of Vira Social. To show our appreciation, we've implemented a Weekly Rewards Program where active users can earn bonuses, perks, and exclusive benefits just for being part of the community. Your engagement fuels the platform, and we believe you should be recognized for it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/5 self-center">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Community connection" 
                  className="rounded-xl shadow-md w-full h-auto object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* New Era Section */}
        <div className="bg-gradient-to-r from-fusion-primary to-fusion-accent rounded-xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">A New Era of Social Media for Latinos</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Latino social media user" 
                className="rounded-xl shadow-md w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <p className="text-lg md:text-xl leading-relaxed">
                While major social networks focus on profit, Vira Social focuses on people. We're committed to creating a fair, engaging, and rewarding experience where Latinos can share their voices, build businesses, and achieve financial success through social media.
              </p>
            </div>
          </div>
        </div>
        
        {/* What Makes Us Different */}
        <Card className="border shadow-lg mb-12">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-center">What Makes Vira Social Different?</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-fusion-primary/10 p-3 rounded-full">
                    <Globe className="h-6 w-6 text-fusion-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">A Social Media Built for Latinos</h3>
                    <p className="text-gray-700">A dedicated platform that values and amplifies Latino culture, creators, and businesses.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-fusion-accent/10 p-3 rounded-full">
                    <Star className="h-6 w-6 text-fusion-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Better Pay for Influencers</h3>
                    <p className="text-gray-700">Higher revenue shares from ads, better brand deals, and direct monetization opportunities.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-fusion-secondary/10 p-3 rounded-full">
                    <BriefcaseBusiness className="h-6 w-6 text-fusion-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ad-Driven, User-Centered</h3>
                    <p className="text-gray-700">Businesses can reach the right audience, and users are rewarded for their engagement.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-fusion-primary/10 p-3 rounded-full">
                    <Gift className="h-6 w-6 text-fusion-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Weekly Rewards for Active Users</h3>
                    <p className="text-gray-700">The more you engage, the more you earn—because our users are the foundation of our success.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Call to Action */}
        <div className="text-center mb-10 bg-gray-50 rounded-xl p-10 shadow-inner">
          <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
            Join Vira Social today and be part of the future of Latino social media. Whether you're an entrepreneur, a creator, or someone who just loves great content, this platform was made for you.
          </p>
          <p className="text-2xl font-bold text-fusion-primary">
            Vira Social – The Platform Where Latinos Grow Together.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
