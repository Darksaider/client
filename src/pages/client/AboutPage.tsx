export const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Про наш магазин</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Ласкаво просимо до онлайн-простору сучасного стилю та якісного одягу.
        </p>
      </div>

      {/* Концепція магазину */}
      <div className="flex flex-col md:flex-row gap-12 mb-16 items-center">
        <div className="w-full md:w-1/2 bg-gray-100 h-96 flex items-center justify-center">
          <p className="text-gray-500 text-lg">[Зображення: Колекція одягу]</p>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Наша концепція</h2>
          <p className="text-gray-700 mb-4">
            Наш інтернет-магазин створений для тих, хто цінує якість, стиль та
            зручність. Ми ретельно підбираємо асортимент від різних виробників,
            щоб запропонувати вам найкращі моделі одягу в різних цінових
            категоріях.
          </p>
          <p className="text-gray-700">
            Наша місія — зробити процес вибору та купівлі одягу максимально
            простим та приємним. Ми прагнемо, щоб кожен клієнт знайшов саме те,
            що шукає, та залишився задоволеним якістю товару та сервісу.
          </p>
        </div>
      </div>

      {/* Наші цінності */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Наші принципи</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Якість</h3>
            <p className="text-gray-700">
              Ми пропонуємо тільки якісний одяг від перевірених виробників.
              Кожен товар проходить контроль якості перед тим, як потрапити до
              вас.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Сервіс</h3>
            <p className="text-gray-700">
              Зручний каталог, детальні описи товарів, швидка обробка замовлень
              — все це створено для вашого комфорту. Ми дбаємо про кожного
              клієнта.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Доступність</h3>
            <p className="text-gray-700">
              Ми пропонуємо товари в різних цінових категоріях, щоб кожен міг
              знайти щось для себе. Регулярні акції та знижки роблять покупки ще
              приємнішими.
            </p>
          </div>
        </div>
      </div>

      {/* Наші переваги */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Чому обирають нас
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <p className="text-gray-500">[Іконка]</p>
            </div>
            <h3 className="text-lg font-bold mb-2">Швидка доставка</h3>
            <p className="text-gray-700">
              Відправляємо замовлення протягом 24 годин з моменту оплати
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <p className="text-gray-500">[Іконка]</p>
            </div>
            <h3 className="text-lg font-bold mb-2">Гарантія якості</h3>
            <p className="text-gray-700">
              Повернення або обмін товару протягом 14 днів
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <p className="text-gray-500">[Іконка]</p>
            </div>
            <h3 className="text-lg font-bold mb-2">Зручна оплата</h3>
            <p className="text-gray-700">
              Різні способи оплати для вашої зручності
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <p className="text-gray-500">[Іконка]</p>
            </div>
            <h3 className="text-lg font-bold mb-2">Підтримка</h3>
            <p className="text-gray-700">
              Допомога у виборі та консультація з будь-яких питань
            </p>
          </div>
        </div>
      </div>

      {/* Як ми працюємо */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Як ми працюємо</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-2">Вибір товару</h3>
            <p className="text-gray-700">
              Оберіть потрібні вам речі з нашого каталогу, використовуючи зручні
              фільтри та пошук
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-2">Оформлення замовлення</h3>
            <p className="text-gray-700">
              Додайте товари до кошика, вкажіть адресу доставки та оберіть
              зручний спосіб оплати
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-2">Отримання</h3>
            <p className="text-gray-700">
              Отримайте ваше замовлення у відділенні пошти або за допомогою
              кур'єрської доставки
            </p>
          </div>
        </div>
      </div>

      {/* Контакти CTA */}
      <div className="bg-gray-100 p-12 text-center rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Зв'яжіться з нами</h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Маєте питання щодо товарів чи доставки? Потрібна допомога з вибором?
          Завжди раді вам допомогти!
        </p>
        <button className="bg-black text-white py-3 px-8 rounded-md font-medium hover:bg-gray-800 transition-colors">
          Напишіть нам
        </button>
      </div>
    </div>
  );
};
