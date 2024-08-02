import { useAuthProfile } from "../../context/AuthProfileContext";
import { motion } from "framer-motion";
import avatar from "../../assets/avatar.svg";
import { Link } from "react-router-dom";

function UserHeader() {
  const { profile } = useAuthProfile();
  return (
    <header className="w-full container flex items-center justify-between bg-slate-800 p-4">
      <div className="flex items-center gap-2 h-full">
        <img
          className="rounded-full h-14 aspect-square bg-white"
          alt="profilePic"
          src={profile.profilePic || avatar}
        ></img>
        <div className="flex gap-1 flex-col items-start justify-center h-full">
          <h2 className="text-sm font-bold text-white">{profile.displayName}</h2>
          <p className="text-xs bg-grean text-white font-bold rounded-lg flex flex-wrap p-2">
            ID:{profile.email}
          </p>
        </div>
      </div>

      <Link to="/settings" className="flex items-end justify-end h-full p-2">
        <motion.button
          className="bg-red-500 text-white rounded-full flex items-center justify-center p-1 flex-end"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ion-icon size="small" name="settings-outline"></ion-icon>
        </motion.button>
      </Link>
    </header>
  );
}

export default UserHeader;
