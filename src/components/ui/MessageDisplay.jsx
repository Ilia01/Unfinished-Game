/**
 * Message Display Component
 * Shows AI-generated messages with loading state
 */

export function MessageDisplay({ message, loading, fadeIn }) {
  if (!message) return null;

  return (
    <div className={`max-w-2xl mx-auto w-full px-2 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-slate-800/50 backdrop-blur rounded-lg p-4 sm:p-5 md:p-6 border border-slate-700">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
          </div>
        ) : (
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed text-center italic">
            "{message}"
          </p>
        )}
      </div>
    </div>
  );
}
