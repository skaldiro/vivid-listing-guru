import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ChartBarIcon, Mail } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.error("Auth error:", error);
        navigate("/auth");
        return;
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: profile, isLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      return data;
    },
    retry: false,
    onError: (error) => {
      console.error("Profile query error:", error);
      toast({
        title: "Error loading profile",
        description: "Please try signing in again",
        variant: "destructive"
      });
      navigate("/auth");
    }
  });

  const updateEmailNotifications = useMutation({
    mutationFn: async (checked: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ email_notifications: checked })
        .eq('id', user.id);

      if (error) throw error;
      return checked;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
    },
    onError: (error: Error) => {
      console.error("Update error:", error);
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (profileError || !profile) {
    return null; // The error is handled in the query's onError callback
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <div className="grid gap-6 max-w-4xl">
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
                onCheckedChange={(checked) => updateEmailNotifications.mutate(checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;