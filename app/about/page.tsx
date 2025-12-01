"use client";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">About Page</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        This is a test page to verify that Tailwind CSS is working correctly
        in your Next.js project. You should see spacing, colors, and typography styled by Tailwind.
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
        Test Button
      </button>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl w-full">
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">Card 1</h2>
          <p className="text-gray-600">This is a simple card styled with Tailwind.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold mb-2">Card 2</h2>
          <p className="text-gray-600">You can use Tailwind utilities to create layouts easily.</p>
        </div>
      </div>
    </div>
  );
}
