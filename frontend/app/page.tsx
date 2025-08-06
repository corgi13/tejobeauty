import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Tejo <span className="text-primary-600">Beauty</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional B2B Beauty Products Wholesale Platform
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/b2b" 
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              B2B Dashboard
            </Link>
            <Link 
              href="/products" 
              className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              View Products
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Bulk Pricing</h3>
            <p className="text-gray-600">Get better prices with volume discounts and tier-based pricing for your business.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Quote Management</h3>
            <p className="text-gray-600">Request custom quotes and manage your orders with our professional B2B tools.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Business Analytics</h3>
            <p className="text-gray-600">Track your orders, analyze spending patterns, and optimize your beauty business.</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Platform Status</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-semibold text-green-800">Frontend Ready</span>
              </div>
              <p className="text-green-600 text-sm mt-1">Next.js 14 + Tailwind CSS</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-semibold text-blue-800">Backend Ready</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">NestJS + Prisma + PostgreSQL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}