'use client'

export default function Galaxy() {
  return (
    <div className="galaxy-container">
      {/* Twinkling stars background */}
      <div className="stars-layer stars-small" />
      <div className="stars-layer stars-medium" />
      <div className="stars-layer stars-large" />

      {/* Central galaxy core */}
      <div className="galaxy-core">
        {/* Milky Way nebula glow */}
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />

        {/* Rotating loop orbits */}
        <div className="orbit-ring orbit-1">
          <div className="orbit-particle" />
          <div className="orbit-particle orbit-particle-delay" />
        </div>
        <div className="orbit-ring orbit-2">
          <div className="orbit-particle" />
          <div className="orbit-particle orbit-particle-delay" />
        </div>
        <div className="orbit-ring orbit-3">
          <div className="orbit-particle" />
          <div className="orbit-particle orbit-particle-delay" />
          <div className="orbit-particle orbit-particle-delay-2" />
        </div>
        <div className="orbit-ring orbit-4">
          <div className="orbit-particle" />
        </div>

        {/* Infinity/Loop shape */}
        <div className="loop-shape">
          <div className="loop-half loop-left" />
          <div className="loop-half loop-right" />
        </div>

        {/* Core bright center */}
        <div className="galaxy-center-glow" />
        <div className="galaxy-center-dot" />
      </div>
    </div>
  )
}
