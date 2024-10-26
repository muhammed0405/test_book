import React from 'react';

export default function Home() {
  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        "Маркумдар үнү" аттуу китеп боюнча тест
      </h1>

      {/* Audio book button */}
      <div className="mb-6 flex justify-center">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="mb-4 text-gray-600">Китепти угуу үчүн төмөнкү баскычты басыңыз:</p>
          <a 
            href="https://www.youtube.com/results?search_query=%D0%BC%D0%B0%D1%80%D0%BA%D1%83%D0%BC%D0%B4%D0%B0%D1%80+%D1%83%D0%BD%D1%83" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
            </svg>
            Китепти угуу
          </a>
          <p className="mt-2 text-sm text-gray-500">
            (Жаңы вкладкада ачылат)
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md mb-6">
        <p className="mb-2">
          Саламатсызбы окуучу,{" "}
          <span className="font-semibold">27-октябрда саат 13:00</span> Китеп
          боюнча экзамен болот.
        </p>
        <p className="mb-2">
          Экзаменге катышуу үчүн{" "}
          <span className="font-semibold text-red-600">25-октябрга чейин</span>{" "}
          ушул сайтка катталышыңыз керек.
        </p>
        <p className="bg-yellow-100 p-2 rounded-md text-yellow-800">
          <span className="font-bold">Эскертүү!</span> Эгерде катталбасаңыз
          тестке катыша албайсыз!
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-3 text-green-700">
        Тест кандай түрдө болот:
      </h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>
          Саат 13:00 дө баардык окуучу тестти баштоо керек. Кечиксе кайра
          тапшырганга болбойт.
        </li>
        <li>
          Бир суроого бир мүнөт убакыт берилет. Жооп бере албай калсаңыз, жооп
          туура эмес болуп саналат.
        </li>
        <li>
          Артка кайтып суроонун жообун өзгөртө албайсыз. Жооп берерден алдын
          жакшылап ойлонуп жооп бериңиз.
        </li>
        <li>
          Жыйынтык тест бүткөндөн кийин бир жарым сааттан кийин маалым болот.
        </li>
        <li>
          Мыктыны аныктоо үчүн биринчи туура жооп берген балына карайт, андан
          кийин бат жооп бергенине карайт.
        </li>
        <li>
          Эгерде бир орунга бир нече окуучу болуп калса, анда чүчү-кулак
          тартылат (жеребьевка).
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-center text-purple-700">
        Тестти ийгиликтүү тапшырып алыңыз!
      </h3>

      <div className="mt-6 bg-blue-100 p-4 rounded-md">
        <p className="font-semibold text-blue-800">Даярдануу сунуштары:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-blue-700">
          <li>Китепти кайрадан окуп чыгыңыз</li>
          <li>Негизги окуяларды жана каармандарды эстеп калыңыз</li>
          <li>Тесттин форматына көнүү үчүн практикалык суроолорду чечиңиз</li>
          <li>Тест күнү жетиштүү уйку алып, жакшы тамактаныңыз</li>
        </ul>
      </div>
    </div>
  );
}