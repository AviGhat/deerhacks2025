import MapComponent from "../../components/MapComponent.js";

async function getLocationHistory() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/location-history`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch location history");
  }
  return res.json();
}

export default async function Home( {params} ) {
  const {mbti} = await params;
  //console.log(mbti);
  // TODO feed mbti into chatgpt api to get list of locations

  const history = await getLocationHistory();

  return (
    <main className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Random Location Street View</h1>

      {/* Google Maps & Street View */}
      <div className="w-full max-w-4xl">
        <MapComponent mbti = {mbti}/>
      </div>

      {/* Location History */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Location History</h2>
        <ul className="list-disc pl-6">
          {history.map((entry, index) => (
            <li key={index} className="mt-2 text-lg">
              {entry.date}: {entry.location}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
