import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ChartBarIcon, Mail } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleEmailNotificationsChange = async (checked: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ email_notifications: checked })
      .eq('id', profile?.id);

    if (error) {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <p className="text-sm text-gray-500">{profile?.full_name}</p>
            </div>
            <div className="grid gap-2">
              <Label>Agency Name</Label>
              <p className="text-sm text-gray-500">{profile?.agency_name}</p>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Track your monthly listing generation usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <ChartBarIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Monthly Usage</p>
                <p className="text-2xl font-bold">{profile?.monthly_usage_count || 0} listings</p>
                <p className="text-sm text-gray-500">Reset date: {new Date(profile?.usage_reset_date || '').toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your email notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Mail className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive updates about your listings</p>
              </div>
              <Switch
                id="email-notifications"
                checked={profile?.email_notifications}
                onCheckedChange={handleEmailNotificationsChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;