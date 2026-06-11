import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CITIES = [
  // USA
  {
    id: "nyc",
    name: "New York/New Jersey",
    stadium: "MetLife Stadium",
    country: "USA",
    countryCode: "us",
    region: "East Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg",
  },
  {
    id: "dallas",
    name: "Dallas",
    stadium: "AT&T Stadium",
    country: "USA",
    countryCode: "us",
    region: "Central Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/View_of_Dallas_from_Reunion_Tower_August_2015_05.jpg/1280px-View_of_Dallas_from_Reunion_Tower_August_2015_05.jpg",
  },
  {
    id: "kc",
    name: "Kansas City",
    stadium: "Arrowhead Stadium",
    country: "USA",
    countryCode: "us",
    region: "Central Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Kansas_City_-_Downtown_-_panoramio_%2815%29.jpg/1280px-Kansas_City_-_Downtown_-_panoramio_%2815%29.jpg",
  },
  {
    id: "atlanta",
    name: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    country: "USA",
    countryCode: "us",
    region: "East Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/A2ATL20250614-0721_%28cropped%29.jpg/1280px-A2ATL20250614-0721_%28cropped%29.jpg",
  },
  {
    id: "boston",
    name: "Boston",
    stadium: "Gillette Stadium",
    country: "USA",
    countryCode: "us",
    region: "East Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ISH_WC_Boston4.jpg/1280px-ISH_WC_Boston4.jpg",
  },
  {
    id: "houston",
    name: "Houston",
    stadium: "NRG Stadium",
    country: "USA",
    countryCode: "us",
    region: "Central Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Texas_medical_center.jpg/1280px-Texas_medical_center.jpg",
  },
  {
    id: "la",
    name: "Los Angeles",
    stadium: "SoFi Stadium",
    country: "USA",
    countryCode: "us",
    region: "West Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Hollywood_Sign_%28Zuschnitt%29.jpg/1280px-Hollywood_Sign_%28Zuschnitt%29.jpg",
  },
  {
    id: "philly",
    name: "Philadelphia",
    stadium: "Lincoln Financial Field",
    country: "USA",
    countryCode: "us",
    region: "East Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Philadelphia_skyline_20240528_%28cropped_2-1%29.jpg/1280px-Philadelphia_skyline_20240528_%28cropped_2-1%29.jpg",
  },
  {
    id: "sf",
    name: "San Francisco Bay Area",
    stadium: "Levi's Stadium",
    country: "USA",
    countryCode: "us",
    region: "West Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/San_Francisco_Downtown_Aerial%2C_August_2025.jpg/1280px-San_Francisco_Downtown_Aerial%2C_August_2025.jpg",
  },
  {
    id: "seattle",
    name: "Seattle",
    stadium: "Lumen Field",
    country: "USA",
    countryCode: "us",
    region: "West Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Seattle_Center_as_night_falls.jpg/1280px-Seattle_Center_as_night_falls.jpg",
  },
  {
    id: "miami",
    name: "Miami",
    stadium: "Hard Rock Stadium",
    country: "USA",
    countryCode: "us",
    region: "East Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Villa_Vizcaya_20110228.jpg/1280px-Villa_Vizcaya_20110228.jpg",
  },
  
  // Mexico
  {
    id: "cdmx",
    name: "Mexico City",
    stadium: "Estadio Azteca",
    country: "Mexico",
    countryCode: "mx",
    region: "Central Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg/1280px-Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg",
  },
  {
    id: "monterrey",
    name: "Monterrey",
    stadium: "Estadio BBVA",
    country: "Mexico",
    countryCode: "mx",
    region: "Central Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/View_of_Monterrey_%282015%29.jpg/1280px-View_of_Monterrey_%282015%29.jpg",
  },
  {
    id: "guadalajara",
    name: "Guadalajara",
    stadium: "Estadio Akron",
    country: "Mexico",
    countryCode: "mx",
    region: "West Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Panor%C3%A1mica_Guadalajara_desde_edificio_Bansi_hacia_norte_%28cropped%29.jpg/1280px-Panor%C3%A1mica_Guadalajara_desde_edificio_Bansi_hacia_norte_%28cropped%29.jpg",
  },

  // Canada
  {
    id: "vancouver",
    name: "Vancouver",
    stadium: "BC Place",
    country: "Canada",
    countryCode: "ca",
    region: "West Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Skyline_of_Vancouver%2C_Canada.jpg/1280px-Skyline_of_Vancouver%2C_Canada.jpg",
  },
  {
    id: "toronto",
    name: "Toronto",
    stadium: "BMO Field",
    country: "Canada",
    countryCode: "ca",
    region: "East Region",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Toronto_Skyline_from_Snake_Island%2C_February_28_2026_%2808%29.jpg/1280px-Toronto_Skyline_from_Snake_Island%2C_February_28_2026_%2808%29.jpg",
  },
];

export default function HostCities() {
  const [filter, setFilter] = useState("all");

  const filteredCities = CITIES.filter(c => {
    if (filter === "all") return true;
    if (filter === "usa" && c.country === "USA") return true;
    if (filter === "mexico" && c.country === "Mexico") return true;
    if (filter === "canada" && c.country === "Canada") return true;
    return false;
  });

  return (
    <div className="pb-24 pt-8">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-widest text-primary mb-4 uppercase">
            Host Cities
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            16 vibrant metropolises across the continent ready to welcome the world.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-12 animate-in fade-in duration-700">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/20">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All</TabsTrigger>
              <TabsTrigger value="usa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">USA</TabsTrigger>
              <TabsTrigger value="mexico" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Mexico</TabsTrigger>
              <TabsTrigger value="canada" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Canada</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCities.map((city, index) => (
              <motion.div
                key={city.id}
                layout
                variants={{
                  initial: { opacity: 0, scale: 0.9, y: 20 },
                  enter: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.9, y: 20 }
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative h-[400px] rounded-3xl overflow-hidden bg-card border border-border shadow-lg"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={city.image} 
                    alt={city.name} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-7 rounded overflow-hidden shadow-lg border border-border/50">
                      <img src={`https://flagcdn.com/w80/${city.countryCode}.png`} alt={city.country} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg tracking-wider">
                      {city.region}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-3xl font-bold tracking-wider mb-2 drop-shadow-md text-foreground">
                      {city.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-primary font-bold tracking-widest uppercase bg-background/80 backdrop-blur-sm inline-flex px-3 py-1.5 rounded-lg border border-primary/20">
                      <MapPin className="w-4 h-4" />
                      {city.stadium}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
