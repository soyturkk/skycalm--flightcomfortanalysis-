import { GoogleGenAI, Type } from "@google/genai";
import { Flight, FlightAnalysis, AircraftInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to calculate mock future dates
const getTomorrowDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

// Helper to clean Markdown code blocks from JSON string
const cleanJson = (text: string) => {
  return text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
};

export const searchFlights = async (origin: string, destination: string): Promise<Flight[]> => {
  // Schema for Flight list
  const flightSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        airline: { type: Type.STRING },
        flightNumber: { type: Type.STRING },
        origin: { type: Type.STRING },
        originCode: { type: Type.STRING },
        destination: { type: Type.STRING },
        destinationCode: { type: Type.STRING },
        departureTime: { type: Type.STRING },
        arrivalTime: { type: Type.STRING },
        duration: { type: Type.STRING },
      },
      required: ["id", "airline", "flightNumber", "origin", "destination", "departureTime"],
    },
  };

  try {
    // IMPORTANT: Using googleSearch tool to get REAL flight data
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find REAL, scheduled direct commercial flights from "${origin}" to "${destination}" for tomorrow (${getTomorrowDate()}). 
      Search for actual flight numbers (e.g., TKxxxx, BAxxxx) and their scheduled times on flight tracking sites or airline schedules. 
      Return the 5 most likely options based on standard schedules.
      Do not invent flight numbers if possible, use search results.
      The output must be JSON.`,
      config: {
        tools: [{googleSearch: {}}],
        responseMimeType: "application/json",
        responseSchema: flightSchema,
      },
    });

    if (response.text) {
        return JSON.parse(cleanJson(response.text)) as Flight[];
    }
    return [];
  } catch (error) {
    console.error("Flight search error:", error);
    return [];
  }
};

export const analyzeFlight = async (flight: Flight): Promise<FlightAnalysis> => {
    const analysisSchema = {
        type: Type.OBJECT,
        properties: {
            flightId: { type: Type.STRING },
            comfortScore: { type: Type.NUMBER, description: "A percentage from 0 to 100 based on TURBULENCE and WIND data found." },
            summary: { type: Type.STRING, description: "A summary referencing specific weather reports (METAR) found." },
            aircraftModel: { type: Type.STRING },
            aircraftDescription: { type: Type.STRING, description: "Brief non-technical description of the plane in Turkish." },
            originWeather: {
                type: Type.OBJECT,
                properties: {
                    temp: { type: Type.STRING },
                    wind: { type: Type.STRING },
                    condition: { type: Type.STRING },
                }
            },
            destinationWeather: {
                type: Type.OBJECT,
                properties: {
                    temp: { type: Type.STRING },
                    wind: { type: Type.STRING },
                    condition: { type: Type.STRING },
                }
            },
            risks: {
                type: Type.OBJECT,
                properties: {
                    turbulence: {
                        type: Type.OBJECT,
                        properties: { value: {type: Type.STRING}, unit: {type: Type.STRING}, description: {type: Type.STRING}, status: {type: Type.STRING, enum: ['good', 'moderate', 'caution']} }
                    },
                    jetstream: {
                        type: Type.OBJECT,
                        properties: { value: {type: Type.STRING}, unit: {type: Type.STRING}, description: {type: Type.STRING}, status: {type: Type.STRING, enum: ['good', 'moderate', 'caution']} }
                    },
                    pressure: {
                        type: Type.OBJECT,
                        properties: { value: {type: Type.STRING}, unit: {type: Type.STRING}, description: {type: Type.STRING}, status: {type: Type.STRING, enum: ['good', 'moderate', 'caution']} }
                    },
                    visibility: {
                        type: Type.OBJECT,
                        properties: { value: {type: Type.STRING}, unit: {type: Type.STRING}, description: {type: Type.STRING}, status: {type: Type.STRING, enum: ['good', 'moderate', 'caution']} }
                    }
                }
            },
            routeInfo: { type: Type.STRING, description: "Description of the route, cities flown over in Turkish." }
        }
    };

    try {
        const prompt = `Perform a LIVE weather and turbulence analysis for flight ${flight.airline} ${flight.flightNumber} from ${flight.origin} (${flight.originCode}) to ${flight.destination} (${flight.destinationCode}).
        
        STRICT SEARCH INSTRUCTIONS:
        1. Search for "METAR ${flight.originCode}" and "METAR ${flight.destinationCode}" to get the LATEST real-world weather data.
        2. Search for "Turbulence forecast map ${flight.originCode} to ${flight.destinationCode}" or "SIGMET ${flight.originCode} region".
        3. Identify the aircraft type usually flown on this route (e.g. A321, B737).

        DATA EXTRACTION:
        - Extract exact Temperature (C), Wind Speed (kt), and Visibility from the METAR reports found.
        - If the METAR says "CAVOK", visibility is 10km+.
        - Comfort Score: Start at 100. Deduct points for high winds (>20kt), active SIGMETs, or bad weather codes (TS, RA).

        OUTPUT:
        - Provide the response in Turkish.
        - Be honest: If no bad weather is found in search, assume 'Good'.
        - Do not hallucinate values. Use the search results.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        if (response.text) {
            return JSON.parse(cleanJson(response.text)) as FlightAnalysis;
        }
        throw new Error("Analiz oluşturulamadı");
    } catch (error) {
        console.error("Analysis error:", error);
        throw error;
    }
}

export const getAircraftGuide = async (): Promise<AircraftInfo[]> => {
    const guideSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                model: { type: Type.STRING },
                type: { type: Type.STRING },
                usage: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `List 5 diverse commercial aircraft models (mix of Airbus, Boeing, Embraer).
            Provide a simple, non-technical description in Turkish emphasizing passenger comfort, typical usage (short/long haul), and safety features.
            The tone should be educational and reassuring.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: guideSchema,
            }
        });

        if (response.text) {
            return JSON.parse(cleanJson(response.text)) as AircraftInfo[];
        }
        return [];
    } catch (e) {
        console.error("Guide error", e);
        return [];
    }
}

// Function to generate unique images for aircraft or places
export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        console.log("Generating image for:", prompt);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: `Photorealistic, 8k resolution, cinematic lighting, highly detailed image of: ${prompt}. No text, no logos, just the visual subject.`,
            config: {
                // Image generation parameters (nano banana)
            }
        });

        // The image is inside the parts
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (e) {
        console.error("Image generation failed", e);
        return null;
    }
};