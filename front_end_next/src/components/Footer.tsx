import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
                © {new Date().getFullYear()} Motia. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 mt-2">
                <a href="#" className="hover:underline transition-colors duration-200">
                    Privacy Policy
                </a>
                <a href="#" className="hover:underline transition-colors duration-200">
                    Terms of Service
                </a>
                <a href="#" className="hover:underline transition-colors duration-200">
                    Contact
                </a>
            </div>
        </footer>
    );
};

export default Footer;
