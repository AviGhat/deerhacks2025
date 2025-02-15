import MapComponent from "../../components/MapComponent.js";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
// open ai stuff
const openai = new OpenAI(
  {apiKey: `${process.env.OPENAI_API_KEY}`}
);

const places = z.object({
  name: z.string(),
  desc: z.string(),
});

const locationslist = z.object({
  locations: z.array(places),
});

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
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: "You are a helpful tour guide. Give the user locations that they would enjoy, along with a description of the location given their personality type." },
      { role: "user", content: " I have the personality type of " + mbti + ". Can you give me some locations that I would enjoy?" },
    ],
    response_format: zodResponseFormat(locationslist, "location_list"),
  });
  
  const location_list = completion.choices[0].message.parsed;
  console.log(location_list);
  const history = await getLocationHistory();

  return (
    <main className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Random Location Street View</h1>

      {/* Google Maps & Street View */}
      <div className="w-full max-w-4xl">
        <MapComponent/>
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
