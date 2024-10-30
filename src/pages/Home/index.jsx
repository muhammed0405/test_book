import React, { useState } from 'react';

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        "Маркумдар үнү" аттуу китеп боюнча тест
      </h1>

      {/* Аудиокитеп бөлүгү */}
      <div className="mb-6">
        {!showVideo ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="mb-4 text-gray-600">Китепти угуу үчүн төмөнкү баскычты басыңыз:</p>
            <button 
              onClick={() => setShowVideo(true)}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Китепти угуу
            </button>
          </div>
        ) : (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl relative">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Маркумдар үнү - Аудиокитеп</h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  X
                </button>
              </div>
              <div className="relative pt-[56.25%]">
                {/* YouTube видеосун жүктөө */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/results?search_query=%D0%BC%D0%B0%D1%80%D0%BA%D1%83%D0%BC%D0%B4%D0%B0%D1%80+%D1%83%D0%BD%D1%83" // VIDEO_ID дегенди конкреттүү видеонун ID'си менен алмаштырыңыз
                  title="Маркумдар үнү - Аудиокитеп"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={() => setShowVideo(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Башкы бетке кайтуу
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Кошумча маалымат */}
      <div className="bg-white p-4 rounded-md mb-6">
        <p className="mb-2">
          Саламатсызбы окуучу,{ " " }
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
        <li>Саат 13:00 дө баардык окуучу тестти баштоо керек. Кечиксе кайра тапшырганга болбойт.</li>
        <li>Бир суроого бир мүнөт убакыт берилет. Жооп бере албай калсаңыз, жооп туура эмес болуп саналат.</li>
        <li>Артка кайтып суроонун жообун өзгөртө албайсыз. Жооп берерден алдын жакшылап ойлонуп жооп бериңиз.</li>
        <li>Жыйынтык тест бүткөндөн кийин бир жарым сааттан кийин маалым болот.</li>
        <li>Мыктыны аныктоо үчүн биринчи туура жооп берген балына карайт, андан кийин бат жооп бергенине карайт.</li>
        <li>Эгерде бир орунга бир нече окуучу болуп калса, анда чүчү-кулак тартылат (жеребьевка).</li>
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