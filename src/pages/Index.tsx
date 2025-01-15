import ListingForm from "@/components/ListingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <header className="py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Perfect Listing</h1>
          <p className="text-lg text-gray-600">Generate professional property listings in seconds</p>
        </header>
        <ListingForm />
      </div>
    </div>
  );
};

export default Index;