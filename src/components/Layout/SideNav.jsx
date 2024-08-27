import { useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { logoInstagram, logoTwitter, logoLinkedin } from 'ionicons/icons';
import { IonIcon } from "@ionic/react";

const SideNav = ({ isOpen, toggleMobileNav }) => {
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        toggleMobileNav();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleMobileNav]);

  const handleLinkClick = () => {
    // Delay the toggling to avoid immediate reopening due to event bubbling
    setTimeout(() => {
      toggleMobileNav();
    }, 100);
  };

  const variants = {
    open: {
      x: "0%",
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={navRef}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      className="fixed top-[8svh] left-0 h-screen w-[65%] bg-gray-800 rounded-r-lg drop-shadow-2xl z-20 pb-4"
    >
      <div className="flex flex-col p-4 w-full h-full bg-white bg-opacity-95 rounded-br-md">
        <div className="text-center h-[10%] flex gap-2 items-center justify-start flex-wrap">
          <Link to="/" className="h-10 w-auto flex" onClick={handleLinkClick}>
            <img className="h-full rounded-full" src={logo} alt="logo" />
          </Link>
          <div className="text-grean font-bold text-3xl">Grean</div>
        </div>

        <ul className="space-y-5 pt-16 h-[40%]">
          <li>
            <Link
              onClick={handleLinkClick}
              to="/"
              className="bg-slate-200 text-slate-800 block rounded-md px-3 py-2 text-base font-medium"
              aria-current="page"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              onClick={handleLinkClick}
              to="/services"
              className="hover:bg-gray-700 hover:text-green-500 block rounded-md px-3 py-2 text-base font-medium"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              onClick={handleLinkClick}
              to="/about"
              className="hover:bg-gray-700 hover:text-green-500 block rounded-md px-3 py-2 text-base font-medium"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              onClick={handleLinkClick}
              to="/contact"
              className="hover:bg-gray-700 hover:text-grean block rounded-md px-3 py-2 text-base font-medium"
            >
              Contact
            </Link>
          </li>
        </ul>

        <ul className="flex items-center h-[10%] justify-center gap-x-5">
          <li className="w-14 h-14 rounded-md bg-white">
            <a
              href="https://google.com"
              className="w-full h-full flex items-center justify-center"
            >
             <IonIcon size="large" className="flex items-center justify-center" icon={logoInstagram} />
            </a>
          </li>
          <li className="w-14 h-14 rounded-md bg-white">
            <a
              href="https://google.com"
              className="w-full h-full flex items-center justify-center"
            >
              <IonIcon size="large" className="flex items-center justify-center" icon={logoTwitter} />
            </a>
          </li>
          <li className="w-14 h-14 rounded-md bg-white">
            <a
              href="https://google.com"
              className="w-full h-full flex items-center justify-center"
            >
              <IonIcon size="large" className=" flex items-center justify-center" icon={logoLinkedin} />
            </a>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default SideNav;
