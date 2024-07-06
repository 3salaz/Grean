import { useState } from "react";
import { motion } from "framer-motion";
import ProfileHeader from "../../Common/UserHeader";

function StatsTab() {
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
    <main
      id="statsTab"
      className="w-full h-full bg-light-gray z-20 flex flex-col items-center relative p-6"
    >
      {/* <ProfileHeader /> */}
      <div className="w-full h-full flex flex-col justify-between gap-4">
        <div className="bg-white w-full p-2 rounded-md flex flex-col gap-2">
          <div className="w-20">
            <img className="rounded-full" alt="user-profile-pic" src="https://placeholder.com/75"></img>
          </div>
          <div>
            <div className="text-xl font-bold">Erik Salazar</div>
          </div>
        </div>
        <div className="bg-white p-2 flex items-center justify-center h-[500px]">
          <div className="">Location 1</div>
        </div>
        <div className="flex justify-between items-center gap-2 h-20">
          <div className="aspect-square rounded-md bg-white flex items-center justify-center">
            Add Address
          </div>
          <div className="aspect-square bg-white rounded-md">Hello</div>
          <div className="rounded-md basis-3/6 aspect-[8/2] flex items-center justify-center bg-white">
            <div className="text-lg">Location 1</div>
          </div>
        </div>
      </div>

      {/* <section className="h-[80%] flex items-center justify-center px-2 bg-grean w-full rounded-t-md">
        <div className="w-full h-full flex flex-col items-center justify-center p-4  rounded-md  drop-shadow-2xl">
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
                    Cubic feet of waste your recycling has diverted from
                    landfills!
                  </p>
                </div>
              </section>
            </section>
            <div
              id="tabButtons"
              className="flex p-4 justify-center items-center text-center"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`bg-white py-2 px-4 rounded-lg hover:border-2 hover:border-grean hover:text-grean hover:bg-white font-bold`}
                onClick={toggleStatsView}
              >
                {isMonthly ? "Show Overall Stats" : "Show Monthly Stats"}
              </motion.button>
            </div>
          </section>
        </div>
      </section>

      <footer className="w-full flex justify-center items-center py-2 h-[10%]">
        <p className="text-black font-bold">
          Learn More:{" "}
          <a className="text-grean" href="https://grean.global">
            Grean Global
          </a>
        </p>
      </footer> */}
    </main>
  );
}

export default StatsTab;
