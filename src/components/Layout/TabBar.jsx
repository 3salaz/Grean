import { motion } from "framer-motion";
import { IonIcon } from "@ionic/react";
import { personCircleOutline, navigateCircleOutline, statsChartOutline } from "ionicons/icons";

function TabBar({ active, setActive }) {
  const MenuItems = [
    { name: "Profile", icon: personCircleOutline, x: -64 },  // x values in pixels for smooth transition
    { name: "Map", icon: navigateCircleOutline, x: 0 },
    { name: "Stats", icon: statsChartOutline, x: 64 },
  ];

  return (
    <footer className="w-full border-t-2 z-30 border-t-white h-[10%] fixed bottom-0">
      <ul className="flex relative justify-center h-full container max-w-2xl mx-auto bg-slate-800 rounded-t-md">
        <motion.div
          className="bg-grean border-4 border-white h-16 w-16 absolute -top-5 rounded-full"
          animate={{ x: MenuItems[active].x }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="w-3.5 h-3.5 absolute top-4 -left-[18px] rounded-tr-[5px] shadow-myshadow1 bg-transparent"></span>
          <span className="w-3.5 h-3.5 absolute top-4 -right-[18px] rounded-tl-[5px] shadow-myshadow2 bg-transparent"></span>
        </motion.div>

        {MenuItems.map((menu, i) => (
          <li key={i} className="w-16">
            <motion.div
              className="flex flex-col text-center pt-10 text-white"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setActive(i)}
            >
              <motion.span
                className={`text-3xl cursor-pointer duration-500 ${i === active ? "-mt-6" : ""}`}
                animate={{ y: i === active ? -20 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <IonIcon icon={menu.icon} size="large" />
              </motion.span>
              <motion.span
                className={`${
                  active === i ? "translate-y-2 duration-700 opacity-100 text-xs font-bold" : "opacity-0 translate-y-10"
                }`}
                animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {menu.name}
              </motion.span>
            </motion.div>
          </li>
        ))}
      </ul>
    </footer>
  );
}

export default TabBar;

