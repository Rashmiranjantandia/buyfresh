export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin"></div>
        <div className="absolute inset-3 rounded-full bg-green-50 flex items-center justify-center">
          <span className="text-lg">🛒</span>
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium">{message}</p>
    </div>
  );
}
