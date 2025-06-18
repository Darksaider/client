export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-black mb-4">404</h1>
        <h2 className="text-2xl font-medium text-black mb-6">
          Сторінку не знайдено
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
        >
          Повернутися назад
        </button>
      </div>
    </div>
  );
}
