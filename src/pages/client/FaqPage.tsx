import { useState } from "react";
import {
  ChevronDown,
  ShoppingBag,
  Heart,
  Truck,
  CreditCard,
} from "lucide-react";

const FAQPage = () => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: "Про Fasco",
      icon: <ShoppingBag className="w-6 h-6" />,
      questions: [
        {
          question: "Що таке Fasco?",
          answer:
            "Fasco — це сучасний інтернет-магазин одягу, де ви можете знайти стильні речі для будь-якого випадку. Ми пропонуємо широкий асортимент якісного одягу від провідних брендів за доступними цінами.",
        },
        {
          question: "Які бренди представлені в магазині?",
          answer:
            "У нашому магазині представлена велика кількість популярних та ексклюзивних брендів. Ви можете фільтрувати товари за брендами на сторінці каталогу, щоб знайти улюблені марки.",
        },
        {
          question: "Чи можу я переглядати товари без реєстрації?",
          answer:
            "Так, ви можете вільно переглядати всі товари, використовувати фільтри та пошук без реєстрації. Реєстрація потрібна лише для оформлення замовлення та збереження улюблених товарів.",
        },
      ],
    },
    {
      category: "Покупки та замовлення",
      icon: <CreditCard className="w-6 h-6" />,
      questions: [
        {
          question: "Як оформити замовлення?",
          answer:
            "Щоб оформити замовлення: додайте товари до кошика, перейдіть до кошика, перевірте обрані товари та кількість, заповніть контактні дані та адресу доставки, оберіть спосіб оплати та підтвердіть замовлення. Ви отримаете email з деталями замовлення.",
        },
        {
          question: "Як знайти потрібний товар?",
          answer:
            "Ви можете знайти товар кількома способами: використовувати пошук за назвою або артикулом, фільтрувати за категоріями (чоловічий/жіночий одяг, взуття, аксесуари), фільтрувати за розмірами, кольорами та брендами, сортувати за ціною або популярністю.",
        },
        {
          question: "Які розміри доступні?",
          answer:
            "Ми пропонуємо широкий розмірний ряд від XS до XXL. Для кожного товару є детальна розмірна сітка. Рекомендуємо уважно ознайомитися з розмірами перед замовленням.",
        },
        {
          question: "Чи можу я змінити або скасувати замовлення?",
          answer:
            "Так, ви можете змінити або скасувати замовлення протягом 1 години після оформлення, поки воно не передане до відправки. Зв'яжіться з нами через форму зворотного зв'язку або email.",
        },
        {
          question: "Як переглянути історію замовлень?",
          answer:
            "Після авторизації в особистому кабінеті ви знайдете розділ 'Мої замовлення', де відображається вся історія покупок, статуси замовлень та можливість відстежити доставку.",
        },
      ],
    },
    {
      category: "Доставка та оплата",
      icon: <Truck className="w-6 h-6" />,
      questions: [
        {
          question: "Які способи доставки доступні?",
          answer:
            "Ми пропонуємо: доставку кур'єром по місту (1-2 дні), доставку в пункти видачі (2-3 дні), доставку поштою по Україні (3-7 днів), експрес-доставку (наступний день для деяких міст).",
        },
        {
          question: "Скільки коштує доставка?",
          answer:
            "Вартість доставки залежить від способу доставки та суми замовлення. Безкоштовна доставка при замовленні від 1000 грн. Точну вартість ви побачите при оформленні замовлення.",
        },
        {
          question: "Які способи оплати приймаються?",
          answer:
            "Ми приймаємо: оплату карткою онлайн (Visa, Mastercard), готівкою при отриманні, банківський переказ, оплату через мобільні додатки (Apple Pay, Google Pay).",
        },
        {
          question: "Чи можу я оплатити при отриманні?",
          answer:
            "Так, доступна оплата готівкою або карткою при отриманні товару. Ця опція доступна для більшості способів доставки.",
        },
      ],
    },
    {
      category: "Обмін та повернення",
      icon: <Heart className="w-6 h-6" />,
      questions: [
        {
          question: "Чи можу я повернути товар?",
          answer:
            "Так, ви можете повернути товар протягом 14 днів з моменту отримання, якщо він не підійшов за розміром, кольором або з інших причин. Товар повинен бути в оригінальній упаковці з бирками.",
        },
        {
          question: "Як оформити повернення?",
          answer:
            "Для оформлення повернення: зв'яжіться з нами через особистий кабінет або email, вкажіть номер замовлення та причину повернення, отримайте інструкції щодо відправки товару назад, відправте товар за нашою адресою.",
        },
        {
          question: "Чи можу я обміняти товар на інший розмір?",
          answer:
            "Так, обмін на інший розмір можливий протягом 14 днів. Якщо потрібного розміру немає в наявності, ми оформимо повернення коштів або ви можете дочекатися надходження товару.",
        },
        {
          question: "Коли я отримаю гроші за повернення?",
          answer:
            "Кошти повертаються протягом 3-7 робочих днів після отримання нами товару та перевірки його стану. Гроші повертаються тим же способом, яким була здійснена оплата.",
        },
      ],
    },
    {
      category: "Акаунт та безпека",
      icon: <ShoppingBag className="w-6 h-6" />,
      questions: [
        {
          question: "Як зареєструватися?",
          answer:
            "Натисніть 'Реєстрація', заповніть форму з email та паролем, увійдіть в акаунт з вашими даними.",
        },
        {
          question: "Що робити, якщо забув пароль?",
          answer:
            "На сторінці входу натисніть 'Забули пароль?', введіть ваш email, перейдіть за посиланням у листі для скидання пароля, створіть новий пароль.",
        },
        {
          question: "Як змінити особисті дані?",
          answer:
            "У особистому кабінеті в розділі 'Налаштування профілю' ви можете змінити ім'я, прізвище, телефон, адресу доставки та інші особисті дані.",
        },
        {
          question: "Чи безпечно зберігати дані карти?",
          answer:
            "Ми використовуємо сучасні методи шифрування для захисту ваших даних. Інформація про платіжні карти не зберігається на наших серверах і обробляється через захищені платіжні системи.",
        },
      ],
    },
  ];

  let itemIndex = 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black border-b">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              FAQ
            </h1>
            <p className="text-xl text-gray-300 font-light">
              Відповіді на найчастіші запитання про Fasco
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className=" mx-auto  py-12">
        <div className="space-y-6">
          {faqData.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white border border-gray-200 shadow-sm"
            >
              {/* Section Header */}
              <div className="bg-black px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="text-white">{section.icon}</div>
                  <h2 className="text-xl font-semibold text-white tracking-wide">
                    {section.category}
                  </h2>
                </div>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-100">
                {section.questions.map((item) => {
                  const currentIndex = itemIndex++;
                  const isOpen = openItems.has(currentIndex);

                  return (
                    <div
                      key={currentIndex}
                      className="border-l-4 border-transparent hover:border-black transition-colors duration-200"
                    >
                      <button
                        onClick={() => toggleItem(currentIndex)}
                        className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900 pr-6 leading-tight">
                            {item.question}
                          </h3>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-8 pb-6">
                          <div className="text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-6">
                            {item.answer.includes(":") ? (
                              <div>
                                {item.answer.split(".").map((sentence, idx) => {
                                  if (sentence.trim()) {
                                    if (sentence.includes(":")) {
                                      const [before, after] =
                                        sentence.split(":");
                                      return (
                                        <div key={idx} className="mb-3">
                                          <strong className="text-black">
                                            {before}:
                                          </strong>
                                          {after && (
                                            <ul className="mt-2 ml-4 space-y-1">
                                              {after
                                                .split(",")
                                                .map((item, cartIdx) => (
                                                  <li
                                                    key={cartIdx}
                                                    className="text-sm flex items-start"
                                                  >
                                                    <span className="text-black mr-2 font-bold">
                                                      •
                                                    </span>
                                                    <span>{item.trim()}</span>
                                                  </li>
                                                ))}
                                            </ul>
                                          )}
                                        </div>
                                      );
                                    }
                                    return (
                                      <p key={idx} className="mb-2">
                                        {sentence.trim()}.
                                      </p>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            ) : (
                              <p>{item.answer}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-black text-white p-12 border">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6 tracking-tight">
              Потрібна додаткова допомога?
            </h3>
            <p className="text-gray-300 mb-8 text-lg font-light max-w-2xl mx-auto">
              Наша команда підтримки готова відповісти на всі ваші запитання
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@fasco.com"
                className="bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition-colors duration-200 border border-white"
              >
                support@fasco.com
              </a>
              <a
                href="tel:+380123456789"
                className="bg-transparent text-white px-8 py-4 font-semibold hover:bg-white hover:text-black transition-colors duration-200 border border-white"
              >
                +38 (012) 345-67-89
              </a>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-16 bg-white border border-gray-200 p-12">
          <h3 className="text-3xl font-bold text-black mb-12 text-center tracking-tight">
            Корисні поради
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-100 hover:border-gray-300 transition-colors duration-200">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-black mb-3 text-lg">
                Розмірна сітка
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Завжди перевіряйте розмірну сітку перед замовленням, щоб
                уникнути необхідності обміну
              </p>
            </div>

            <div className="text-center p-6 border border-gray-100 hover:border-gray-300 transition-colors duration-200">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-black mb-3 text-lg">
                Список бажань
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Зберігайте улюблені товари в списку бажань, щоб не втратити їх
                під час наступного відвідування
              </p>
            </div>

            <div className="text-center p-6 border border-gray-100 hover:border-gray-300 transition-colors duration-200">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-black mb-3 text-lg">
                Безкоштовна доставка
              </h4>
              <p className="text-gray-600 leading-relaxed">
                При замовленні від 1000 грн доставка по всій Україні абсолютно
                безкоштовна
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
