import React, { useState, useEffect, useRef } from 'react';
import { Airport, searchAirports, getAirportLabel } from '../services/airportService';

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (airport: Airport) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange,
  onSelect 
}) => {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const results = searchAirports(value);
    setSuggestions(results);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (airport: Airport) => {
    const formatted = getAirportLabel(airport);
    onChange(formatted);
    if (onSelect) onSelect(airport);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-1 relative" ref={wrapperRef}>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-calm-400 transition-all"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
            if (value.length >= 2) setShowSuggestions(true);
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-auto py-1">
          {suggestions.map((airport) => (
            <div 
              key={airport.code}
              onClick={() => handleSelect(airport)}
              className="px-4 py-3 hover:bg-calm-50 cursor-pointer flex justify-between items-center group transition-colors"
            >
              <div>
                <div className="font-medium text-slate-700 group-hover:text-calm-700">{airport.city}</div>
                <div className="text-xs text-slate-400">{airport.name}</div>
              </div>
              <span className="font-bold text-slate-300 group-hover:text-calm-400 bg-slate-50 group-hover:bg-white px-2 py-1 rounded text-xs">
                {airport.code}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
