import { FaShieldAlt, FaUsers, FaMoneyBillWave, FaChartBar } from "react-icons/fa";

const CrowdfundingFeatures = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h2 className="text-4xl font-extrabold mb-6">
            Unlock the Power of Decentralized Crowdfunding
          </h2>
          <p className="text-gray-400 max-w-lg">
            Empower individuals and communities with a secure, transparent, and borderless fundraising experience.
          </p>
        </div>

        {/* Right Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Feature 1 */}
          <div className="flex items-start space-x-4 border-purple-400 p-3 rounded-lg shadow-lg shadow-purple-400">
            <FaShieldAlt className="text-purple-400 text-9xl" />
            <div>
              <h3 className="text-xl font-semibold text-white">Secure Transactions</h3>
              <p className="text-gray-400 mt-2">
                Blockchain ensures all transactions are safe, verifiable, and tamper-proof.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start space-x-4 border-purple-400 p-3 rounded-lg shadow-lg shadow-purple-400">
            <FaUsers className="text-purple-400 text-9xl" />
            <div>
              <h3 className="text-xl font-semibold text-white">Community Backed</h3>
              <p className="text-gray-400 mt-2">
                Fundraisers are powered by real people, without middlemen or hidden fees.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start space-x-4 border-purple-400 p-3 rounded-lg shadow-lg shadow-purple-400">
            <FaMoneyBillWave className="text-purple-400 text-9xl" />
            <div>
              <h3 className="text-xl font-semibold text-white">Transparent Fund Use</h3>
              <p className="text-gray-400 mt-2">
                Every donation is trackable, ensuring funds reach the right causes.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start space-x-4 border-purple-400 p-3 rounded-lg shadow-lg shadow-purple-400">
            <FaChartBar className="text-purple-400 text-9xl" />
            <div>
              <h3 className="text-xl font-semibold text-white">Real-Time Analytics</h3>
              <p className="text-gray-400 mt-2">
                Monitor campaign progress with live updates on contributions and engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingFeatures;
