interface Pin {
  price: number
  top: string
  left: string
}

const pins: Pin[] = [
  { price: 1200, top: "22%", left: "18%" },
  { price: 1750, top: "38%", left: "12%" },
  { price: 2100, top: "15%", left: "55%" },
  { price: 2400, top: "48%", left: "45%" },
  { price: 2800, top: "30%", left: "70%" },
  { price: 3200, top: "62%", left: "28%" },
  { price: 3450, top: "55%", left: "80%" },
  { price: 3750, top: "72%", left: "60%" },
  { price: 4200, top: "10%", left: "78%" },
]

export default function MapPanel() {
  return (
    <div className="w-full h-[calc(100vh-90px)] bg-[#E8E6E1] rounded-l-3xl overflow-hidden relative">
      {/* Architectural grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(17,17,17,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17,17,17,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Diagonal architectural lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#111" strokeWidth="1" />
        <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#111" strokeWidth="0.5" />
        <line x1="50%" y1="0" x2="30%" y2="100%" stroke="#111" strokeWidth="0.5" />
        <line x1="80%" y1="0" x2="0" y2="100%" stroke="#111" strokeWidth="0.5" />
        <line x1="0" y1="50%" x2="100%" y2="30%" stroke="#111" strokeWidth="0.5" />
        <line x1="0" y1="80%" x2="100%" y2="10%" stroke="#111" strokeWidth="0.5" />
      </svg>

      {/* Organic street-like curves */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 500 500" preserveAspectRatio="none">
        <path d="M0,200 Q150,180 250,220 T500,180" fill="none" stroke="#111" strokeWidth="2" />
        <path d="M0,350 Q100,320 200,360 T500,300" fill="none" stroke="#111" strokeWidth="2" />
        <path d="M150,0 Q180,100 140,200 T200,500" fill="none" stroke="#111" strokeWidth="2" />
        <path d="M350,0 Q320,150 360,250 T300,500" fill="none" stroke="#111" strokeWidth="1.5" />
      </svg>

      {/* Block blobs */}
      <div className="absolute top-[10%] left-[8%] w-[22%] h-[18%] bg-[#D4D2CC] rounded-lg opacity-40" />
      <div className="absolute top-[35%] left-[5%] w-[18%] h-[25%] bg-[#D4D2CC] rounded-lg opacity-30" />
      <div className="absolute top-[8%] left-[40%] w-[28%] h-[15%] bg-[#D4D2CC] rounded-lg opacity-35" />
      <div className="absolute top-[45%] left-[35%] w-[20%] h-[20%] bg-[#D4D2CC] rounded-lg opacity-30" />
      <div className="absolute top-[25%] left-[65%] w-[15%] h-[22%] bg-[#D4D2CC] rounded-lg opacity-25" />
      <div className="absolute top-[55%] left-[55%] w-[25%] h-[18%] bg-[#D4D2CC] rounded-lg opacity-30" />
      <div className="absolute top-[70%] left-[10%] w-[30%] h-[15%] bg-[#D4D2CC] rounded-lg opacity-25" />

      {/* Price Pins */}
      {pins.map((pin, i) => (
        <button
          key={i}
          style={{ top: pin.top, left: pin.left }}
          className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-md border border-white/40 px-3 py-1.5 rounded-full font-['Inter'] font-bold text-xs text-[#111111] tracking-tight hover:bg-[#111111] hover:text-white transition-all cursor-pointer z-10"
        >
          ${pin.price.toLocaleString()}
        </button>
      ))}
    </div>
  )
}
