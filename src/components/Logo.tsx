interface LogoProps {
    className?: string;
    'aria-hidden'?: boolean;
}

/** Inline SVG mark for Storefront Next: a rounded square with a stylized "SFN" chevron/terminal glyph. */
export function Logo({ className = 'h-8 w-8', 'aria-hidden': ariaHidden }: LogoProps) {
    return (
        <svg
            viewBox="0 0 32 32"
            className={className}
            role={ariaHidden ? undefined : 'img'}
            aria-hidden={ariaHidden}
            aria-label={ariaHidden ? undefined : 'Storefront Next logo'}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="32" height="32" rx="8" className="fill-[#f0802a]" />
            <path
                d="M10 11.5L15 16L10 20.5"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="stroke-[#0b0a08]"
            />
            <path d="M17 21H23" strokeWidth="2.4" strokeLinecap="round" className="stroke-[#0b0a08]" />
        </svg>
    );
}

