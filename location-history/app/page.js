import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-6">🌍 Welcome to Street View Explorer</h1>
      <p className="text-lg text-center mb-8">
        Discover random places around the world using Google Street View.
      </p>
      <Link href="/explore" className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700">
        Start Exploring 🚀
      </Link>
    </main>
  );
}
