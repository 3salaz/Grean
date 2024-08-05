import { motion } from "framer-motion";
import { IonIcon } from "@ionic/react";
import { personCircleOutline, navigateCircleOutline, statsChartOutline } from "ionicons/icons";

function TabBar({ active, setActive }) {
  const MenuItems = [
    { name: "Profile", icon: personCircleOutline, dis: "translate-x-[-4rem]" },
    { name: "Map", icon: navigateCircleOutline, dis: "translate-x-0" },
    { name: "Stats", icon: statsChartOutline, dis: "translate-x-16" },
  ];

  return (
    <footer className="bg-slate-800 w-full border-t-[2px] z-30 border-t-white h-[10svh] fixed bottom-0">
      <ul id="tabs" className="flex relative justify-center z-30 bg-slate-800 h-full">
        <span
          className={`bg-grean duration-500 ${MenuItems[active].dis} border-4 border-white h-16 w-16 absolute -top-5 rounded-full`}
        >
          <span className="w-3.5 h-3.5 absolute top-4 -left-[18px] rounded-tr-[5px] shadow-myshadow1 bg-transparent"></span>
          <span className="w-3.5 h-3.5 absolute top-4 -right-[18px] rounded-tl-[5px] shadow-myshadow2 bg-transparent"></span>
        </span>

        {MenuItems.map((menu, i) => (
          <li key={i} className="w-16">
            <motion.div
              className="flex flex-col text-center pt-6 text-white"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setActive(i)}
            >
              <span className={`text-3xl cursor-pointer duration-500 ${i === active && "-mt-6"}`}>
                <IonIcon icon={menu.icon} size="large" />
              </span>
              <span className={`${active === i ? "translate-y-2 duration-700 opacity-100 text-xs font-bold" : "opacity-0 translate-y-10"}`}>
                {menu.name}
              </span>
            </motion.div>
          </li>
        ))}
      </ul>
    </footer>
  );
}

export default TabBar;
