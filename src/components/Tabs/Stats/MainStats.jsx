import { useState } from "react";
import { motion } from "framer-motion";

function MainStats() {
  const [isMonthly, setIsMonthly] = useState(false); // false for 'overall', true for 'monthly'

  // Placeholder data
  const statsData = {
    overall: {
      trash: 120,
      home: 75,
      car: 45,
    },
    monthly: {
      trash: 10,
      home: 5,
      car: 3,
    },
  };

  // Function to toggle the stats view
  const toggleStatsView = () => {
    setIsMonthly(!isMonthly);
  };

  // Determine the current stats type based on the isMonthly state
  const statsType = isMonthly ? "monthly" : "overall";

  return (
    <div className="w-full flex flex-col items-center justify-center bg-grean p-4  rounded-md  drop-shadow-2xl">
      <section className="px-4 flex flex-col gap-3">
        <section className="px-4 flex flex-col gap-3">
          <div className="w-full flex flex-col gap-4 text-white">
            <section className="w-full bg-orange py-2 rounded-md">
              <div className="grid grid-rows-1 grid-col-3 grid-flow-col w-full items-center">
                <div className="flex items-center justify-center">
                  <ion-icon size="large" name="home-outline"></ion-icon>
                </div>
                <h4 className="text-xl font-bold text-center">
                  {statsData[statsType].home}
                </h4>
                <button className="flex items-center justify-center">
                  <ion-icon
                    size="large"
                    name="information-circle-outline"
                  ></ion-icon>
                </button>
              </div>
            </section>
            <section className="w-full bg-orange py-2 rounded-md ">
              <div className="grid grid-rows-1 grid-col-3 grid-flow-col w-full items-center">
                <div className="flex items-center justify-center">
                  <ion-icon size="large" name="car-outline"></ion-icon>
                </div>
                <h4 className="text-xl font-bold text-center">
                  {statsData[statsType].car}
                </h4>
                <button className="text-white flex items-center justify-center">
                  <ion-icon
                    size="large"
                    name="information-circle-outline"
                  ></ion-icon>
                </button>
              </div>
            </section>
            <section className="w-full bg-orange py-2 rounded-md">
              <div className="grid grid-rows-1 grid-col-3 grid-flow-col w-full items-center">
                <div className="flex items-center justify-center">
                  <ion-icon size="large" name="trash-outline"></ion-icon>
                </div>
                <div className="flex items-center justify-center">
                  <h4 className="text-xl font-bold">
                    {statsData[statsType].trash}
                  </h4>
                </div>

                <button className=" flex items-center justify-center">
                  <ion-icon
                    size="large"
                    name="information-circle-outline"
                  ></ion-icon>
                </button>
              </div>
            </section>
          </div>
          <section className="bg-white text-center flex flex-col gap-3 rounded-md">
            <div className="px-4">
              <p className="text-8xl font-bold">16</p>
              <p>
                Cubic feet of waste your recycling has diverted from landfills!
              </p>
            </div>
          </section>
        </section>
        <div id="tabButtons" className="flex justify-center gap-4 text-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            className={`bg-white py-2 px-4 rounded-lg hover:border-2 hover:border-grean hover:text-grean hover:bg-white font-bold`}
            onClick={toggleStatsView}
          >
            {isMonthly ? "Show Overall Stats" : "Show Monthly Stats"}
          </motion.button>
        </div>
      </section>
    </div>
  );
}

export default MainStats;
