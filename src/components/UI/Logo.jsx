const Logo = ({ size = "md" }) => {
    const sizeMap = {
        xs: 32,
        sm: 48,
        md: 64,
        lg: 96,
        xl: 128,
        "2xl": 160,
    };

    const width = sizeMap[size] || sizeMap.md;
    const height = sizeMap[size] || sizeMap.md;

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512" 
            width={width} 
            height={height}
            style={{ display: "inline-block" }}
        >
            <circle cx="256" cy="256" r="240" fill="#FFFFFF" stroke="#000000" strokeWidth="24"/>

            <rect x="80" y="160" width="360" height="200" fill="#FFD028" transform="rotate(-8 256 256)" strokeWidth="0"/>

            <circle cx="210" cy="256" r="90" fill="none" stroke="#000000" strokeWidth="45" />
            <line x1="235" y1="290" x2="280" y2="360" stroke="#000000" strokeWidth="45" strokeLinecap="square" />

            <polygon 
                points="380,130 310,280 360,280 330,410 450,230 390,230" 
                fill="#8B5CF6" 
                stroke="#000000" 
                strokeWidth="15" 
                strokeLinejoin="miter"
            />
        </svg>
    );
}

export default Logo;