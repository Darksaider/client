import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  Eye,
  FileText,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string | null) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: "general",
      title: "1. ЗАГАЛЬНІ ПОЛОЖЕННЯ",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Цей документ є офіційною Політикою конфіденційності ТОВ "Фаско"
            (далі - "Компанія", "ми", "наш"), що регулює збір, обробку,
            зберігання та використання персональних даних користувачів
            інтернет-магазину fasco.ua (далі - "Сайт", "Платформа").
          </p>
          <p className="text-gray-700 leading-relaxed">
            Дана Політика розроблена відповідно до Закону України "Про захист
            персональних даних", Регламенту ЄС про захист даних (GDPR) та інших
            чинних нормативно-правових актів.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-blue-800 font-medium">
              Використання Сайту означає повну та беззастережну згоду з умовами
              цієї Політики конфіденційності.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "data-collection",
      title: "2. КАТЕГОРІЇ ПЕРСОНАЛЬНИХ ДАНИХ",
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-green-400 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              2.1 Ідентифікаційні дані:
            </h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Прізвище, ім'я, по батькові</li>
              <li>• Дата народження</li>
              <li>• Стать</li>
              <li>• Громадянство</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-400 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              2.2 Контактні дані:
            </h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Адреса електронної пошти</li>
              <li>• Номер мобільного/стаціонарного телефону</li>
              <li>• Поштова адреса</li>
              <li>• Адреса доставки</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-400 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              2.3 Платіжні дані (через Stripe):
            </h4>
            <ul className="text-gray-700 space-y-1">
              <li>• Токенізовані дані платіжних карток</li>
              <li>• Історія транзакцій</li>
              <li>• Billing-адреса</li>
              <li>• Валюта платежу</li>
            </ul>
            <div className="mt-3 bg-purple-50 p-3 rounded">
              <p className="text-purple-800 text-sm">
                <strong>Важливо:</strong> Повні дані платіжних карток
                зберігаються виключно в системі Stripe і не передаються на наші
                сервери. Ми отримуємо лише токени для обробки платежів.
              </p>
            </div>
          </div>

          <div className="border-l-4 border-orange-400 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              2.4 Технічні дані:
            </h4>
            <ul className="text-gray-700 space-y-1">
              <li>• IP-адреса та геолокація</li>
              <li>• Дані про браузер та операційну систему</li>
              <li>• Час сесії та активність на сайті</li>
              <li>• Referrer URL</li>
              <li>• Унікальні ідентифікатори пристрою</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "legal-basis",
      title: "3. ПРАВОВІ ПІДСТАВИ ОБРОБКИ",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Обробка персональних даних здійснюється на підставі наступних
            правових підстав:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                Згода суб'єкта даних
              </h4>
              <p className="text-green-700 text-sm">
                Добровільна, конкретна, інформована та недвозначна згода на
                обробку персональних даних
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Виконання договору
              </h4>
              <p className="text-blue-700 text-sm">
                Обробка необхідна для виконання договору купівлі-продажу та
                надання послуг
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">
                Правові зобов'язання
              </h4>
              <p className="text-purple-700 text-sm">
                Виконання вимог податкового, бухгалтерського та іншого
                законодавства
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">
                Законні інтереси
              </h4>
              <p className="text-orange-700 text-sm">
                Захист від шахрайства, покращення якості послуг, технічна
                підтримка
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "stripe-integration",
      title: "4. ІНТЕГРАЦІЯ З STRIPE",
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              Безпека платежів через Stripe
            </h4>
            <p className="text-gray-700 mb-4">
              Наш сайт використовує платіжну систему Stripe Inc. для обробки
              всіх фінансових транзакцій. Stripe є сертифікованим постачальником
              платіжних послуг рівня 1 PCI DSS.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">
              4.1 Обробка платіжних даних:
            </h4>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>
                • Дані платіжних карток передаються безпосередньо до серверів
                Stripe через зашифровані канали
              </li>
              <li>
                • Компанія не зберігає та не має доступу до повних номерів
                карток
              </li>
              <li>
                • Використовуються токени для ідентифікації платіжних методів
              </li>
              <li>
                • Дотримуються стандарти PCI DSS для захисту платіжної
                інформації
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">
              4.2 Дані, які передаються Stripe:
            </h4>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>• Інформація про замовлення (сума, валюта, опис)</li>
              <li>• Billing-адреса покупця</li>
              <li>• Email для відправки чеків</li>
              <li>• Метадані транзакції</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-yellow-800">
              <strong>Зверніть увагу:</strong> Політика конфіденційності Stripe
              доступна за адресою:
              <a
                href="https://stripe.com/privacy"
                className="text-blue-600 underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://stripe.com/privacy
              </a>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "user-rights",
      title: "5. ПРАВА СУБ'ЄКТІВ ПЕРСОНАЛЬНИХ ДАНИХ",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Відповідно до чинного законодавства, ви маєте наступні права щодо
            ваших персональних даних:
          </p>

          <div className="grid gap-4">
            {[
              {
                title: "Право на доступ",
                description:
                  "Отримати підтвердження обробки ваших даних та копію персональних даних",
                color: "blue",
              },
              {
                title: "Право на виправлення",
                description:
                  "Вимагати виправлення неточних або доповнення неповних персональних даних",
                color: "green",
              },
              {
                title: "Право на видалення",
                description:
                  "Вимагати видалення персональних даних за певних обставин",
                color: "red",
              },
              {
                title: "Право на обмеження обробки",
                description:
                  "Вимагати обмеження обробки ваших персональних даних",
                color: "orange",
              },
              {
                title: "Право на переносимість даних",
                description:
                  "Отримати ваші дані у структурованому, широко використовуваному форматі",
                color: "purple",
              },
              {
                title: "Право на заперечення",
                description:
                  "Заперечити проти обробки персональних даних з певних підстав",
                color: "indigo",
              },
            ].map((right, index) => (
              <div
                key={index}
                className={`bg-${right.color}-50 p-4 rounded-lg border-l-4 border-${right.color}-400`}
              >
                <h4 className={`font-semibold text-${right.color}-800 mb-2`}>
                  {right.title}
                </h4>
                <p className={`text-${right.color}-700 text-sm`}>
                  {right.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">
              Процедура реалізації прав:
            </h4>
            <ol className="text-gray-700 space-y-1 ml-4">
              <li>
                1. Подати письмовий запит на електронну адресу: privacy@fasco.ua
              </li>
              <li>2. Надати документи для підтвердження особи</li>
              <li>3. Вказати конкретне право, яке ви бажаєте реалізувати</li>
              <li>4. Очікувати відповідь протягом 30 календарних днів</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "data-retention",
      title: "6. СТРОКИ ЗБЕРІГАННЯ ПЕРСОНАЛЬНИХ ДАНИХ",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Категорія даних
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Строк зберігання
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Правова підстава
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">
                    Дані про замовлення та покупки
                  </td>
                  <td className="border border-gray-300 p-3">3 роки</td>
                  <td className="border border-gray-300 p-3">
                    Виконання гарантійних зобов'язань
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">
                    Фінансові документи
                  </td>
                  <td className="border border-gray-300 p-3">5 років</td>
                  <td className="border border-gray-300 p-3">
                    Податкове законодавство
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">
                    Дані для маркетингу
                  </td>
                  <td className="border border-gray-300 p-3">
                    До відкликання згоди
                  </td>
                  <td className="border border-gray-300 p-3">
                    Згода користувача
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3">Технічні логи</td>
                  <td className="border border-gray-300 p-3">12 місяців</td>
                  <td className="border border-gray-300 p-3">
                    Безпека та технічна підтримка
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">
                    Дані платіжних токенів Stripe
                  </td>
                  <td className="border border-gray-300 p-3">
                    До видалення користувачем
                  </td>
                  <td className="border border-gray-300 p-3">
                    Зручність майбутніх платежів
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "7. ЗАХОДИ БЕЗПЕКИ",
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Технічні заходи:</h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  SSL/TLS шифрування (HTTPS)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Шифрування бази даних
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Регулярне резервне копіювання
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Системи виявлення вторгнень
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Автоматичні оновлення безпеки
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">
                Організаційні заходи:
              </h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Обмежений доступ до даних
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Навчання персоналу
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Регулярний аудит безпеки
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Політики інформаційної безпеки
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  Протоколи реагування на інциденти
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800 mb-2">
              Повідомлення про порушення безпеки:
            </h4>
            <p className="text-red-700">
              У випадку порушення безпеки персональних даних, ми зобов'язуємося
              повідомити відповідні наглядові органи протягом 72 годин та
              користувачів - без невиправданої затримки.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "8. КОНТАКТНА ІНФОРМАЦІЯ",
      icon: <Phone className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">
              Контроллер персональних даних:
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">ТОВ "Фаско"</p>
                  <p className="text-gray-600 text-sm">Код ЄДРПОУ: [Ваш код]</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-700">[Юридична адреса]</p>
                  <p className="text-gray-600 text-sm">Україна</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-800">
                  Електронна пошта
                </h4>
              </div>
              <p className="text-gray-700">privacy@fasco.ua</p>
              <p className="text-gray-600 text-sm mt-1">
                Для питань щодо персональних даних
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center mb-3">
                <Phone className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-800">Телефон</h4>
              </div>
              <p className="text-gray-700">+380 (XX) XXX-XX-XX</p>
              <p className="text-gray-600 text-sm mt-1">Пн-Пт: 9:00-18:00</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Відповідальна особа за захист персональних даних:
            </h4>
            <p className="text-yellow-700">
              [Ім'я Прізвище], посада: Керівник відділу інформаційної безпеки
            </p>
            <p className="text-yellow-700">Email: dpo@fasco.ua</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className=" mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Інтернет-магазин Fasco</p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-blue-700">
            Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  {section.icon}
                </div>
                <span className="font-semibold text-gray-800">
                  {section.title}
                </span>
              </div>
              {activeSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {activeSection === section.id && (
              <div className="px-6 py-6 bg-white border-t border-gray-200">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Важлива інформація
            </h3>
            <p className="text-blue-800 leading-relaxed">
              Використовуючи наш веб-сайт та послуги, ви підтверджуєте, що
              ознайомилися з цією Політикою конфіденційності та надаєте згоду на
              обробку ваших персональних даних відповідно до описаних умов. Дана
              політика набуває чинності з моменту її публікації на офіційному
              веб-сайті Компанії.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
