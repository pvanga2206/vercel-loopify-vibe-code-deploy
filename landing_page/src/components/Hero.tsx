const STARS = [
  { top: '8%', left: '12%', size: 2, delay: '0s', dur: '2.5s' },
  { top: '15%', left: '28%', size: 1.5, delay: '0.4s', dur: '3.1s' },
  { top: '5%', left: '45%', size: 1, delay: '1.2s', dur: '2.0s' },
  { top: '11%', left: '67%', size: 2, delay: '0.7s', dur: '3.5s' },
  { top: '19%', left: '82%', size: 1.5, delay: '1.5s', dur: '2.8s' },
  { top: '3%', left: '91%', size: 1, delay: '0.2s', dur: '2.3s' },
  { top: '28%', left: '5%', size: 1.5, delay: '0.9s', dur: '3.0s' },
  { top: '35%', left: '18%', size: 1, delay: '1.8s', dur: '2.6s' },
  { top: '22%', left: '35%', size: 1, delay: '0.3s', dur: '3.2s' },
  { top: '40%', left: '8%', size: 2, delay: '1.1s', dur: '2.4s' },
  { top: '48%', left: '22%', size: 1, delay: '0.6s', dur: '3.8s' },
  { top: '55%', left: '14%', size: 1.5, delay: '2.0s', dur: '2.1s' },
  { top: '62%', left: '30%', size: 1, delay: '0.8s', dur: '3.4s' },
  { top: '70%', left: '7%', size: 2, delay: '1.4s', dur: '2.7s' },
  { top: '78%', left: '20%', size: 1, delay: '0.1s', dur: '3.6s' },
  { top: '85%', left: '35%', size: 1.5, delay: '1.7s', dur: '2.2s' },
  { top: '92%', left: '15%', size: 1, delay: '0.5s', dur: '3.0s' },
  { top: '25%', left: '72%', size: 1, delay: '1.3s', dur: '2.9s' },
  { top: '33%', left: '88%', size: 1.5, delay: '0.0s', dur: '3.3s' },
  { top: '42%', left: '76%', size: 2, delay: '1.6s', dur: '2.5s' },
  { top: '50%', left: '92%', size: 1, delay: '0.4s', dur: '3.7s' },
  { top: '58%', left: '82%', size: 1.5, delay: '1.9s', dur: '2.0s' },
  { top: '66%', left: '70%', size: 1, delay: '0.7s', dur: '3.1s' },
  { top: '74%', left: '86%', size: 2, delay: '1.2s', dur: '2.6s' },
  { top: '82%', left: '60%', size: 1, delay: '0.3s', dur: '3.9s' },
  { top: '88%', left: '78%', size: 1.5, delay: '1.0s', dur: '2.3s' },
  { top: '95%', left: '90%', size: 1, delay: '1.8s', dur: '3.4s' },
  { top: '7%', left: '55%', size: 1.5, delay: '0.6s', dur: '2.8s' },
  { top: '13%', left: '40%', size: 1, delay: '2.1s', dur: '3.0s' },
  { top: '20%', left: '95%', size: 2, delay: '0.9s', dur: '2.5s' },
  { top: '45%', left: '48%', size: 1, delay: '1.5s', dur: '3.6s' },
  { top: '72%', left: '45%', size: 1.5, delay: '0.2s', dur: '2.9s' },
  { top: '90%', left: '55%', size: 1, delay: '1.3s', dur: '3.2s' },
  { top: '38%', left: '60%', size: 1.5, delay: '0.8s', dur: '2.4s' },
  { top: '60%', left: '52%', size: 1, delay: '1.6s', dur: '3.5s' },
  { top: '30%', left: '50%', size: 1, delay: '0.1s', dur: '2.7s' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden bg-black">

      {/* Twinkling star field */}
      {STARS.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'white',
            boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,0.8)`,
            animation: `${i % 2 === 0 ? 'twinkle' : 'twinkle-alt'} ${star.dur} ${star.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Milky Way Galaxy — centered behind title, rotating layers */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          zIndex: 1,
        }}
      >
        {/* Layer 1: Outermost halo — very slow rotation */}
        <div style={{ position: 'absolute', inset: 0, animation: 'galaxy-rotate 80s linear infinite' }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(129,74,200,0.10) 15%, rgba(160,90,230,0.18) 28%, rgba(180,110,255,0.12) 40%, transparent 55%, rgba(80,46,123,0.08) 70%, rgba(140,80,220,0.15) 82%, transparent 100%)',
            filter: 'blur(22px)',
          }} />
        </div>

        {/* Layer 2: Mid disk — medium rotation */}
        <div style={{ position: 'absolute', inset: '100px', animation: 'galaxy-rotate 45s linear infinite' }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 90deg, transparent 0%, rgba(160,90,230,0.30) 20%, rgba(200,130,255,0.38) 35%, rgba(129,74,200,0.25) 50%, transparent 65%, rgba(100,55,180,0.25) 80%, rgba(180,110,255,0.32) 92%, transparent 100%)',
            filter: 'blur(14px)',
          }} />
        </div>

        {/* Layer 3: Inner spiral arms — faster rotation */}
        <div style={{ position: 'absolute', inset: '200px', animation: 'galaxy-rotate 28s linear infinite' }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 180deg, transparent 0%, rgba(200,140,255,0.55) 18%, rgba(220,160,255,0.65) 30%, rgba(160,90,230,0.45) 45%, transparent 60%, rgba(180,110,255,0.50) 76%, rgba(210,150,255,0.60) 88%, transparent 100%)',
            filter: 'blur(8px)',
          }} />
        </div>

        {/* Layer 4: Reverse slow halo */}
        <div style={{ position: 'absolute', inset: '-100px', animation: 'galaxy-rotate-reverse 100s linear infinite' }}>
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 270deg, transparent 0%, rgba(80,46,123,0.08) 25%, rgba(129,74,200,0.12) 45%, transparent 60%, rgba(100,55,180,0.10) 80%, transparent 100%)',
            filter: 'blur(30px)',
          }} />
        </div>

        {/* Core bright center — pulsing */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '130px', height: '130px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,210,255,1) 0%, rgba(190,130,255,0.85) 25%, rgba(129,74,200,0.5) 55%, transparent 80%)',
          filter: 'blur(8px)',
          animation: 'galaxy-pulse 3s ease-in-out infinite',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">

        {/* Badge */}
        <div
          className="flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full text-sm"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 0 16px rgba(129,74,200,0.3)',
          }}
        >
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ background: '#814AC8' }}
          >
            New
          </span>
          <span className="text-white/70 text-sm">Automated Lead Generation</span>
        </div>

        {/* Main Heading */}
        <h1
          className="font-semibold text-white mb-6 leading-tight"
          style={{
            fontSize: 'clamp(42px, 6vw, 70px)',
            lineHeight: '1.1',
            letterSpacing: '-2.2px',
          }}
        >
          Intelligent Automation<br />
          for Modern Businesses.
        </h1>

        {/* Subheading */}
        <p className="text-white/50 text-lg mb-10 max-w-xl leading-relaxed">
          <span className="text-white/90 font-medium">Xtract</span>{' '}
          brings{' '}
          <span className="text-white/90">AI automation</span>{' '}
          to your fingertips &amp; streamline tasks.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-14">
          <a
            href="#contact"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #814AC8 0%, #502E7B 100%)',
              boxShadow: '0 4px 24px rgba(129,74,200,0.35)',
            }}
          >
            Get in touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H6M12 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a
            href="#services"
            className="px-7 py-3.5 rounded-full text-sm font-medium text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.2)' }}
          >
            View services
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[
              { bg: '#814AC8', letter: 'A' },
              { bg: '#502E7B', letter: 'B' },
              { bg: '#663C9D', letter: 'C' },
              { bg: '#9B5FDB', letter: 'D' },
            ].map((avatar, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-black"
                style={{ background: avatar.bg }}
              >
                {avatar.letter}
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm">
            Over <span className="text-white/80 font-semibold">50+ businesses</span> trust us
          </p>
        </div>
      </div>
    </section>
  )
}
