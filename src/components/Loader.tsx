export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Spinning ring */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-orange-400 rounded-full opacity-25"></div>
        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
