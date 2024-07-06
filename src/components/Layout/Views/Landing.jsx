import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedTextWord from "../../Common/AnimatedTextWord";
import Background from "../../../assets/pexels-melissa-sombrerero-12605435.jpg";
import Modal from "../Modals/Modal"; // Import the Modal component
import Button from "../Button";
import Login from "../../Common/Login";
import { useAuthProfile } from "../../../context/AuthProfileContext";

function Landing() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const closeModal = () => setLoginModalOpen(false);
  const openModal = () => setLoginModalOpen(true);
  const { user } = useAuthProfile();
  const navigate = useNavigate();

  const navigateTo = (route) => {
    navigate(`/${route}`);
  }

  return (
    <section className="relative h-full w-full flex justify-center items-center">
      <img className="absolute inset-0 w-full h-full object-cover" src={Background} alt="Woman sitting atop a rock edge which is extending outwards over a river." />
      <div className="relative z-20 flex flex-col items-center gap-8 justify-center text-center w-full">
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
              onClick={openModal}
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
      <Modal isOpen={loginModalOpen} handleClose={closeModal}>
        <Login />
      </Modal>
    </section>
  );
}

export default Landing;
