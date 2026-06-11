import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a simulated delay and mock summary for MVP when no key is present
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        summary: `${body.playerName} has been in scintillating form over the last five matches, averaging a 7.6 rating. His tactical shift into a more central role has seen him heavily involved in buildup play, though his final third output remains slightly inconsistent against low blocks. News reports suggest his confidence is sky-high following recent positive results.`
      });
    }

    const systemPrompt = `You are Forma's football intelligence engine. Your job is to write a concise, intelligent 3–5 sentence form summary for a footballer based on their recent match stats and news. 

Write like a sharp football journalist — opinionated but grounded in the data. Don't list stats back at the user. Synthesise them into readable insight. Comment on trajectory (improving, declining, inconsistent), context (tactical role, opposition quality), and anything notable from the news. 

Be direct. No filler phrases like "It's worth noting that..." or "Overall...". Start with the most interesting thing about their current form. Keep it under 100 words.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", // Standard Claude Sonnet model
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: JSON.stringify(body, null, 2)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ summary: data.content[0].text });

  } catch (error) {
    console.error("AI Form Summary Error:", error);
    return NextResponse.json(
      { summary: "Unable to generate form summary at this time." },
      { status: 500 }
    );
  }
}
