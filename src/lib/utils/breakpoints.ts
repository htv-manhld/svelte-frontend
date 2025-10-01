export const BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536
} as const;

export const isDesktop = () => window.innerWidth >= BREAKPOINTS.lg;
export const isMobile = () => window.innerWidth < BREAKPOINTS.lg;
