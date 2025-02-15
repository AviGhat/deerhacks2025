export async function GET() {
    const mockHistory = [
      { date: "2025-12-25", location: "Colma, California" },  // ✅ Works dynamically
      { date: "2025-11-10", location: "Berlin, Germany" },    // ✅ You can add new cities
      { date: "2025-10-05", location: "Sydney, Australia" },   // ✅ And more!
      {date: "2025-10-05", location: "Kolmanskop, Namibia"}
    ];
    return Response.json(mockHistory);
  }
  