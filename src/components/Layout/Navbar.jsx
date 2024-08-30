import { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.svg";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { Link } from "react-router-dom";
import SideNav from "./SideNav";
import Button from "./Button";
import { useAuthProfile } from "../../context/AuthProfileContext";
import SpringModal from "./Modals/SpringModal";
import Signup from "../../components/Common/Signup";

function Navbar() {
  const { user, logOut } = useAuthProfile();
  const [mobileNav, toggleMobileNav] = useCycle(false, true);
  const [accountNav, setAccountNav] = useCycle(false, true);
  const accountNavRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      console.log("You are logged out");
      setAccountNav(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  // Memoize the handleClickOutside function
  const handleClickOutside = useCallback((event) => {
    if (accountNavRef.current && !accountNavRef.current.contains(event.target)) {
      setAccountNav(false);
    }
  }, [setAccountNav]);

  useEffect(() => {
    if (accountNav) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountNav,handleClickOutside]);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <nav id="navbar" className="bg-grean top-0 h-[8svh] z-40 relative drop-shadow-lg">
      <SideNav isOpen={mobileNav} toggleMobileNav={toggleMobileNav} />

      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="absolute z-40 md:hidden">
          <button
            type="button"
            className="flex md:hidden flex-col space-y-1 items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#75B657]"
            aria-controls="mobile-menu"
            aria-expanded={mobileNav}
            onClick={() => toggleMobileNav()}
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 5 },
              }}
              initial={mobileNav ? "open" : "closed"}
              animate={mobileNav ? "open" : "closed"}
              className="w-5 h-px bg-white block"
            ></motion.span>
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              initial={mobileNav ? "open" : "closed"}
              animate={mobileNav ? "open" : "closed"}
              className="w-5 h-px bg-white block"
            ></motion.span>
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -5 },
              }}
              initial={mobileNav ? "open" : "closed"}
              animate={mobileNav ? "open" : "closed"}
              className="w-5 h-px bg-white block"
            ></motion.span>
          </button>
        </div>

        {/* Navbar */}
        <div className="relative flex flex-1 items-center justify-center sm:items-stretch sm:justify-start sm:hidden md:flex">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/">
              <img
                className="sm:block h-10 w-10 lg:hidden rounded-full"
                src={logo}
                alt="Grean Logo"
              ></img>
              <img
                className="hidden h-10 w-auto lg:block rounded-full"
                src={logo}
                alt="Grean Logo"
              ></img>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Link
                to="/"
                className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                aria-current="page"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/services"
                className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="text-white hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Account Nav / Alerts */}
        <div className="absolute inset-y-0 right-4 flex justify-center gap-2 items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {/* Profile dropdown */}
          {user ? (
            <div className="relative z-20">
              <Button
                type="button"
                id="user-menu-button"
                aria-expanded={accountNav}
                aria-haspopup="true"
                aria-controls="user-menu"
                variant="primary"
                size="small"
                onClick={() => setAccountNav((prev) => !prev)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="justify-end"
              >
                <span className="sr-only">Open Users Menu</span>
                <img
                  className="h-10 w-10 rounded-full bg-white"
                  src={user.photoURL || avatar}
                  alt="Users Pic"
                ></img>
              </Button>
            </div>
          ) : (
            <Button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              variant="white"
              size="small"
              onClick={handleOpen}
            >
              Sign Up
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {accountNav && (
          <motion.div
            ref={accountNavRef}
            variants={{
              open: {
                opacity: 1,
                y: 0,
              },
              closed: {
                opacity: 0,
                y: -20,
              },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative container mx-auto z-50"
          >
            <div
              className="absolute top-0 right-0 drop-shadow-lg z-40 w-36 rounded-bl-md bg-white py-1 px-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
            >
              <Button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleLogout}
                className="block z-50 p-2 text-sm text-gray-700 w-full text-center bg-red-500 rounded-md text-white"
                role="menuitem"
                tabIndex="-1"
                id="user-menu-item-2"
              >
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SpringModal isOpen={isModalOpen} handleClose={handleClose}>
        <Signup handleClose={handleClose} />
      </SpringModal>
    </nav>
  );
}

export default Navbar;
