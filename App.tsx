import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Loading from './components/Loading';
import CircleProgress from './components/CircleProgress';
import AutocompleteInput from './components/AutocompleteInput';
import { searchFlights, analyzeFlight, getAircraftGuide, generateImage } from './services/geminiService';
import { Flight, FlightAnalysis, AircraftInfo } from './types';

// --- Views Components ---

const HomeView: React.FC = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination) return;
        
        setLoading(true);
        setSearched(true);
        try {
            const results = await searchFlights(origin, destination);
            setFlights(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFlight = (flight: Flight) => {
        // Pass flight data via state to the analysis page
        navigate('/analysis', { state: { flight } });
    };

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section with Background Image */}
            <div className="relative w-full h-[550px] flex items-center justify-center bg-slate-900 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
                        alt="Sky Background" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-slate-50"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center mt-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wider mb-4 animate-fade-in-up">
                        YAPAY ZEKA DESTEKLİ UÇUŞ ASİSTANI
                    </span>
                    <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight drop-shadow-sm">
                        Gökyüzüyle <span className="font-semibold text-calm-200">Barışın</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-100 max-w-2xl mb-10 font-light drop-shadow-md">
                        En gelişmiş yapay zeka modelleri ile uçuşunuzun türbülans riskini, konfor seviyesini ve hava durumunu saniyeler içinde analiz edin.
                    </p>

                    {/* Search Box - Glassmorphism */}
                    <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/50 transform translate-y-8">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <AutocompleteInput 
                                label="Kalkış Yeri"
                                placeholder="Örn: İstanbul (IST)"
                                value={origin}
                                onChange={setOrigin}
                            />
                            <AutocompleteInput 
                                label="Varış Yeri"
                                placeholder="Örn: New York (JFK)"
                                value={destination}
                                onChange={setDestination}
                            />
                            <button 
                                type="submit"
                                disabled={loading || !origin || !destination}
                                className="w-full h-[50px] bg-calm-600 hover:bg-calm-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-calm-200/50 hover:shadow-calm-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
                            >
                                {loading ? 'Uçuşlar Aranıyor...' : (
                                    <>
                                        Analiz Et
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Content Section below Hero */}
            <div className="max-w-6xl mx-auto px-4 pb-20 pt-24 w-full">
                
                {/* Search Results Area */}
                {(loading || searched) && (
                    <div className="mb-20 animate-fade-in">
                        {loading && !flights.length && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-calm-600 mb-4"></div>
                                <p className="text-slate-500">Uçuş verileri taranıyor...</p>
                            </div>
                        )}

                        {!loading && searched && flights.length === 0 && (
                            <div className="text-center text-slate-500 bg-white p-8 rounded-xl border border-slate-100 shadow-sm mx-auto max-w-2xl">
                                <p className="font-medium text-lg text-slate-700">Uçuş bulunamadı.</p>
                                <p className="text-sm mt-2">Lütfen kalkış ve varış noktalarını kontrol edip tekrar deneyin.</p>
                            </div>
                        )}

                        {flights.length > 0 && (
                            <div className="space-y-4 max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-light text-slate-800">Bulunan Uçuşlar <span className="text-sm font-bold text-calm-600 bg-calm-50 px-3 py-1 rounded-full ml-2">{getTomorrowDateStr()}</span></h2>
                                </div>
                                {flights.map((flight, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleSelectFlight(flight)}
                                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-calm-200 cursor-pointer transition-all duration-300 group flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-calm-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                                        
                                        <div className="flex items-center gap-5 w-full sm:w-auto">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-calm-600 group-hover:bg-calm-600 group-hover:text-white transition-colors">
                                                <svg className="w-7 h-7 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-slate-800">{flight.airline}</div>
                                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">#{flight.flightNumber}</span>
                                                    <span>•</span>
                                                    <span>{flight.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <div className="text-2xl font-light text-slate-900">{flight.departureTime}</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{flight.originCode}</div>
                                            </div>
                                            
                                            <div className="hidden sm:flex flex-col items-center px-2">
                                                <div className="w-20 h-[2px] bg-slate-200 relative group-hover:bg-calm-200 transition-colors">
                                                    <div className="absolute right-0 -top-1 w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-calm-400 transition-colors"></div>
                                                    <div className="absolute left-0 -top-1 w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-calm-400 transition-colors"></div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">DİREKT</span>
                                            </div>

                                            <div>
                                                <div className="text-2xl font-light text-slate-900">{flight.arrivalTime}</div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{flight.destinationCode}</div>
                                            </div>
                                            
                                            <div className="pl-4">
                                                <span className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-calm-500 group-hover:text-calm-600 transition-all">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Features Section - Why Choose Us? */}
                {!searched && (
                    <div className="mt-12">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-light text-slate-800 mb-4">Neden <span className="font-semibold text-calm-600">SkyCalm?</span></h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">
                                Sadece bir uçuş arama motoru değiliz. Yapay zeka teknolojimizle uçuşunuzun "nasıl geçeceğini" önceden söylüyoruz.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-3">Google Gemini AI</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    En yeni yapay zeka modelleri ile milyonlarca veri noktasını analiz ederek size özel uçuş raporu oluşturuyoruz.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-3">Gerçek Zamanlı Hava</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    METAR ve TAF raporlarını anlık olarak tarıyor, rotanızdaki türbülans ve rüzgar risklerini hesaplıyoruz.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow group">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-3">Konfor Odaklı</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    Sadece "varacak mıyım?" değil, "nasıl varacağım?" sorusuna odaklanıyoruz. Korkularınızı bilgiyle yönetin.
                                </p>
                            </div>
                        </div>

                        {/* Stats / Trust Strip */}
                        <div className="mt-20 border-t border-slate-200 pt-12 flex flex-col md:flex-row justify-center items-center gap-12 text-center opacity-80">
                            <div>
                                <div className="text-3xl font-bold text-slate-800">500+</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide mt-1">Uçak Modeli</div>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                            <div>
                                <div className="text-3xl font-bold text-slate-800">%98</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide mt-1">Veri Doğruluğu</div>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                            <div>
                                <div className="text-3xl font-bold text-slate-800">7/24</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wide mt-1">Canlı Analiz</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AnalysisView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const flight = (location.state as any)?.flight as Flight;
    const [analysis, setAnalysis] = useState<FlightAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [aircraftImage, setAircraftImage] = useState<string | null>(null);
    const [destinationImage, setDestinationImage] = useState<string | null>(null);

    useEffect(() => {
        if (!flight) {
            navigate('/');
            return;
        }

        const fetchAnalysis = async () => {
            try {
                const data = await analyzeFlight(flight);
                setAnalysis(data);
                
                // Trigger background image generation
                generateImage(`${data.aircraftModel} commercial airplane flying in blue sky, cinematic`).then(img => setAircraftImage(img));
                generateImage(`Aerial view of modern city skyline of ${flight.destination} with airport, sunny day`).then(img => setDestinationImage(img));
                
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [flight, navigate]);

    if (loading) return <Loading message="Uçuş rotası analiz ediliyor ve görseller hazırlanıyor..." />;
    if (!analysis) return <div className="p-8 text-center text-slate-500">Veri alınamadı.</div>;

    const MetricCard = ({ title, metric }: { title: string, metric: any }) => {
        const bgColors = {
            good: 'bg-green-50 border-green-100 text-green-800',
            moderate: 'bg-yellow-50 border-yellow-100 text-yellow-800',
            caution: 'bg-orange-50 border-orange-100 text-orange-800'
        };
        const statusColor = bgColors[metric.status as keyof typeof bgColors] || bgColors.moderate;

        return (
            <div className={`p-4 rounded-xl border ${statusColor} flex flex-col h-full`}>
                <h4 className="text-sm font-semibold opacity-70 uppercase tracking-wider mb-2">{title}</h4>
                <div className="text-2xl font-bold mb-1">{metric.value} <span className="text-sm font-normal opacity-75">{metric.unit}</span></div>
                <p className="text-sm opacity-90 leading-snug">{metric.description}</p>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-float" style={{ animationDuration: '0.8s', animationIterationCount: 1 }}>
            <button onClick={() => navigate('/')} className="mb-6 flex items-center text-slate-500 hover:text-calm-600 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Geri Dön
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Summary & Score */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-calm-300 to-calm-500"></div>
                        <h2 className="text-lg font-medium text-slate-600 mb-6">Genel Konfor Analizi</h2>
                        <CircleProgress percentage={analysis.comfortScore} label={analysis.comfortScore > 80 ? "Mükemmel Uçuş" : analysis.comfortScore > 60 ? "İyi Uçuş" : "Orta Konfor"} />
                        <p className="mt-6 text-slate-600 text-sm leading-relaxed">{analysis.summary}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {/* Dynamic Aircraft Image */}
                        <div className="h-40 bg-slate-200 relative">
                            {aircraftImage ? (
                                <img src={aircraftImage} alt={analysis.aircraftModel} className="w-full h-full object-cover animate-fade-in" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                                    <div className="animate-pulse">Uçak görseli oluşturuluyor...</div>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Uçak Bilgisi</h3>
                            <div className="font-semibold text-lg text-slate-800 mb-2">{analysis.aircraftModel}</div>
                            <p className="text-sm text-slate-500">{analysis.aircraftDescription}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Metrics */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Route & Weather Strip with Destination Image */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="h-32 bg-slate-200 relative">
                            {destinationImage ? (
                                <img src={destinationImage} alt={flight.destination} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-calm-100 to-slate-100 flex items-center justify-center">
                                     <div className="animate-pulse text-slate-400 text-xs">Varış noktası görseli hazırlanıyor...</div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Güzergah Hava Durumu</h3>
                            </div>
                        </div>

                        <div className="p-6 pt-0">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative mt-4">
                                {/* Line Connector */}
                                <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-slate-100 -z-10"></div>

                                {/* Origin */}
                                <div className="text-center bg-white px-4 z-10">
                                    <div className="text-xl font-bold text-slate-800">{flight.originCode}</div>
                                    <div className="text-sm text-slate-500 mb-2">{flight.origin}</div>
                                    <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {analysis.originWeather.temp} • {analysis.originWeather.condition}
                                    </div>
                                </div>

                                {/* Route Info */}
                                <div className="text-center z-10 px-4 bg-white max-w-xs">
                                    <div className="text-xs text-slate-400 mb-1">ROTA BİLGİSİ</div>
                                    <p className="text-sm text-slate-600 italic">"{analysis.routeInfo}"</p>
                                </div>

                                {/* Destination */}
                                <div className="text-center bg-white px-4 z-10">
                                    <div className="text-xl font-bold text-slate-800">{flight.destinationCode}</div>
                                    <div className="text-sm text-slate-500 mb-2">{flight.destination}</div>
                                    <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {analysis.destinationWeather.temp} • {analysis.destinationWeather.condition}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Risk Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricCard title="Türbülans Riski" metric={analysis.risks.turbulence} />
                        <MetricCard title="Rüzgar Hızı (Seyir)" metric={analysis.risks.jetstream} />
                        <MetricCard title="Kabin Basıncı Konforu" metric={analysis.risks.pressure} />
                        <MetricCard title="Görüş Mesafesi" metric={analysis.risks.visibility} />
                    </div>

                    <div className="bg-calm-50 p-4 rounded-xl text-sm text-calm-800 flex items-start gap-3">
                         <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-calm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         <p>
                            Bu rapor, mevcut atmosferik modellere ve geçmiş verilere dayanarak oluşturulmuştur.
                            Pilotlar her zaman en güvenli ve en konforlu rotayı seçmek için gerçek zamanlı veriler kullanırlar.
                            Uçak türbülans için tasarlanmıştır ve tamamen güvenlidir.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GuideView: React.FC = () => {
    const [aircrafts, setAircrafts] = useState<AircraftInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAircraftGuide().then(async (data) => {
            setAircrafts(data);
            setLoading(false);

            // Generate images one by one to avoid rate limits and show progress
            const updatedData = [...data];
            for (let i = 0; i < updatedData.length; i++) {
                const ac = updatedData[i];
                // Generate a unique image for each aircraft
                const image = await generateImage(`${ac.model} commercial airplane flying in the sky, photorealistic, 4k`);
                if (image) {
                    updatedData[i] = { ...ac, imageUrl: image };
                    setAircrafts([...updatedData]); // Trigger re-render with new image
                }
            }
        });
    }, []);

    if (loading) return <Loading message="Uçak rehberi ve görseller hazırlanıyor..." />;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
             <div className="text-center mb-12">
                <h1 className="text-3xl font-light text-slate-800 mb-3">Uçak Modellerini <span className="text-calm-600 font-medium">Tanıyın</span></h1>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Modern yolcu uçakları mühendislik harikalarıdır. Merak ettiğiniz modeller hakkında teknik olmayan, kısa bilgiler.
                    Tüm görseller yapay zeka tarafından anlık olarak oluşturulmaktadır.
                </p>
            </div>

            {aircrafts.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-500">Şu anda uçak bilgileri yüklenemedi. Lütfen sayfayı yenileyin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aircrafts.map((ac, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="h-48 relative overflow-hidden bg-slate-200">
                                 {ac.imageUrl ? (
                                     <img 
                                        src={ac.imageUrl} 
                                        alt={ac.model}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 animate-fade-in"
                                     />
                                 ) : (
                                     <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                                         <div className="w-8 h-8 border-2 border-calm-300 border-t-transparent rounded-full animate-spin mb-2"></div>
                                         <span className="text-xs">AI Görüntü Oluşturuyor...</span>
                                     </div>
                                 )}
                                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                                    <h3 className="text-2xl font-bold text-white shadow-sm">{ac.model}</h3>
                                 </div>
                            </div>
                            <div className="p-6">
                                <div className="inline-block px-3 py-1 bg-calm-50 text-calm-700 text-xs font-semibold rounded-full mb-4">
                                    {ac.type}
                                </div>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{ac.usage}</p>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Öne Çıkan Özellikler</h4>
                                <ul className="space-y-1">
                                    {ac.features.map((f, i) => (
                                        <li key={i} className="text-sm text-slate-500 flex items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-calm-400 mr-2"></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Helper ---
function getTomorrowDateStr() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
}

// --- Main App Component ---

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/analysis" element={<AnalysisView />} />
          <Route path="/guide" element={<GuideView />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;