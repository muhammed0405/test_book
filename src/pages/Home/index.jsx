import { useState } from "react";
import { FaYoutube } from "react-icons/fa";
export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    {
      id: "Jq4ZgyOGug4",
      title: "1-бөлүм",
      duration: "2:55:45",
    },
    {
      id: "JBgWwPwZEqo",
      title: "2-бөлүм",
      duration: "3:07:27",
    },
    {
      id: "Siuy90j4y_0",
      title: "3-бөлүм",
      duration: "1:36:33",
    },
    {
      id: "Skl0q9-IWZM",
      title: "4-бөлүм",
      duration: "3:24:31",
    },
    {
      id: "DIYYCJrroTw",
      title: "5-бөлүм",
      duration: "2:50:29",
    },
    {
      id: "vzIcbXGKDXo",
      title: "6-бөлүм",
      duration: "2:44:56",
    },
  ];

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  const previousVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        Кыргыз тил жана Адабияты  боюнча тест
      </h1>

      {/* Аудиокитеп бөлүгү */}
      <div className="mb-6">
        {!showVideo ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="mb-4 text-gray-600">
              Китепти угуу үчүн төмөнкү баскычты басыңыз:
            </p>
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
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Маркумдар үнү - {videos[currentVideo].title}
                </h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videos[currentVideo].id}?si=ixZ8bVse9S8AWZvB`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Video Navigation */}
              <div className="p-4 border-t">
                {/* Video Selector Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                  {videos.map((video, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentVideo(index)}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        currentVideo === index
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {video.title}
                    </button>
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {/* Previous/Next Buttons */}
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={previousVideo}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Мурунку
                    </button>
                    <button
                      onClick={nextVideo}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Кийинки
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowVideo(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Башкы бетке кайтуу
                  </button>
                </div>

                {/* YouTube Link */}
                <a
                  href={`https://www.youtube.com/watch?v=${videos[currentVideo].id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FaYoutube className="w-5 h-5" />
                  <span>YouTube'да көрүү</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

			{/* Кошумча маалымат */}
			<div className="bg-white p-4 rounded-md mb-6">
				<p className="mb-2">
					Саламатсызбы окуучу,{" "}
					<span className="font-semibold">27-декабрга саат 13:00</span> Китеп
					боюнча экзамен болот.
				</p>
				<p className="mb-2">
					Экзаменге катышуу үчүн{" "}
					<span className="font-semibold text-red-600">25-декабрга чейин</span>{" "}
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
	)
}
