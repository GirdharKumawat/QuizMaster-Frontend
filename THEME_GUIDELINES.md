
<label className="block text-black text-sm font-black mb-1 uppercase tracking-wider transform -skew-x-6 w-fit bg-[#FFD028] px-2 border border-black shadow-[2px_2px_0px_0px_#000]">{label}</label>


const NeoSwitch = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group select-none transform rotate-1">
    <div className={`w-14 h-8 border-2 border-black relative transition-colors ${checked ? 'bg-[#34D399]' : 'bg-gray-200'} shadow-[3px_3px_0px_0px_#000]`}>
      <div className={`absolute top-0.5 w-6 h-6 bg-white border-2 border-black transition-all duration-200 ${checked ? 'left-6' : 'left-0.5'}`} />
    </div>
    {label && <span className={`text-sm font-black uppercase tracking-wide bg-black text-white px-2 transform -rotate-2`}>{label}</span>}
    <input type="checkbox" className="hidden" checked={checked} onChange={e => onChange && onChange(e.target.checked)} />
  </label>
);



Hybrid Neo-Brutalism Design System

This project uses a "Hybrid" Neo-Brutalism theme. It combines two distinct visual styles to separate the "serious" parts of the app (Authentication/Admin) from the "fun" parts (Gameplay).

1. Core Philosophy

Style A: "Classic" (Sharp & Serious)

Where to use: Login screens, Sign up, Settings panels, Admin dashboards.

Key Traits: Sharp corners (rounded-sm), High contrast (Yellow/Black/White), Blocky.

Goal: clarity, trust, retro-computer vibe.

Style B: "Pop" (Rounded & Playful)

Where to use: Inside the Quiz, Leaderboards, Waiting Room, Success messages.

Key Traits: Rounded corners (rounded-xl or 2xl), Vibrant colors (Purple/Pink/Green), Soft but bold.

Goal: energy, gamification, friendliness.

2. Design Tokens (Copy-Paste These)

Colors (Palette)

Name

Hex

Tailwind Class

Usage

Black

#000000

bg-black text-black

Borders, Text, Shadows

White

#FFFFFF

bg-white

Card Backgrounds

Purple

#8B5CF6

bg-[#8B5CF6]

Primary Buttons (Pop), Highlights

Yellow

#FFD028

bg-[#FFD028]

Primary Buttons (Classic), Warnings

Pink

#F472B6

bg-[#F472B6]

Accents, "Bonus" items

Green

#34D399

bg-[#34D399]

Success, Toggles, Progress Bars

Shadows & Borders (The "Brutalist" Look)

Every container or interactive element MUST have these properties:

Border: border-2 border-black (Never thin gray borders).

Shadow: shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] (Hard offset shadow).

Hover Effect: On hover, elements should often translate to "move" away from the shadow slightly, or change color.

Active/Click Effect: active:shadow-none active:translate-x-[2px] active:translate-y-[2px] (Simulates a physical button press).

3. Component Development Rules

When building a new component, follow this checklist:

Rule 1: Define the Variant

Does this component belong in the Game (Pop) or the Admin/Login (Classic)?

If Classic: Use rounded-sm.

If Pop: Use rounded-xl or rounded-2xl.

Rule 2: Buttons & Interactables

Never use default browser buttons.

Base Classes: px-6 py-3 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all

Interaction: active:translate-x-[2px] active:translate-y-[2px] active:shadow-none

Rule 3: Typography

Headings: Always font-black or font-bold. Uppercase is preferred for titles.

Body: font-medium or font-bold. Avoid thin fonts.

Tracking: Use tracking-tight for large headings, tracking-wide for small labels.

4. Code Snippets (Quick Start)

Standard Card (Container)

// For Gameplay (Pop)
<div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
  {children}
</div>

// For Login/Admin (Classic)
<div className="bg-white border-2 border-black rounded-sm p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
  {children}
</div>


Primary Button

<button className="px-6 py-3 font-bold bg-[#8B5CF6] text-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
  Click Me
</button>


Input Field

<input 
  className="w-full p-3 font-bold border-2 border-black rounded-xl focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all" 
  placeholder="Type here..." 
/>


Badge / Tag

<span className="bg-[#FFD028] text-black px-3 py-1 text-xs font-bold border-2 border-black rounded-md shadow-[2px_2px_0px_0px_#000]">
  NEW
</span>


5. Global CSS Helper (Optional)

To make development faster, you can add these utility classes to your src/index.css:

@layer components {
  .neo-border {
    @apply border-2 border-black;
  }
  .neo-shadow {
    @apply shadow-[4px_4px_0px_0px_rgba(0,0,0,1)];
  }
  .neo-press {
    @apply active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all;
  }
  
  /* Usage: className="neo-border neo-shadow neo-press bg-yellow-400 p-4 rounded-xl" */
}
