export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

const airports: Airport[] = [
  // Turkey
  { code: 'IST', city: 'İstanbul', name: 'İstanbul Havalimanı', country: 'TR' },
  { code: 'SAW', city: 'İstanbul', name: 'Sabiha Gökçen Havalimanı', country: 'TR' },
  { code: 'COV', city: 'Mersin/Adana', name: 'Çukurova Uluslararası Havalimanı', country: 'TR' },
  { code: 'ESB', city: 'Ankara', name: 'Esenboğa Havalimanı', country: 'TR' },
  { code: 'ADB', city: 'İzmir', name: 'Adnan Menderes Havalimanı', country: 'TR' },
  { code: 'AYT', city: 'Antalya', name: 'Antalya Havalimanı', country: 'TR' },
  { code: 'DLM', city: 'Dalaman', name: 'Dalaman Havalimanı', country: 'TR' },
  { code: 'BJV', city: 'Bodrum', name: 'Milas-Bodrum Havalimanı', country: 'TR' },
  { code: 'TZX', city: 'Trabzon', name: 'Trabzon Havalimanı', country: 'TR' },
  { code: 'GZT', city: 'Gaziantep', name: 'Gaziantep Havalimanı', country: 'TR' },
  { code: 'ADA', city: 'Adana', name: 'Şakirpaşa Havalimanı (Eski)', country: 'TR' }, // Kept for reference
  { code: 'KYA', city: 'Konya', name: 'Konya Havalimanı', country: 'TR' },
  
  // World - Major Hubs
  { code: 'LHR', city: 'Londra', name: 'Heathrow Airport', country: 'UK' },
  { code: 'LGW', city: 'Londra', name: 'Gatwick Airport', country: 'UK' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy', country: 'US' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'FR' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'AE' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'DE' },
  { code: 'AMS', city: 'Amsterdam', name: 'Schiphol Airport', country: 'NL' },
  { code: 'MUC', city: 'Münih', name: 'Munich Airport', country: 'DE' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'US' },
  { code: 'SIN', city: 'Singapur', name: 'Changi Airport', country: 'SG' },
  { code: 'HND', city: 'Tokyo', name: 'Haneda Airport', country: 'JP' },
  { code: 'BER', city: 'Berlin', name: 'Brandenburg Airport', country: 'DE' },
  { code: 'FCO', city: 'Roma', name: 'Fiumicino Airport', country: 'IT' },
  { code: 'MAD', city: 'Madrid', name: 'Barajas Airport', country: 'ES' },
  { code: 'BCN', city: 'Barselona', name: 'El Prat Airport', country: 'ES' },
];

export const searchAirports = (query: string): Airport[] => {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery)
  );
};

export const getAirportLabel = (airport: Airport) => `${airport.city} (${airport.code})`;
