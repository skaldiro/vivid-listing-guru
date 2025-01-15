import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Welcome to Electric AI</h1>
        <p className="page-description">Generate compelling property listings in seconds</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Generate New Listing</h2>
          <p className="text-muted-foreground mb-4">
            Create a new property listing with AI-powered descriptions and features.
          </p>
          <Button onClick={() => navigate("/generate")} className="w-full">
            Create Listing
          </Button>
        </div>
        
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">View Listings</h2>
          <p className="text-muted-foreground mb-4">
            Access and manage all your generated property listings.
          </p>
          <Button variant="outline" onClick={() => navigate("/listings")} className="w-full">
            View Listings
          </Button>
        </div>
        
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-muted-foreground mb-4">
            Manage your account preferences and notification settings.
          </p>
          <Button variant="outline" onClick={() => navigate("/settings")} className="w-full">
            Open Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;