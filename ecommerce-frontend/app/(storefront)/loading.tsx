export default function StorefrontLoading() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Heading skeleton */}
        <div className="mb-8">
          <div className="h-8 w-52 bg-gray-200 rounded-xl mb-2" />
          <div className="h-4 w-36 bg-gray-100 rounded-lg" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="flex justify-between items-center pt-1">
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded-xl w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
