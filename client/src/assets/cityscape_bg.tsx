export const cityscapeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" style="width:100%; height:100%" preserveAspectRatio="xMidYMid slice">
  <!-- Gradient background for sky -->
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2E1249" />
      <stop offset="50%" stop-color="#5D3168" />
      <stop offset="100%" stop-color="#E35D6A" />
    </linearGradient>
  </defs>
  
  <!-- Sky background with gradient -->
  <rect width="100%" height="100%" fill="url(#skyGradient)" />
  
  <!-- Red circle (moon) -->
  <circle cx="780" cy="140" r="70" fill="#E35D6A" />
  
  <!-- City silhouette - dark base layer -->
  <path d="M0,600 L0,500 L50,500 L50,550 L100,550 L100,450 L150,450 L150,500 L200,500 L200,550 L300,550 L300,450 L350,450 L350,500 L400,500 L400,550 L450,550 L450,450 L500,450 L500,500 L550,500 L550,550 L650,550 L650,450 L700,450 L700,500 L750,500 L750,600 Z" fill="#0D2436" />
  
  <path d="M750,600 L750,480 L780,480 L780,530 L830,530 L830,480 L880,480 L880,520 L930,520 L930,480 L980,480 L980,550 L1030,550 L1030,480 L1080,480 L1080,530 L1130,530 L1130,480 L1180,480 L1180,550 L1200,550 L1200,600 Z" fill="#0D2436" />
  
  <!-- Buildings - mid layer -->
  <rect x="50" y="380" width="80" height="220" fill="#2A3950" />
  <rect x="150" y="420" width="60" height="180" fill="#2A3950" />
  <rect x="250" y="350" width="70" height="250" fill="#2A3950" />
  <rect x="350" y="400" width="50" height="200" fill="#2A3950" />
  <rect x="430" y="380" width="70" height="220" fill="#2A3950" />
  <rect x="530" y="350" width="60" height="250" fill="#2A3950" />
  <rect x="620" y="420" width="90" height="180" fill="#2A3950" />
  <rect x="750" y="350" width="70" height="250" fill="#2A3950" />
  <rect x="850" y="400" width="60" height="200" fill="#2A3950" />
  <rect x="950" y="380" width="80" height="220" fill="#2A3950" />
  <rect x="1070" y="420" width="60" height="180" fill="#2A3950" />
  
  <!-- Buildings - highlight layer -->
  <rect x="100" y="420" width="40" height="180" fill="#E35D6A" />
  <rect x="230" y="450" width="30" height="150" fill="#E76F55" />
  <rect x="380" y="400" width="40" height="200" fill="#E35D6A" />
  <rect x="490" y="420" width="30" height="180" fill="#E76F55" />
  <rect x="580" y="380" width="30" height="220" fill="#E35D6A" />
  <rect x="680" y="450" width="50" height="150" fill="#E76F55" />
  <rect x="800" y="400" width="40" height="200" fill="#E35D6A" />
  <rect x="900" y="420" width="30" height="180" fill="#E76F55" />
  <rect x="1020" y="380" width="40" height="220" fill="#E35D6A" />
  <rect x="1120" y="450" width="30" height="150" fill="#E76F55" />
  
  <!-- Windows -->
  <rect x="110" y="440" width="10" height="15" fill="#FFF8A1" />
  <rect x="120" y="440" width="10" height="15" fill="#FFF8A1" />
  <rect x="110" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="120" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="110" y="500" width="10" height="15" fill="#FFF8A1" />
  <rect x="120" y="500" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="235" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="245" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="235" y="500" width="10" height="15" fill="#FFF8A1" />
  <rect x="245" y="500" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="390" y="420" width="10" height="15" fill="#FFF8A1" />
  <rect x="400" y="420" width="10" height="15" fill="#FFF8A1" />
  <rect x="390" y="450" width="10" height="15" fill="#FFF8A1" />
  <rect x="400" y="450" width="10" height="15" fill="#FFF8A1" />
  <rect x="390" y="480" width="10" height="15" fill="#FFF8A1" />
  <rect x="400" y="480" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="495" y="440" width="10" height="15" fill="#FFF8A1" />
  <rect x="505" y="440" width="10" height="15" fill="#FFF8A1" />
  <rect x="495" y="480" width="10" height="15" fill="#FFF8A1" />
  <rect x="505" y="480" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="585" y="400" width="10" height="15" fill="#FFF8A1" />
  <rect x="595" y="400" width="10" height="15" fill="#FFF8A1" />
  <rect x="585" y="430" width="10" height="15" fill="#FFF8A1" />
  <rect x="595" y="430" width="10" height="15" fill="#FFF8A1" />
  <rect x="585" y="460" width="10" height="15" fill="#FFF8A1" />
  <rect x="595" y="460" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="690" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="705" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="690" y="500" width="10" height="15" fill="#FFF8A1" />
  <rect x="705" y="500" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="810" y="420" width="10" height="15" fill="#FFF8A1" />
  <rect x="820" y="420" width="10" height="15" fill="#FFF8A1" />
  <rect x="810" y="450" width="10" height="15" fill="#FFF8A1" />
  <rect x="820" y="450" width="10" height="15" fill="#FFF8A1" />
  <rect x="810" y="480" width="10" height="15" fill="#FFF8A1" />
  <rect x="820" y="480" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="905" y="440" width="10" height="15" fill="#FFF8A1" />
  <rect x="915" y="440" width="10" height="15" fill="#FFF8A1" />
  <rect x="905" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="915" y="470" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="1030" y="400" width="10" height="15" fill="#FFF8A1" />
  <rect x="1040" y="400" width="10" height="15" fill="#FFF8A1" />
  <rect x="1030" y="430" width="10" height="15" fill="#FFF8A1" />
  <rect x="1040" y="430" width="10" height="15" fill="#FFF8A1" />
  <rect x="1030" y="460" width="10" height="15" fill="#FFF8A1" />
  <rect x="1040" y="460" width="10" height="15" fill="#FFF8A1" />
  
  <rect x="1125" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="1135" y="470" width="10" height="15" fill="#FFF8A1" />
  <rect x="1125" y="500" width="10" height="15" fill="#FFF8A1" />
  <rect x="1135" y="500" width="10" height="15" fill="#FFF8A1" />
  
  <!-- Trees and bushes -->
  <ellipse cx="150" cy="600" rx="30" ry="20" fill="#0D2436" />
  <ellipse cx="350" cy="600" rx="40" ry="25" fill="#0D2436" />
  <ellipse cx="550" cy="600" rx="35" ry="22" fill="#0D2436" />
  <ellipse cx="750" cy="600" rx="30" ry="20" fill="#0D2436" />
  <ellipse cx="950" cy="600" rx="40" ry="25" fill="#0D2436" />
  <ellipse cx="1150" cy="600" rx="35" ry="22" fill="#0D2436" />
  
  <!-- Footer dark area -->
  <rect x="0" y="600" width="1200" height="200" fill="#0D2436" />
</svg>`;

// Convert SVG string to base64 data URL for use in CSS
export const cityscapeBgImage = `url("data:image/svg+xml;base64,${btoa(cityscapeSvg)}")`;