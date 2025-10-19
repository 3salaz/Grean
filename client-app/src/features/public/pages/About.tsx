import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <IonGrid className="relative h-full w-full">
      {/* Optional subtle background accent */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-[#0c2444] via-[#103050] to-[#0c2444]" />

      {/* Content */}
      <IonRow className="relative z-10 h-full flex items-center justify-center">
        <IonCol size="6" className="text-center max-w-xl mx-auto p-6 bg-white">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 tracking-wide"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            About <span className="text-[#75B657]">GREAN</span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg leading-relaxed opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            GREAN is dedicated to making recycling accessible, efficient, and
            transparent. We partner with local communities and businesses to
            promote responsible waste management and sustainable practices.
          </motion.p>

          <motion.p
            className="mt-6 text-sm md:text-base opacity-70 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            Because every small act of recycling adds up to a big difference.
          </motion.p>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default About;
