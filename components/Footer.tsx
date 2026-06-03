import Image from 'next/image';
import { FaTwitter, FaFacebookF, FaTiktok, FaInstagram } from 'react-icons/fa';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Brand and Social Section */}
          <div className="w-full lg:w-4/12 md:w-6/12 mb-8">
            <div className="mb-4">
              <Image 
                src="/assets/images/Logowhite.png" 
                alt="logo" 
                width={100} 
                height={100}
                className="brightness-110"
              />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              We are a residential interior design firm located in Portland. Our
              boutique-studio offers more than
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-500 transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-500 transition-colors duration-300"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="w-full lg:w-3/12 md:w-3/12 sm:w-6/12 mb-8">
            <h6 className="text-white font-semibold text-lg mb-4">Services</h6>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Bonus program
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Gift cards
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Credit and payment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Service contracts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Non-cash account
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Payment
                </a>
              </li>
            </ul>
          </div>

          {/* Assistance Section */}
          <div className="w-full lg:w-3/12 md:w-3/12 sm:w-6/12 mb-8">
            <h6 className="text-white font-semibold text-lg mb-4">Assistance to the buyer</h6>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Find an order
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of delivery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Exchange and return of goods
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Guarantee
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Frequently asked questions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of use of the site
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}