import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-layout">
      <NavBar />
      <main className="main-container">
        {children}
        <p className="mt-8 text-sm text-gray-500 italic">
          Due to the nature of AI, extra details or inaccuracies may sometimes appear in generated descriptions. 
          Please ensure that all of the information in the generated description is accurate to your listing and 
          edit as necessary before using in your particulars. Electric AI takes no responsibility in any inaccurate 
          information generated in listing descriptions.
        </p>
      </main>
      <Toaster />
    </div>
  );
};