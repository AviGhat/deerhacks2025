export async function GET() {
    const mockHistory = [
      { date: "2025-02-10", location: "New York, USA" },
      { date: "2025-01-15", location: "Tokyo, Japan" },
      { date: "2024-12-25", location: "Paris, France" },
    ];
    return Response.json(mockHistory);
  }
  