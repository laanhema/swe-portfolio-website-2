import type React from 'react';

// Mobile browsers skip :active on taps (#71, #73) or leave it stuck after a tap opens a new
// tab (#72), so the press plays on pointerdown and always runs to the end.
const PRESS_KEYFRAMES: Keyframe[] = [
  { transform: 'translate(6px, 6px)', boxShadow: '0px 0px 0px 0px #121212', offset: 0.4 },
];

export const playPress = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.animate(PRESS_KEYFRAMES, { duration: 200, easing: 'ease-out' });
};
