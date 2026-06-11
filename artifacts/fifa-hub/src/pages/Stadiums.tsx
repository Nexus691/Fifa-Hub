import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STADIUMS = [
  // USA
  {
    id: "metlife",
    name: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    countryCode: "us",
    capacity: "82,500",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Metlife_stadium_%28Aerial_view%29.jpg/1280px-Metlife_stadium_%28Aerial_view%29.jpg",
    notable: "Final Match",
  },
  {
    id: "att",
    name: "AT&T Stadium",
    city: "Dallas",
    country: "USA",
    countryCode: "us",
    capacity: "80,000",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg/1280px-Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg",
    notable: "Most Matches (9)",
  },
  {
    id: "arrowhead",
    name: "Arrowhead Stadium",
    city: "Kansas City",
    country: "USA",
    countryCode: "us",
    capacity: "76,416",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Aerial_view_of_Arrowhead_Stadium_08-31-2013.jpg/1280px-Aerial_view_of_Arrowhead_Stadium_08-31-2013.jpg",
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz Stadium",
    city: "Atlanta",
    country: "USA",
    countryCode: "us",
    capacity: "71,000",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg/1280px-Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg",
  },
  {
    id: "gillette",
    name: "Gillette Stadium",
    city: "Boston",
    country: "USA",
    countryCode: "us",
    capacity: "65,878",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Gillette_Stadium_%28Top_View%29.jpg/1280px-Gillette_Stadium_%28Top_View%29.jpg",
  },
  {
    id: "nrg",
    name: "NRG Stadium",
    city: "Houston",
    country: "USA",
    countryCode: "us",
    capacity: "72,220",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nrg_stadium.jpg/1280px-Nrg_stadium.jpg",
  },
  {
    id: "sofi",
    name: "SoFi Stadium",
    city: "Los Angeles",
    country: "USA",
    countryCode: "us",
    capacity: "70,240",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/SoFi_Stadium_2023.jpg/1280px-SoFi_Stadium_2023.jpg",
  },
  {
    id: "lincoln",
    name: "Lincoln Financial Field",
    city: "Philadelphia",
    country: "USA",
    countryCode: "us",
    capacity: "69,796",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Lincoln_Financial_Field_%28Aerial_view%29.jpg/1280px-Lincoln_Financial_Field_%28Aerial_view%29.jpg",
  },
  {
    id: "levis",
    name: "Levi's Stadium",
    city: "San Francisco Bay Area",
    country: "USA",
    countryCode: "us",
    capacity: "68,500",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg/1280px-Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg",
  },
  {
    id: "lumen",
    name: "Lumen Field",
    city: "Seattle",
    country: "USA",
    countryCode: "us",
    capacity: "69,000",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/2025_FIFA_Club_World_Cup_-_Seattle_Sounders_FC_vs._Atl%C3%A9tico_Madrid_-_05.jpg/1280px-2025_FIFA_Club_World_Cup_-_Seattle_Sounders_FC_vs._Atl%C3%A9tico_Madrid_-_05.jpg",
  },
  {
    id: "hardrock",
    name: "Hard Rock Stadium",
    city: "Miami",
    country: "USA",
    countryCode: "us",
    capacity: "64,767",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Hard_Rock_Stadium_for_Super_Bowl_LIV_%2849606710103%29.jpg/1280px-Hard_Rock_Stadium_for_Super_Bowl_LIV_%2849606710103%29.jpg",
    notable: "Bronze Final",
  },
  
  // Mexico
  {
    id: "azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    countryCode: "mx",
    capacity: "83,264",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/1280px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg",
    notable: "Opening Match",
  },
  {
    id: "bbva",
    name: "Estadio BBVA",
    city: "Monterrey",
    country: "Mexico",
    countryCode: "mx",
    capacity: "53,500",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG/1280px-Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG",
  },
  {
    id: "akron",
    name: "Estadio Akron",
    city: "Guadalajara",
    country: "Mexico",
    countryCode: "mx",
    capacity: "49,850",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg/1280px-Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg",
  },

  // Canada
  {
    id: "bcplace",
    name: "BC Place",
    city: "Vancouver",
    country: "Canada",
    countryCode: "ca",
    capacity: "54,500",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/BC_Place_2015_Women%27s_FIFA_World_Cup.jpg/1280px-BC_Place_2015_Women%27s_FIFA_World_Cup.jpg",
  },
  {
    id: "bmo",
    name: "BMO Field",
    city: "Toronto",
    country: "Canada",
    countryCode: "ca",
    capacity: "30,000",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Toronto_BMO_Field_in_2024.jpg/1280px-Toronto_BMO_Field_in_2024.jpg",
  },
];

export default function Stadiums() {
  const [filter, setFilter] = useState("all");

  const filteredStadiums = STADIUMS.filter(s => {
    if (filter === "all") return true;
    if (filter === "usa" && s.country === "USA") return true;
    if (filter === "mexico" && s.country === "Mexico") return true;
    if (filter === "canada" && s.country === "Canada") return true;
    return false;
  });

  return (
    <div className="pb-24 pt-8">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-widest text-primary mb-4 uppercase">
            Host Stadiums
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            16 iconic venues across North America will set the stage for the greatest spectacle in sports.
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
            {filteredStadiums.map((stadium, index) => (
              <motion.div
                key={stadium.id}
                layout
                variants={{
                  initial: { opacity: 0, scale: 0.9, y: 20 },
                  enter: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.9, y: 20 }
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative h-[360px] rounded-2xl overflow-hidden bg-card border border-border shadow-lg"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={stadium.image} 
                    alt={stadium.name} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  {stadium.notable && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                      {stadium.notable}
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 w-10 h-7 rounded overflow-hidden shadow-lg border border-border/50">
                    <img src={`https://flagcdn.com/w80/${stadium.countryCode}.png`} alt={stadium.country} className="w-full h-full object-cover" />
                  </div>

                  <h3 className="font-display text-2xl font-bold tracking-wider mb-2 drop-shadow-md uppercase text-foreground">
                    {stadium.name}
                  </h3>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      {stadium.city}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                      <Users className="w-4 h-4 text-primary" />
                      Capacity: {stadium.capacity}
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
