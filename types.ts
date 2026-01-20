export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
}

export interface WeatherMetric {
  value: string | number;
  unit: string;
  description: string;
  status: 'good' | 'moderate' | 'caution'; // Used for coloring UI elements softly
}

export interface FlightAnalysis {
  flightId: string;
  comfortScore: number; // 0-100
  summary: string;
  aircraftModel: string;
  aircraftDescription: string;
  imageUrl?: string; // Generated image URL (base64)
  destinationImageUrl?: string; // Generated destination image
  originWeather: {
    temp: string;
    wind: string;
    condition: string;
  };
  destinationWeather: {
    temp: string;
    wind: string;
    condition: string;
  };
  risks: {
    turbulence: WeatherMetric;
    jetstream: WeatherMetric;
    pressure: WeatherMetric;
    visibility: WeatherMetric;
  };
  routeInfo: string;
}

export interface AircraftInfo {
  model: string;
  type: string;
  usage: string;
  features: string[];
  imageUrl?: string; // Generated image URL (base64)
}