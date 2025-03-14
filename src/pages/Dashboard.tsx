import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LiveChat } from '../components/LiveChat';
import { WidgetSettings } from '../components/WidgetSettings';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('live-chat');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
            <TabsTrigger value="settings">Widget Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="live-chat">
            <LiveChat />
          </TabsContent>

          <TabsContent value="settings">
            <WidgetSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};