const MD_BREAKPOINT_PX = 768;

export const DESKTOP_MEDIA = `(min-width: ${MD_BREAKPOINT_PX}px)`;
export const MOBILE_MEDIA = `not all and ${DESKTOP_MEDIA}`;
export const MOBILE_SIZES_MEDIA = `(max-width: ${MD_BREAKPOINT_PX - 1}px)`;
