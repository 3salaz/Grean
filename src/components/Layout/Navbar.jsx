import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.svg"
import { motion, useCycle } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import SideNav from "./SideNav";
import Button from "./Button";

function Navbar() {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const [mobileNav, toggleMobileNav] = useCycle(false, true);
  const [accountNav, toggleAccountNav] = useCycle(false, true);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
      console.log("you are logged out");
      toggleAccountNav();
    } catch (e) {
      console.log(e.message);
    }
  };
  
  return (
    <nav id="navbar" className="bg-grean top-0 h-[8svh] z-50 relative drop-shadow-lg">
      <SideNav isOpen={mobileNav} toggleMobileNav={toggleMobileNav} />

      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="absolute z-30 md:hidden">
          <button
            type="button"
            className="flex md:hidden flex-col space-y-1 items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#75B657]"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => toggleMobileNav()}
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 5 },
              }}
              className="w-5 h-px bg-white block"
            ></motion.span>
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              className="w-5 h-px bg-white block"
            ></motion.span>
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -5 },
              }}
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
        <div className="absolute inset-y-0 right-2 flex gap-2 items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {/* Profile dropdown */}
          {user ? (
            <div className="relative z-30">
              <Button
                type="button"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                aria-controls="user-menu"
                variant="primary"
                shape="circle"
                onClick={() => toggleAccountNav()}
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
              // className="bg-red-600 rounded-md p-2"
              
            >
              <Link to='/setup' className="w-16 p-1 flex items-center justify-center font-bold text-sm">
                Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>

      {accountNav && (
        <motion.div
          variants={{
            open: {
              opacity: 1,
            },
            closed: {
              opacity: 0,
            },
          }}
          initial="closed"
          animate="open"
          className="relative container mx-auto"
        >
          <div
            className="absolute top-0 right-0 drop-shadow-lg z-30 w-36 rounded-bl-md bg-white py-1 px-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
          >
            <Button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="block p-2 text-sm text-gray-700 w-full text-center bg-red-500 rounded-md text-white"
              role="menuitem"
              tabIndex="-1"
              id="user-menu-item-2"
            >
              Sign out
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
