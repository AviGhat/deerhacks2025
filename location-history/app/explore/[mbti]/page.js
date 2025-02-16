import MapComponent from "../../components/MapComponent.js";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";


// initialzize openai api
const openai = new OpenAI(
  {apiKey: `${process.env.OPENAI_API_KEY}`}
);

// zod schema for location list, will contain the location's name and description
const places = z.object({
  name: z.string(),
  desc: z.string(),
});

// put places schema into an array
const locationslist = z.object({
  locations: z.array(places),
});

// TODO: update to show chatgpt locations
async function getLocationHistory() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/location-history`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch location history");
  }
  return res.json();
}

export default async function Home( {params} ) {
  // grab mbti from params, and feed into openai chat
  const {mbti} = await params;
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: "You are a helpful tour guide. Give the user 5 locations that they would enjoy, along with a 4 sentence description of the location, and how the location would fit their personality type. Choose locations that are not as known." },
      { role: "user", content: " I have the personality type of " + mbti + ". Can you give me some locations that I would enjoy?" },
    ],
    response_format: zodResponseFormat(locationslist, "location_list"),
  });
  
  // get location list from openai api request, send into MapComponent
  const location_list = completion.choices[0].message.parsed;
  // TODO: Update to show chatgpt locations
  const history = await getLocationHistory();

  return (
    <main className="p-6 flex flex-col items-center">
  
      {/* Google Maps & Street View */}
      <div className="w-full max-w-4xl">
        <MapComponent locations = {location_list}/>
      </div>

    </main>
  );
}
