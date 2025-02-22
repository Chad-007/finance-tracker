import { MotionProps } from "framer-motion";

declare module "framer-motion" {
  interface HTMLMotionProps extends MotionProps {
    animate?: MotionProps["animate"] & {
      rotate?: number | string;
    };
    transition?: MotionProps["transition"] & {
      rotate?: number | string;
    };
  }

  interface SVGMotionProps extends MotionProps {
    animate?: MotionProps["animate"] & {
      rotate?: number | string;
    };
    transition?: MotionProps["transition"] & {
      rotate?: number | string;
    };
  }
}
