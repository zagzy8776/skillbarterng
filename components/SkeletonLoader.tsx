import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export default function SkeletonLoader({
  width = "w-full",
  height = "h-4",
  className = "",
  rounded = true
}: SkeletonLoaderProps) {
  return (
    <motion.div
      className={`${width} ${height} bg-gray-300 dark:bg-gray-700 ${rounded ? 'rounded' : ''} ${className}`}
      animate={{
        background: [
          "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.06) 37%, rgba(0,0,0,0.04) 63%)",
          "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.08) 37%, rgba(0,0,0,0.06) 63%)",
          "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.06) 37%, rgba(0,0,0,0.04) 63%)"
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
