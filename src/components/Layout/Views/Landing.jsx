import { useState } from "react";
import { UserAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import SignIn from "../../Common/SignIn"; // Import the actual sign-in form
import Background from "../../../assets/pexels-melissa-sombrerero-12605435.jpg";
import Modal from "../Modal"; // Import the Modal component
import Button from "../Button";

function Landing() {
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const closeModal = () => setSignInModalOpen(false);
  const openModal = () => setSignInModalOpen(true);
  const { user } = UserAuth(); 

  return (
    <section className="relative h-full w-full flex justify-center items-center snap-always snap-center">
      <img className="absolute inset-0 w-full h-full object-cover" src={Background} alt="Woman sitting atop a rock edge which is extending outwards over a river."/>
      <div className="relative z-20 flex flex-col items-center gap-8 justify-center text-center w-full">
        <AnimatedTextWord text="GREAN" />
        <div className="w-full items-center justify-center flex">
          {user ? (
            <Link to="/account">
              <Button
                className="w-20 h-20 border-4 border-grean flex items-center justify-center"
                variant="primary" size="small" shape="circle"
              >
                Account
              </Button>
            </Link>
          ) : (
            <Button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={openModal}
              size="medium"
              className="border-2 border-grean text-grean bg-white bg-transparent rounded-lg flex items-center justify-center"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      <Modal isOpen={signInModalOpen} handleClose={closeModal}>
        <SignIn />
      </Modal>
    </section>
  );
}

export default Landing;
