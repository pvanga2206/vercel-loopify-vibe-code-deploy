export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black border-b border-white/5">
      <a href="/" className="text-white font-bold text-lg tracking-wider">
        XTRACT
      </a>

      <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
        <a href="#" className="hover:text-white transition-colors">Home</a>
        <a href="#about" className="hover:text-white transition-colors">About</a>
        <a href="#blog" className="hover:text-white transition-colors">Blog</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
      </div>

      <a
        href="#contact"
        className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white overflow-hidden group"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <span className="relative z-10 group-hover:translate-x-0.5 transition-transform">Book a call</span>
        <span className="relative z-10 text-xs opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(129,74,200,0.2)' }}
        />
      </a>
    </nav>
  )
}
