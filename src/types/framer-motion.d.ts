// src/types/framer-motion.d.ts
import { MotionProps } from "framer-motion";

declare module "framer-motion" {
  interface HTMLMotionProps extends MotionProps {
    animate?: MotionProps["animate"] & {
      rotate?: number | string; // Add rotate as a valid animation property
    };
    transition?: MotionProps["transition"] & {
      rotate?: number | string; // Ensure transition can handle rotate
    };
  }

  interface SVGMotionProps extends MotionProps {
    animate?: MotionProps["animate"] & {
      rotate?: number | string; // Add rotate for SVG elements
    };
    transition?: MotionProps["transition"] & {
      rotate?: number | string; // Ensure transition can handle rotate
    };
  }
}
