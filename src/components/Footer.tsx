import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-sm text-gray-500 italic mb-4">
          Due to the nature of AI, extra details or inaccuracies may sometimes appear in generated descriptions. 
          Please ensure that all of the information in the generated description is accurate to your listing and 
          edit as necessary before using in your particulars. Electric AI takes no responsibility in any inaccurate 
          information generated in listing descriptions.
        </div>
        <div className="text-sm text-gray-500">
          <p>By using Electric AI you agree to our Terms & Conditions</p>
          <p>© 2025 Electric AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;