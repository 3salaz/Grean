import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import Background from "../../../assets/pexels-melissa-sombrerero-12605435.jpg";
import Button from "../Button";
import Signin from "../../Common/Signin";
import { useAuthProfile } from "../../../context/AuthProfileContext";
import SpringModal from "../Modals/SpringModal";
import Loader from "../../Common/Loader"; // Adjust the import path as needed

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

function Landing() {
  const [signInModalOpen, setSigninModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user } = useAuthProfile();
  const history = useHistory();

  const closeSigninModal = () => setSigninModalOpen(false);
  const openSigninModal = () => setSigninModalOpen(true);

  const navigateTo = (route) => {
    history.push(`/${route}`);
  };

  useEffect(() => {
    const img = new Image();
    img.src = Background;
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <section className="relative h-full w-full flex justify-center items-center">
      {!imageLoaded && <Loader fullscreen />}
      <AnimatePresence>
        {imageLoaded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInVariants}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <img
              src={Background}
              alt="Woman sitting atop a rock edge which is extending outwards over a river."
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
              className="absolute top-0 object-cover h-full"
            />
            <div className="relative z-20 flex flex-col items-center gap-8 justify-center text-center h-full w-full">
              <AnimatedTextWord text="GREAN" />
              <div className="w-full items-center justify-center flex flex-col gap-2">
                {user ? (
                  <Button
                    className="border-2 border-grean text-grean bg-white bg-transparent rounded-lg flex items-center justify-center"
                    size="medium"
                    shape="circle"
                    onClick={() => navigateTo('account')}
                  >
                    Account
                  </Button>
                ) : (
                  <Button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openSigninModal}
                    size="medium"
                    className="border-2 border-grean text-grean bg-white bg-transparent rounded-lg flex items-center justify-center"
                  >
                    Sign In
                  </Button>
                )}
                <Button variant="primary" className="border-2 border-white">
                  Browse
                </Button>
              </div>
            </div>
            <SpringModal isOpen={signInModalOpen} handleClose={closeSigninModal}>
              <Signin />
            </SpringModal>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Landing;
