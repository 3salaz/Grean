import logo from "../../assets/logo.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SideNav = ({ isOpen, toggleMobileNav }) => {
  return (
    <>
      {isOpen && (
        <motion.div
          variants={{
            open: {
              x: "0%",
            },
            closed: {
              x: "-100%",
            },
          }}
          initial="closed"
          animate="open"
          className="fixed inset-0 space-y-10 p-6 bg-[#75B657] mx-auto flex flex-col justify-center"
        >
          <div className="container mx-auto">
            <div className="text-center flex items-center">
              <Link to="/">
                <img className="w-32 rounded-full" src={logo} alt="logo"></img>
              </Link>
            </div>
            <div className="space-y-5 pt-16">
              <Link
                onClick={toggleMobileNav}
                to="/"
                className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                aria-current="page"
              >
                Home
              </Link>
              <Link
                onClick={toggleMobileNav}
                to="/services"
                className="text-white hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Services
              </Link>
              <Link
                onClick={toggleMobileNav}
                to="/about"
                className="text-white hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                About
              </Link>
              <Link
                onClick={toggleMobileNav}
                to="/contact"
                className="text-white hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
          <ul className="flex items-center justify-center gap-x-5">
            <li className="w-14 h-14 rounded-md bg-white">
              <a
                href="https://google.com"
                className="w-full h-full flex items-center justify-center"
              >
                <ion-icon
                  className="w-full h-full flex items-center justify-center"
                  name="logo-instagram"
                ></ion-icon>
              </a>
            </li>

            <li className="w-14 h-14 rounded-md bg-white">
              <a
                href="https://google.com"
                className="w-full h-full flex items-center justify-center"
              >
                <ion-icon
                  className="w-full h-full flex items-center justify-center"
                  name="logo-twitter"
                ></ion-icon>
              </a>
            </li>
            <li className="w-14 h-14 rounded-md bg-white">
              <a
                href="https://google.com"
                className="w-full h-full flex items-center justify-center"
              >
                <ion-icon
                  className="w-full h-full flex items-center justify-center"
                  name="logo-linkedin"
                ></ion-icon>
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default SideNav;
