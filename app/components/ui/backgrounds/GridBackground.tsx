export default function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gray-950">
      {/* Morphing Gradient Blob 1 - Purple */}
      <div
        className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full opacity-30 animate-blob"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "blob 12s ease-in-out infinite",
        }}
      />

      {/* Morphing Gradient Blob 2 - Purple/Pink */}
      <div
        className="absolute right-0 top-1/4 h-[450px] w-[450px] rounded-full opacity-25 animate-blob"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
          filter: "blur(70px)",
          animation: "blob 16s ease-in-out infinite 2s",
        }}
      />

      {/* Morphing Gradient Blob 3 - Accent */}
      <div
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-20 animate-blob"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "blob 14s ease-in-out infinite 4s",
        }}
      />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-400/20"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.3 + 0.2,
          }}
        />
      ))}
    </div>
  );
}
