import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-6">
        Generate Amazing Property Listings in Seconds
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Use AI to create compelling property descriptions that capture attention and drive results.
      </p>
      <div className="flex gap-4 justify-center">
        <Button size="lg" onClick={() => navigate("/generate")}>
          Create New Listing
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate("/listings")}>
          View My Listings
        </Button>
      </div>
    </div>
  );
};

export default Home;