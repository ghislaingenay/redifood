import { motion } from "framer-motion";

export const AnimButton = ({ children }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.8 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.1 } }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};
export const AnimRadioButton = ({ children }: any) => {
  return (
    <motion.div
      whileHover={{
        x: 5,
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};
