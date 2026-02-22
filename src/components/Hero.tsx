export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden bg-black">
      {/* Radial purple glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(129,74,200,0.28) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

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
            className="px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #814AC8 0%, #502E7B 100%)',
              boxShadow: '0 4px 24px rgba(129,74,200,0.35)',
            }}
          >
            Get in touch
          </a>

          <a
            href="#services"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            View services
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          {/* Avatar stack */}
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

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
        }}
      />
    </section>
  )
}
