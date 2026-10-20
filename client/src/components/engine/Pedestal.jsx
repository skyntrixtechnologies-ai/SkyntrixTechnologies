// Futuristic 3D reactor base — fills its parent (which should be a wide,
// short box, e.g. `aspect-[2.2/1]`, positioned under the sphere).
export default function Pedestal() {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      {/* Under-glow */}
      <div className="absolute -inset-x-[10%] -bottom-[20%] top-[-10%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.5),rgba(37,99,235,0.2),transparent_70%)] blur-xl" />

      {/* Bottom base */}
      <div className="absolute inset-x-0 bottom-[4%] h-[72%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_32%,#4338CA,#312E81_52%,#0F172A_100%)] shadow-[0_18px_40px_-12px_rgba(30,27,75,0.7)]" />

      {/* Mid platform */}
      <div className="absolute inset-x-[5%] bottom-[13%] h-[56%] rounded-[50%] border border-white/5 bg-[radial-gradient(ellipse_at_50%_32%,#5B21B6,#4C1D95_55%,#312E81_100%)]" />

      {/* Upper platform */}
      <div className="absolute inset-x-[10%] bottom-[23%] h-[42%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_34%,#6D28D9,#4C1D95_60%,#312E81_100%)]" />

      {/* Neon rim ring */}
      <div className="absolute inset-x-[10%] bottom-[23%] h-[42%] rounded-[50%] bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 p-[1.5px] shadow-[0_0_28px_rgba(129,140,248,0.65)]">
        <div className="h-full w-full rounded-[50%] bg-[radial-gradient(ellipse_at_50%_36%,#4C1D95,#2E1065_65%,#1E1B4B_100%)]" />
      </div>

      {/* Light reflection cast on the platform surface */}
      <div className="absolute inset-x-[16%] bottom-[28%] h-[30%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(196,181,253,0.35),rgba(196,181,253,0.08),transparent_75%)] blur-[2px]" />
    </div>
  );
}
