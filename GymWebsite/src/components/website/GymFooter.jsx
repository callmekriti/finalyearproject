import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";
 
const GymFooter = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-10">
        <div className="flex flex-wrap justify-between items-start">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h1 className="text-3xl font-bold mb-4">FitnessHub</h1>
            <p>Find your dream home with ease and confidence.</p>
          </div>
          <div className="w-full md:w-2/4 flex flex-wrap justify-between">
            <div className="w-full sm:w-1/3 mb-8 md:mb-0">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul>
                <li>
                  <Link to="unauthorized" className="footer__a hover:underline">
                    About Us
                    </Link>
                  
                </li>
                <li>
                <Link to="unauthorized" className="footer__a hover:underline">
                Careers
                </Link>
                </li>
                <li>
                <Link to="unauthorized" className="footer__a hover:underline">
                Blog
                </Link>
                </li>
              </ul>
            </div>
            <div className="w-full sm:w-1/3 mb-8 md:mb-0">
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul>
                <li>
                <Link to="unauthorized" className="footer__a hover:underline">
                Help/FAQ
                </Link>
                </li>
                <li>
                <Link to="unauthorized" className="footer__a hover:underline">
                Press
                </Link>
                </li>
                <li>
                <Link to="unauthorized" className="footer__a hover:underline">
                Support
                </Link>
                </li>
              </ul>
            </div>
            <div className="w-full sm:w-1/3 mb-8 md:mb-0">
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul>
                <li>
                  <a href="#" className="footer__a hover:underline">
                    Equiments
                  </a>
                </li>
                <li>
                <Link to="unauthorized" className="footer__a hover:underline">
                Trainers
                </Link>
                </li>
                <li>
                  <a href="https://www.goodhousekeeping.com/health/diet-nutrition/g4351/1200-calorie-diet-plan/" className="footer__a hover:underline">
                    Diet plan
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <div className="flex mb-4">
              <FaFacebook className="w-8 h-8 mr-2" />
              <FaInstagram className="w-8 h-8 mr-2" />
              <FaTwitter className="w-8 h-8 mr-2" />
            </div>
            <p>Discover our app</p>
            <div className="flex mt-4">
              <div className="mr-2">
                <FaGooglePlay className="w-8 h-8 mr-2" />
                <p className="mt-2">Google Play</p>
              </div>
              <div>
                <FaApple className="w-8 h-8 mr-2" />
                <p className="mt-2">Apple Store</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-8">All rights reserved @FitnessHub</p>
      </div>
    </footer>
  );
};
 
export default  GymFooter;