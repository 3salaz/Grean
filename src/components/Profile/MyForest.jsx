import {useState} from "react";
import {IonRow, IonCol, IonText} from "@ionic/react";
import {motion, AnimatePresence} from "framer-motion";
import forestBg from "../../assets/forestbg.webp";

import sprout from "../../assets/icons/sprout.png";
import glassTree from "../../assets/icons/glassTree.png";
import aluminumTree from "../../assets/icons/aluminumTree.png";
import plasticTree from "../../assets/icons/plasticTree.png";
import mediumTree from "../../assets/icons/mediumTree.png";

// Tree data with different growth stages
const treeData = {
  plastic: {
    stages: [
      {stage: "sprout", src: sprout, width: 60, height: 60},
      {stage: "young", src: mediumTree, width: 60, height: 100},
      {stage: "mature", src: plasticTree, width: 120, height: 200}
    ]
  },
  aluminum: {
    stages: [
      {stage: "sprout", src: sprout, width: 60, height: 60},
      {stage: "young", src: mediumTree, width: 60, height: 100},
      {stage: "mature", src: aluminumTree, width: 120, height: 200}
    ]
  },
  glass: {
    stages: [
      {stage: "sprout", src: sprout, width: 60, height: 60},
      {stage: "young", src: mediumTree, width: 60, height: 100},
      {stage: "mature", src: glassTree, width: 120, height: 160}
    ]
  }
};

function Tree({type, recycledWeight, thresholds, isSelected, onSelect}) {
  const treeStages = treeData[type].stages;
  const threshold = thresholds[type];

  // Determine the current stage based on recycled weight and threshold
  let currentStage = treeStages[0];
  if (recycledWeight >= 2 * threshold) {
    currentStage = treeStages[2]; // mature
  } else if (recycledWeight >= threshold) {
    currentStage = treeStages[1]; // young
  }

  // Animation variants for popping and fading
  const variants = {
    hidden: {opacity: 0, scale: 0},
    visible: {opacity: 1, scale: 1},
    exit: {opacity: 0, scale: 0.8}
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStage.stage}
        className="tree-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end", // Anchor trees to the bottom
          height: "150px" // Set consistent height for the container
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{duration: 0.5}}
      >
        <img
          src={currentStage.src}
          alt={`${type} tree at ${currentStage.stage} stage`}
          className="object-cover"
          style={{
            width: currentStage.width,
            height: currentStage.height,
            border: isSelected ? "2px solid blue" : "none", // Highlight when selected
            cursor: "pointer"
          }}
          onClick={() => onSelect(type)} // Handle selection on click
        />
      </motion.div>
    </AnimatePresence>
  );
}

function MyForest() {
  const thresholds = {
    plastic: 13,
    aluminum: 5.7,
    glass: 26.5
  };

  const initialRecycling = {
    plastic: 0,
    aluminum: 0,
    glass: 0
  };

  const [recyclingProgress, setRecyclingProgress] = useState(initialRecycling);
  const [selectedTree, setSelectedTree] = useState(null); // Track selected tree

  return (
    <div
      style={{backgroundImage: `url(${forestBg})`}}
      className="bg-cover bg-center w-full drop-shadow-lg rounded-b-xl"
    >
      <IonRow className="mb-10 pl-2">
        <IonCol
          size="auto"
          className="bg-[#75B657] px-2 mx-auto text-center rounded-b-md px-4"
        >
          <IonText color="secondary" className="font-bold text-white text-xl">
            Your Forest
          </IonText>
        </IonCol>
      </IonRow>

      <IonRow className="flex justify-center space-x-4">
        {Object.keys(recyclingProgress).map((type) => (
          <Tree
            key={type}
            type={type}
            recycledWeight={recyclingProgress[type]}
            thresholds={thresholds}
            isSelected={selectedTree === type} // Check if this tree is selected
            onSelect={setSelectedTree} // Set selected tree on click
          />
        ))}
      </IonRow>

      {/* Material Weight Controls */}
      {/* <IonRow className="mt-4 bg-white">
        {Object.keys(recyclingProgress).map((material) => (
          <IonCol key={material} className="flex flex-col items-center">
            <IonText className="font-bold text-sm capitalize">
              {material}: {recyclingProgress[material]} lbs
            </IonText>
            <div className="flex space-x-2 mt-2">
              <IonButton
                onClick={() => handleRecycle(material, 1)}
                color="primary"
              >
                +1 lb
              </IonButton>
              <IonButton
                onClick={() => handleRecycle(material, -1)}
                color="danger"
              >
                -1 lb
              </IonButton>
            </div>
          </IonCol>
        ))}
      </IonRow> */}
    </div>
  );
}

export default MyForest;
