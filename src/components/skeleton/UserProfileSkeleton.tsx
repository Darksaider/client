export const SkeletonLoadingProfile = () => {
  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        {/* Title */}
        <div className="h-8 w-48 bg-gray-200 rounded" />

        {/* Main info box */}
        <div className="border rounded p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-200" />
              <div className="w-32 h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="border rounded p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded w-40" />
        </div>

        {/* Account info */}
        <div className="border rounded p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
};
