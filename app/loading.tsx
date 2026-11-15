export default function RootLoading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Top indeterminate progress line */}
      <div className="h-1 bg-[#112040] overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#7C3AED] via-[#3B82F6] to-[#60A5FA] w-full animate-pulse" />
      </div>
    </div>
  );
}
