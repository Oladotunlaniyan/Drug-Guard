import { Variants, Transition, TargetAndTransition } from 'motion/react';

// Spring physics configurations
export const springs = {
  soft: { type: 'spring', stiffness: 260, damping: 25 },
  bouncy: { type: 'spring', stiffness: 400, damping: 22 },
  snappy: { type: 'spring', stiffness: 350, damping: 28 },
};

// Standard micro-interaction props for buttons and cards
export const tapScale: TargetAndTransition = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const hoverScale: TargetAndTransition = {
  scale: 1.015,
  y: -2,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const hoverGently: TargetAndTransition = {
  y: -2,
  transition: { duration: 0.2, ease: 'easeOut' },
};

// Page and View Transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Section reveal on scroll
export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

// Child items inside staggered containers
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: 'easeOut',
    },
  },
};

// Modal backdrop & content animation
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
};

export const modalPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: {
      duration: 0.16,
      ease: 'easeIn',
    },
  },
};
