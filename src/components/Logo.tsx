interface LogoProps {
    className?: string;
}

/** Inline SVG mark for Storefront Next: a rounded square with a stylized "SFN" chevron/terminal glyph. */
export function Logo({ className = 'h-8 w-8' }: LogoProps) {
    return (
        <svg
            viewBox="0 0 32 32"
            className={className}
            role="img"
            aria-label="Storefront Next logo"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="32" height="32" rx="8" className="fill-black dark:fill-white" />
            <path
                d="M10 11.5L15 16L10 20.5"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="stroke-white dark:stroke-black"
            />
            <path d="M17 21H23" strokeWidth="2.4" strokeLinecap="round" className="stroke-white dark:stroke-black" />
        </svg>
    );
}

