import { FaHandHoldingUsd, FaLock, FaUsers, FaGlobe, FaChartLine, FaCheckCircle } from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaHandHoldingUsd className="text-purple-400 text-4xl" />,
    title: "Transparent Funding",
    description: "Every transaction is visible on the blockchain, ensuring full transparency and trust.",
  },
  {
    id: 2,
    icon: <FaLock className="text-purple-400 text-4xl" />,
    title: "Secure & Decentralized",
    description: "Smart contracts ensure funds are only released based on predefined conditions.",
  },
  {
    id: 3,
    icon: <FaUsers className="text-purple-400 text-4xl" />,
    title: "Community Driven",
    description: "Support projects you believe in and become part of a strong community.",
  },
  {
    id: 4,
    icon: <FaGlobe className="text-purple-400 text-4xl" />,
    title: "Global Access",
    description: "Anyone, anywhere can create and support campaigns without restrictions.",
  },
  {
    id: 5,
    icon: <FaChartLine className="text-purple-400 text-4xl" />,
    title: "Real-Time Tracking",
    description: "Monitor campaign progress and fund utilization with live updates.",
  },
  {
    id: 6,
    icon: <FaCheckCircle className="text-purple-400 text-4xl" />,
    title: "No Middlemen",
    description: "Funds go directly to the campaign creator, eliminating unnecessary fees.",
  },
];

const Features = () => {
  return (
    <section className="bg-black py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Why Choose Decentralized Crowdfunding?</h2>
          <p className="text-gray-400 mt-4 text-lg">Secure, transparent, and community-driven funding for a better future.</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="p-6 bg-gray-900/90 rounded-lg shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 border border-gray-800"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-gray-400 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
