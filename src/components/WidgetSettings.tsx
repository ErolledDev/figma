import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface WidgetSettings {
  business_name: string;
  representative_name: string;
  quick_questions: string[];
  widget_color: string;
}

export const WidgetSettings = () => {
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue } = useForm<WidgetSettings>();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (error) throw error;

      if (businesses && businesses.length > 0) {
        const business = businesses[0];
        setBusinessId(business.id);
        setValue('business_name', business.business_name);
        setValue('representative_name', business.representative_name);
        setValue('quick_questions', business.quick_questions);
        setValue('widget_color', business.widget_color);
      } else {
        // Create new business if none exists
        const { data: newBusiness, error: createError } = await supabase
          .from('businesses')
          .insert({
            user_id: user.id,
            business_name: 'My Business', // Default name
            representative_name: 'Representative', // Default name
          })
          .select()
          .single();

        if (createError) throw createError;
        
        if (newBusiness) {
          setBusinessId(newBusiness.id);
          setValue('business_name', newBusiness.business_name);
          setValue('representative_name', newBusiness.representative_name);
          setValue('quick_questions', newBusiness.quick_questions || []);
          setValue('widget_color', newBusiness.widget_color || '#33475b');
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: WidgetSettings) => {
    try {
      if (businessId) {
        const { error } = await supabase
          .from('businesses')
          .update(data)
          .eq('id', businessId);

        if (error) throw error;
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Widget Settings</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Business Name
            </label>
            <Input {...register('business_name')} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Representative Name
            </label>
            <Input {...register('representative_name')} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quick Questions (one per line)
            </label>
            <textarea
              {...register('quick_questions')}
              className="w-full h-32 p-2 border rounded"
              placeholder="Enter up to 3 quick questions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Widget Color
            </label>
            <Input
              type="color"
              {...register('widget_color')}
              className="h-10 w-20"
            />
          </div>

          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};