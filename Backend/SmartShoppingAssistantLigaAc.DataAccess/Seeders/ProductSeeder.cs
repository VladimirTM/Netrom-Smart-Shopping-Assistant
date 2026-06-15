using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;

namespace SmartShoppingAssistantLigaAc.DataAccess.Seeders;

public class ProductSeeder(SmartShoppingAssistantDbContext context)
{
    public async Task SeedAsync()
    {
        if (await context.Products.AnyAsync())
            return;

        var cats = await context.Categories.ToDictionaryAsync(c => c.Name);

        Category Cat(string name) => cats[name];

        var products = new List<(Product Product, string[] CategoryNames)>
        {
            // Electronics
            (new Product { Name = "iPhone 15 Pro",               Description = "Apple flagship smartphone with titanium design and A17 Pro chip", ImageUrl = "https://placehold.co/400x400?text=iPhone15Pro",               Price = 5999.99m }, ["Electronics"]),
            (new Product { Name = "Samsung Galaxy S24",          Description = "Samsung flagship with AI-enhanced camera and Snapdragon 8 Gen 3",  ImageUrl = "https://placehold.co/400x400?text=GalaxyS24",               Price = 4999.99m }, ["Electronics"]),
            (new Product { Name = "Sony WH-1000XM5 Headphones",  Description = "Industry-leading noise cancelling wireless headphones",            ImageUrl = "https://placehold.co/400x400?text=SonyXM5",                 Price = 1299.99m }, ["Electronics", "Music & Instruments"]),
            (new Product { Name = "iPad Air M2",                 Description = "Apple iPad Air with M2 chip, 11-inch Liquid Retina display",       ImageUrl = "https://placehold.co/400x400?text=iPadAir",                 Price = 3499.99m }, ["Electronics"]),
            (new Product { Name = "Dell XPS 15 Laptop",          Description = "Premium 15.6-inch laptop with Intel Core Ultra 9 and OLED display", ImageUrl = "https://placehold.co/400x400?text=DellXPS15",              Price = 8999.99m }, ["Electronics"]),
            (new Product { Name = "Sony Bravia 4K TV 55\"",       Description = "55-inch 4K OLED smart TV with Google TV and Dolby Vision",         ImageUrl = "https://placehold.co/400x400?text=SonyBravia55",            Price = 3799.99m }, ["Electronics", "Home & Kitchen"]),
            (new Product { Name = "Nintendo Switch OLED",        Description = "Hybrid gaming console with 7-inch OLED screen",                    ImageUrl = "https://placehold.co/400x400?text=SwitchOLED",              Price = 1799.99m }, ["Electronics", "Toys & Games"]),
            (new Product { Name = "Apple Watch Series 9",        Description = "Advanced smartwatch with double-tap gesture and carbon neutral",    ImageUrl = "https://placehold.co/400x400?text=AppleWatch9",             Price = 2799.99m }, ["Electronics", "Sports"]),

            // Clothing
            (new Product { Name = "Nike Air Max 270",            Description = "Men's lifestyle shoes with large Air unit for all-day comfort",     ImageUrl = "https://placehold.co/400x400?text=NikeAirMax270",           Price = 599.99m  }, ["Clothing", "Sports"]),
            (new Product { Name = "Levi's 501 Original Jeans",   Description = "Classic straight-fit jeans in dark wash denim",                    ImageUrl = "https://placehold.co/400x400?text=Levis501",                Price = 349.99m  }, ["Clothing"]),
            (new Product { Name = "Adidas Essentials Hoodie",    Description = "Cozy fleece hoodie with kangaroo pocket",                          ImageUrl = "https://placehold.co/400x400?text=AdidasHoodie",            Price = 279.99m  }, ["Clothing", "Sports"]),
            (new Product { Name = "Zara Floral Summer Dress",    Description = "Light midi dress with floral print, perfect for warm weather",      ImageUrl = "https://placehold.co/400x400?text=ZaraDress",               Price = 199.99m  }, ["Clothing"]),
            (new Product { Name = "Ralph Lauren Polo Shirt",     Description = "Classic piqué polo shirt in breathable cotton",                    ImageUrl = "https://placehold.co/400x400?text=RLPolo",                  Price = 399.99m  }, ["Clothing"]),
            (new Product { Name = "Columbia Omni-Heat Jacket",   Description = "Thermal reflective winter jacket with Omni-Heat technology",       ImageUrl = "https://placehold.co/400x400?text=ColumbiaJacket",          Price = 699.99m  }, ["Clothing", "Sports"]),
            (new Product { Name = "Tommy Hilfiger Chinos",       Description = "Slim-fit chino trousers in stretch cotton blend",                  ImageUrl = "https://placehold.co/400x400?text=THChinos",                Price = 449.99m  }, ["Clothing"]),
            (new Product { Name = "Under Armour Running Shorts", Description = "Lightweight 5-inch running shorts with HeatGear fabric",           ImageUrl = "https://placehold.co/400x400?text=UAShorts",                Price = 149.99m  }, ["Clothing", "Sports"]),

            // Home & Kitchen
            (new Product { Name = "Instant Pot Duo 7-in-1",      Description = "7-in-1 multi-use electric pressure cooker, 6-quart",               ImageUrl = "https://placehold.co/400x400?text=InstantPot",              Price = 599.99m  }, ["Home & Kitchen"]),
            (new Product { Name = "KitchenAid Stand Mixer",      Description = "5-quart tilt-head stand mixer in Empire Red",                      ImageUrl = "https://placehold.co/400x400?text=KitchenAid",              Price = 1899.99m }, ["Home & Kitchen"]),
            (new Product { Name = "Dyson V15 Detect",            Description = "Cordless vacuum with laser dust detection and LCD screen",         ImageUrl = "https://placehold.co/400x400?text=DysonV15",                Price = 2499.99m }, ["Home & Kitchen"]),
            (new Product { Name = "Philips Air Fryer XL",        Description = "6.2L air fryer with Rapid Air technology, 7 preset programs",      ImageUrl = "https://placehold.co/400x400?text=PhilipsAirFryer",         Price = 799.99m  }, ["Home & Kitchen"]),
            (new Product { Name = "Nespresso Vertuo Next",       Description = "Coffee machine for espresso, double espresso, mug and alto",        ImageUrl = "https://placehold.co/400x400?text=NespressoVertuo",         Price = 1299.99m }, ["Home & Kitchen", "Food & Beverages"]),
            (new Product { Name = "Tefal Non-Stick Pan Set 5pc", Description = "5-piece induction-compatible non-stick cookware set",               ImageUrl = "https://placehold.co/400x400?text=TefalSet",                Price = 449.99m  }, ["Home & Kitchen"]),
            (new Product { Name = "Rowenta Pro Steam Iron",      Description = "Professional steam iron with 400-hole stainless steel soleplate",   ImageUrl = "https://placehold.co/400x400?text=RowentaIron",             Price = 299.99m  }, ["Home & Kitchen"]),
            (new Product { Name = "IKEA KALLAX Shelf Unit",      Description = "4x4 shelf unit in white, perfect for vinyl records and books",      ImageUrl = "https://placehold.co/400x400?text=IKEAKallax",              Price = 399.99m  }, ["Home & Kitchen"]),

            // Sports
            (new Product { Name = "Fitbit Charge 6",             Description = "Advanced fitness tracker with built-in GPS and heart rate",         ImageUrl = "https://placehold.co/400x400?text=FitbitCharge6",           Price = 899.99m  }, ["Sports", "Health & Wellness"]),
            (new Product { Name = "Wilson Clash 100 Racket",     Description = "Carbon fiber tennis racket with Feel Flex frame technology",        ImageUrl = "https://placehold.co/400x400?text=WilsonClash",             Price = 599.99m  }, ["Sports"]),
            (new Product { Name = "Decathlon Football Size 5",   Description = "FIFA-approved match football, thermobonded construction",           ImageUrl = "https://placehold.co/400x400?text=DecathlonFootball",       Price = 149.99m  }, ["Sports"]),
            (new Product { Name = "Garmin Forerunner 265",       Description = "GPS running smartwatch with AMOLED display and training metrics",   ImageUrl = "https://placehold.co/400x400?text=GarminFR265",             Price = 1999.99m }, ["Sports", "Health & Wellness"]),
            (new Product { Name = "Yoga Mat Premium 6mm",        Description = "Eco-friendly non-slip yoga mat with alignment lines",               ImageUrl = "https://placehold.co/400x400?text=YogaMat",                 Price = 199.99m  }, ["Sports", "Health & Wellness"]),
            (new Product { Name = "Resistance Bands Set 5pc",    Description = "5 resistance levels from light to extra-heavy for full-body workout",ImageUrl = "https://placehold.co/400x400?text=ResistanceBands",        Price = 119.99m  }, ["Sports", "Health & Wellness"]),
            (new Product { Name = "Speedo Biofuse Goggles",      Description = "Soft silicone swimming goggles with UV protection",                 ImageUrl = "https://placehold.co/400x400?text=SpeedoGoggles",           Price = 149.99m  }, ["Sports"]),
            (new Product { Name = "Coleman 4-Person Tent",       Description = "Instant cabin tent with WeatherTec system, sets up in 60 seconds",  ImageUrl = "https://placehold.co/400x400?text=ColemanTent",             Price = 999.99m  }, ["Sports", "Garden & Outdoors"]),

            // Books
            (new Product { Name = "Atomic Habits",               Description = "James Clear — practical guide to building good habits",             ImageUrl = "https://placehold.co/400x400?text=AtomicHabits",            Price = 69.99m   }, ["Books"]),
            (new Product { Name = "The Psychology of Money",     Description = "Morgan Housel — timeless lessons on wealth, greed, and happiness",  ImageUrl = "https://placehold.co/400x400?text=PsychMoney",              Price = 59.99m   }, ["Books"]),
            (new Product { Name = "Sapiens",                     Description = "Yuval Noah Harari — brief history of humankind",                    ImageUrl = "https://placehold.co/400x400?text=Sapiens",                 Price = 79.99m   }, ["Books"]),
            (new Product { Name = "Clean Code",                  Description = "Robert C. Martin — handbook of agile software craftsmanship",        ImageUrl = "https://placehold.co/400x400?text=CleanCode",               Price = 89.99m   }, ["Books"]),
            (new Product { Name = "The Lean Startup",            Description = "Eric Ries — how entrepreneurs use continuous innovation",            ImageUrl = "https://placehold.co/400x400?text=LeanStartup",             Price = 69.99m   }, ["Books"]),
            (new Product { Name = "Thinking, Fast and Slow",     Description = "Daniel Kahneman — explores two systems that drive thought",          ImageUrl = "https://placehold.co/400x400?text=ThinkingFastSlow",        Price = 74.99m   }, ["Books"]),
            (new Product { Name = "Harry Potter Complete Box Set",Description = "J.K. Rowling — all 7 books in a beautiful collector's edition",    ImageUrl = "https://placehold.co/400x400?text=HarryPotterBox",          Price = 299.99m  }, ["Books", "Toys & Games"]),
            (new Product { Name = "The Da Vinci Code",           Description = "Dan Brown — international thriller and mystery bestseller",          ImageUrl = "https://placehold.co/400x400?text=DaVinciCode",             Price = 54.99m   }, ["Books"]),

            // Food & Beverages
            (new Product { Name = "Nescafe Gold Premium 500g",   Description = "Rich and smooth instant coffee with golden roasting process",       ImageUrl = "https://placehold.co/400x400?text=NescafeGold",             Price = 89.99m   }, ["Food & Beverages"]),
            (new Product { Name = "Lavazza Espresso Beans 1kg",  Description = "100% Arabica espresso whole coffee beans, medium roast",            ImageUrl = "https://placehold.co/400x400?text=LavazzaBeans",            Price = 119.99m  }, ["Food & Beverages"]),
            (new Product { Name = "Haribo Goldbears 1kg",        Description = "Original Haribo gold bears gummy candies, family pack",             ImageUrl = "https://placehold.co/400x400?text=HariboGoldbears",         Price = 39.99m   }, ["Food & Beverages"]),
            (new Product { Name = "Pringles Variety Pack 12",    Description = "12-can assorted variety pack of Pringles potato chips",             ImageUrl = "https://placehold.co/400x400?text=PringlesVariety",         Price = 119.99m  }, ["Food & Beverages"]),
            (new Product { Name = "San Pellegrino 24-pack",      Description = "Sparkling natural mineral water, 0.5L cans x 24",                  ImageUrl = "https://placehold.co/400x400?text=SanPellegrino",           Price = 79.99m   }, ["Food & Beverages"]),
            (new Product { Name = "Nutella 3kg Jar",             Description = "Ferrero Nutella hazelnut spread in catering-size jar",              ImageUrl = "https://placehold.co/400x400?text=Nutella3kg",              Price = 149.99m  }, ["Food & Beverages"]),
            (new Product { Name = "Pepsi 24-pack 330ml",         Description = "Pepsi Cola carbonated soft drink, 24 x 330ml cans",                ImageUrl = "https://placehold.co/400x400?text=Pepsi24",                 Price = 89.99m   }, ["Food & Beverages"]),
            (new Product { Name = "Oreo Family Pack x3",         Description = "Three family-size Oreo original cookies packs",                    ImageUrl = "https://placehold.co/400x400?text=OreoFamily",              Price = 59.99m   }, ["Food & Beverages"]),
            (new Product { Name = "Lay's Chips 10-pack",         Description = "Assorted flavour Lay's potato chips multipack",                    ImageUrl = "https://placehold.co/400x400?text=LaysMultipack",           Price = 79.99m   }, ["Food & Beverages"]),

            // Beauty & Personal Care
            (new Product { Name = "L'Oréal Revitalift Serum",    Description = "1.5% pure hyaluronic acid serum for plumped and younger-looking skin",ImageUrl = "https://placehold.co/400x400?text=LOrealSerum",          Price = 149.99m  }, ["Beauty & Personal Care"]),
            (new Product { Name = "Oral-B iO Series 9",          Description = "Electric toothbrush with AI pressure sensor and 7 brushing modes",  ImageUrl = "https://placehold.co/400x400?text=OralBiO9",                Price = 799.99m  }, ["Beauty & Personal Care", "Health & Wellness"]),
            (new Product { Name = "Gillette Fusion5 Razor Set",  Description = "Fusion5 razor with 6 replacement cartridges and stand",             ImageUrl = "https://placehold.co/400x400?text=GilletteFusion5",         Price = 199.99m  }, ["Beauty & Personal Care"]),
            (new Product { Name = "Pantene Pro-V Shampoo 1L",    Description = "Repair and protect shampoo for damaged hair, 1-litre bottle",       ImageUrl = "https://placehold.co/400x400?text=PantenePV",               Price = 79.99m   }, ["Beauty & Personal Care"]),
            (new Product { Name = "Maybelline Sky High Mascara", Description = "Lengthening and volumising mascara with bamboo fibre brush",         ImageUrl = "https://placehold.co/400x400?text=MaybellineMascara",       Price = 89.99m   }, ["Beauty & Personal Care"]),
            (new Product { Name = "Dove Intensive Body Lotion",  Description = "48h moisture body lotion with shea butter, 400ml pump",             ImageUrl = "https://placehold.co/400x400?text=DoveBodyLotion",          Price = 49.99m   }, ["Beauty & Personal Care"]),
            (new Product { Name = "Nivea Men Cream Gift Set",    Description = "Men's skincare set: face cream, body lotion and lip balm",           ImageUrl = "https://placehold.co/400x400?text=NiveaMenSet",             Price = 79.99m   }, ["Beauty & Personal Care"]),
            (new Product { Name = "Clinique Moisture Surge",     Description = "Hydrating gel-cream moisturiser for all skin types, 75ml",           ImageUrl = "https://placehold.co/400x400?text=CliniqueMS",              Price = 299.99m  }, ["Beauty & Personal Care"]),

            // Toys & Games
            (new Product { Name = "LEGO Technic Bugatti Chiron", Description = "3,599-piece 1:8 scale model Bugatti Chiron hypercar",               ImageUrl = "https://placehold.co/400x400?text=LEGOBugatti",             Price = 1499.99m }, ["Toys & Games"]),
            (new Product { Name = "Monopoly Classic Board Game", Description = "The original family property trading board game",                   ImageUrl = "https://placehold.co/400x400?text=Monopoly",                Price = 149.99m  }, ["Toys & Games"]),
            (new Product { Name = "Rubik's Cube 3x3",            Description = "Original 3x3 Rubik's Cube speed puzzle toy",                        ImageUrl = "https://placehold.co/400x400?text=RubiksCube",              Price = 69.99m   }, ["Toys & Games"]),
            (new Product { Name = "Barbie Dreamhouse 2023",      Description = "3-story dollhouse with 75+ accessories and 3 elevators",            ImageUrl = "https://placehold.co/400x400?text=BarbieDreamhouse",        Price = 799.99m  }, ["Toys & Games"]),
            (new Product { Name = "Hot Wheels 20-Car Gift Pack",  Description = "20 die-cast 1:64 scale vehicles in collectible styles",             ImageUrl = "https://placehold.co/400x400?text=HotWheels20",             Price = 199.99m  }, ["Toys & Games"]),
            (new Product { Name = "Jenga Giant Wood Game",       Description = "Classic giant stacking game, pieces up to 90cm when stacked",       ImageUrl = "https://placehold.co/400x400?text=JengaGiant",              Price = 249.99m  }, ["Toys & Games"]),
            (new Product { Name = "UNO Card Game",               Description = "Classic UNO card game, 112 cards with Wild and Draw cards",         ImageUrl = "https://placehold.co/400x400?text=UNOGame",                 Price = 49.99m   }, ["Toys & Games"]),
            (new Product { Name = "RC Racing Car 4WD",           Description = "1:16 scale remote control car, 40 km/h top speed, off-road",        ImageUrl = "https://placehold.co/400x400?text=RCRacingCar",             Price = 349.99m  }, ["Toys & Games"]),

            // Pet Supplies
            (new Product { Name = "Royal Canin Large Adult 15kg",Description = "Dry dog food for large breeds over 15 months, 15kg bag",            ImageUrl = "https://placehold.co/400x400?text=RoyalCaninLarge",         Price = 379.99m  }, ["Pet Supplies"]),
            (new Product { Name = "Catit Flower Fountain 3L",    Description = "Triple-action filter water fountain for cats, 3-litre capacity",    ImageUrl = "https://placehold.co/400x400?text=CatitFountain",           Price = 199.99m  }, ["Pet Supplies"]),
            (new Product { Name = "Ferplast Dog Cage XL",        Description = "Folding metal dog cage with removable tray, XL 107cm",             ImageUrl = "https://placehold.co/400x400?text=FerplastCage",            Price = 599.99m  }, ["Pet Supplies"]),
            (new Product { Name = "Julius-K9 Harness & Leash",   Description = "Reflective dog harness and leash set, size M/L",                   ImageUrl = "https://placehold.co/400x400?text=JuliusK9",                Price = 149.99m  }, ["Pet Supplies"]),
            (new Product { Name = "Trixie Cat Scratching Post",  Description = "Sisal scratching post with plush platform, 63cm height",           ImageUrl = "https://placehold.co/400x400?text=TrixieScratch",           Price = 179.99m  }, ["Pet Supplies"]),
            (new Product { Name = "Sera Aquarium Starter 60L",   Description = "Complete aquarium set with filter, heater and LED lighting",        ImageUrl = "https://placehold.co/400x400?text=SeraAquarium",            Price = 449.99m  }, ["Pet Supplies"]),
            (new Product { Name = "Kong Chew Toy Bundle Dog",    Description = "5-piece bundle of KONG classic and extreme chew toys",              ImageUrl = "https://placehold.co/400x400?text=KongBundle",              Price = 99.99m   }, ["Pet Supplies"]),

            // Automotive
            (new Product { Name = "Bosch 12V Car Jump Starter",  Description = "5400mAh portable car jump starter with safety clamps",              ImageUrl = "https://placehold.co/400x400?text=BoschJumpStart",          Price = 499.99m  }, ["Automotive"]),
            (new Product { Name = "Michelin Digital Tyre Pump",  Description = "Programmable digital tyre inflator with LED display",               ImageUrl = "https://placehold.co/400x400?text=MichelinPump",            Price = 349.99m  }, ["Automotive"]),
            (new Product { Name = "Garmin DashCam 67W",          Description = "1440p HDR dash camera with 180° field of view and voice control",   ImageUrl = "https://placehold.co/400x400?text=GarminDashCam",           Price = 999.99m  }, ["Automotive", "Electronics"]),
            (new Product { Name = "Car Seat Cover Full Set",     Description = "Universal waterproof car seat covers for 5 seats",                  ImageUrl = "https://placehold.co/400x400?text=SeatCoverSet",            Price = 299.99m  }, ["Automotive"]),
            (new Product { Name = "WD-40 Industrial Pack 400ml", Description = "Multi-use lubricant and rust protection spray, 400ml",              ImageUrl = "https://placehold.co/400x400?text=WD40",                    Price = 79.99m   }, ["Automotive"]),
            (new Product { Name = "Thule Rapid Roof Rack Kit",   Description = "Universal roof rack kit for cars without factory rails",             ImageUrl = "https://placehold.co/400x400?text=ThuleRoofRack",           Price = 1499.99m }, ["Automotive", "Sports"]),
            (new Product { Name = "3M Auto Polish & Wax Kit",    Description = "3M car polish, scratch remover and paste wax complete kit",          ImageUrl = "https://placehold.co/400x400?text=3MPolish",                Price = 199.99m  }, ["Automotive"]),

            // Garden & Outdoors
            (new Product { Name = "Weber Spirit E-210 BBQ",      Description = "2-burner propane gas grill with GS4 grilling system, 46cm",         ImageUrl = "https://placehold.co/400x400?text=WeberBBQ",                Price = 2499.99m }, ["Garden & Outdoors"]),
            (new Product { Name = "Gardena Micro-Drip System",   Description = "Complete micro-drip irrigation kit for 40 plants",                  ImageUrl = "https://placehold.co/400x400?text=GardenaDrip",             Price = 899.99m  }, ["Garden & Outdoors"]),
            (new Product { Name = "Bosch Rotak 37 Lawn Mower",   Description = "Electric lawn mower with Grass Combs and 37cm cutting width",       ImageUrl = "https://placehold.co/400x400?text=BoschRotak",              Price = 1999.99m }, ["Garden & Outdoors"]),
            (new Product { Name = "Gardening Tool Set 10-piece",  Description = "Ergonomic garden tool set including trowel, rake, gloves and more", ImageUrl = "https://placehold.co/400x400?text=GardenTools",             Price = 299.99m  }, ["Garden & Outdoors"]),
            (new Product { Name = "Vivere Double Hammock",        Description = "Extra-large double hammock with 213kg capacity and carrying bag",   ImageUrl = "https://placehold.co/400x400?text=Hammock",                 Price = 499.99m  }, ["Garden & Outdoors"]),
            (new Product { Name = "Solar Garden LED Lights 10pk", Description = "Waterproof solar-powered pathway lights, warm white, set of 10",   ImageUrl = "https://placehold.co/400x400?text=SolarLights",             Price = 199.99m  }, ["Garden & Outdoors"]),

            // Health & Wellness
            (new Product { Name = "Optimum Nutrition Whey 2kg",  Description = "Gold Standard 100% Whey protein, chocolate flavour, 2kg",           ImageUrl = "https://placehold.co/400x400?text=ONWhey2kg",               Price = 349.99m  }, ["Health & Wellness", "Sports"]),
            (new Product { Name = "D3 + K2 Vitamin 5000 IU",     Description = "High-strength Vitamin D3 with K2 MK-7, 120 capsules",              ImageUrl = "https://placehold.co/400x400?text=VitaminD3K2",             Price = 89.99m   }, ["Health & Wellness"]),
            (new Product { Name = "Omega-3 Fish Oil 120 caps",   Description = "Triple-strength Omega-3 with EPA and DHA, 120 softgels",            ImageUrl = "https://placehold.co/400x400?text=Omega3",                  Price = 79.99m   }, ["Health & Wellness"]),
            (new Product { Name = "Bioderma Atoderm Body Cream",  Description = "Nourishing body cream for dry and sensitive skin, 500ml",          ImageUrl = "https://placehold.co/400x400?text=BiodermaAtoderm",         Price = 149.99m  }, ["Health & Wellness", "Beauty & Personal Care"]),
            (new Product { Name = "Melatonin Sleep Aid 5mg",     Description = "Fast-dissolve melatonin tablets for sleep support, 60 tablets",     ImageUrl = "https://placehold.co/400x400?text=Melatonin",               Price = 69.99m   }, ["Health & Wellness"]),
            (new Product { Name = "Collagen Peptides Powder",    Description = "Hydrolysed collagen type I & III, unflavoured, 300g",               ImageUrl = "https://placehold.co/400x400?text=CollagenPeptides",        Price = 179.99m  }, ["Health & Wellness", "Beauty & Personal Care"]),
            (new Product { Name = "Probiotic 50 Billion CFU",    Description = "10-strain probiotic blend for gut health, 60 veggie capsules",      ImageUrl = "https://placehold.co/400x400?text=Probiotic60",             Price = 99.99m   }, ["Health & Wellness"]),
            (new Product { Name = "Theragun Mini Massager",      Description = "Portable percussive therapy device with 3 speeds and attachments",  ImageUrl = "https://placehold.co/400x400?text=TheragunMini",            Price = 999.99m  }, ["Health & Wellness", "Sports"]),

            // Office & Stationery
            (new Product { Name = "HP LaserJet Pro M404dn",      Description = "Monochrome laser printer with auto duplex, 38ppm, Wi-Fi",           ImageUrl = "https://placehold.co/400x400?text=HPLaserJet",              Price = 1599.99m }, ["Office & Stationery"]),
            (new Product { Name = "Moleskine Classic Notebook A5",Description = "Hard cover ruled notebook, 240 pages, black — pack of 3",          ImageUrl = "https://placehold.co/400x400?text=MoleskineA5",             Price = 149.99m  }, ["Office & Stationery"]),
            (new Product { Name = "Staedtler Triplus Fineliner",  Description = "Set of 48 vivid colour superfine-tip pens, washable",               ImageUrl = "https://placehold.co/400x400?text=StaedtlerSet",            Price = 79.99m   }, ["Office & Stationery", "Arts & Crafts"]),
            (new Product { Name = "LAMY Safari Fountain Pen",     Description = "Iconic fountain pen in transparent with medium nib",                ImageUrl = "https://placehold.co/400x400?text=LAMYSafari",              Price = 249.99m  }, ["Office & Stationery"]),
            (new Product { Name = "Brother P-Touch Label Maker",  Description = "Handheld label maker with QWERTY keyboard and 6 fonts",             ImageUrl = "https://placehold.co/400x400?text=BrotherPTouch",           Price = 399.99m  }, ["Office & Stationery"]),
            (new Product { Name = "Logitech MX Keys Advanced",    Description = "Wireless illuminated keyboard with Smart Backlighting, multi-device",ImageUrl = "https://placehold.co/400x400?text=LogiMXKeys",             Price = 799.99m  }, ["Office & Stationery", "Electronics"]),
            (new Product { Name = "Post-it Notes Variety 12-pack",Description = "12 pads of assorted colour Post-it sticky notes, various sizes",    ImageUrl = "https://placehold.co/400x400?text=PostItVariety",           Price = 69.99m   }, ["Office & Stationery"]),

            // Music & Instruments
            (new Product { Name = "Yamaha P-45 Digital Piano",   Description = "88-key weighted-action digital piano with GH action",               ImageUrl = "https://placehold.co/400x400?text=YamahaP45",               Price = 2999.99m }, ["Music & Instruments"]),
            (new Product { Name = "Fender Player Stratocaster",  Description = "Electric guitar with alder body, maple neck, 3 Player Series pickups",ImageUrl = "https://placehold.co/400x400?text=FenderStrat",            Price = 4999.99m }, ["Music & Instruments"]),
            (new Product { Name = "Roland TD-17KVX Drum Kit",    Description = "Electronic V-Drum kit with mesh heads and Bluetooth connectivity",   ImageUrl = "https://placehold.co/400x400?text=RolandTD17",              Price = 3999.99m }, ["Music & Instruments"]),
            (new Product { Name = "Audio-Technica ATH-M50x",     Description = "Professional studio monitor headphones with 45mm large-aperture drivers",ImageUrl = "https://placehold.co/400x400?text=ATHM50x",             Price = 999.99m  }, ["Music & Instruments", "Electronics"]),
            (new Product { Name = "Shure SM58 Microphone",       Description = "Cardioid dynamic vocal microphone, industry standard for live performance",ImageUrl = "https://placehold.co/400x400?text=ShureSM58",          Price = 799.99m  }, ["Music & Instruments"]),
            (new Product { Name = "Fender Frontman 20G Amp",     Description = "20-watt guitar amplifier with overdrive channel and 8-inch speaker",  ImageUrl = "https://placehold.co/400x400?text=FenderAmp20G",            Price = 699.99m  }, ["Music & Instruments"]),
            (new Product { Name = "Meinl Cajon Snare Drum Box",  Description = "Birch wood cajon with internal snares and adjustable sound hole",    ImageUrl = "https://placehold.co/400x400?text=MeinlCajon",              Price = 499.99m  }, ["Music & Instruments"]),

            // Arts & Crafts
            (new Product { Name = "Wacom Intuos M Drawing Tablet",Description = "Medium creative pen tablet with 4 express keys and 8192 pressure levels",ImageUrl = "https://placehold.co/400x400?text=WacomIntuosM",       Price = 699.99m  }, ["Arts & Crafts", "Electronics"]),
            (new Product { Name = "Winsor & Newton Oil Paints 24",Description = "24-colour professional oil paint set in 21ml tubes",                 ImageUrl = "https://placehold.co/400x400?text=WinsorOilPaints",         Price = 299.99m  }, ["Arts & Crafts"]),
            (new Product { Name = "Cricut Maker 3",               Description = "Smart cutting machine, cuts 300+ materials up to 12x",               ImageUrl = "https://placehold.co/400x400?text=CricutMaker3",            Price = 2499.99m }, ["Arts & Crafts"]),
            (new Product { Name = "Fabriano Watercolour Block A3",Description = "100% cotton 300gsm cold-press watercolour paper, 20 sheets",         ImageUrl = "https://placehold.co/400x400?text=FabrianoBlock",           Price = 149.99m  }, ["Arts & Crafts"]),
            (new Product { Name = "Prismacolor Premier 72 Pencils",Description = "72 professional-grade soft-core colour pencils in tin case",        ImageUrl = "https://placehold.co/400x400?text=PrismacolorPremier",      Price = 299.99m  }, ["Arts & Crafts"]),
            (new Product { Name = "Calligraphy Starter Kit",      Description = "Complete calligraphy set with 6 nibs, 2 holders, ink and guide",      ImageUrl = "https://placehold.co/400x400?text=CalligraphyKit",          Price = 129.99m  }, ["Arts & Crafts"]),
            (new Product { Name = "Singer Heavy Duty Sewing Machine",Description = "Mechanical sewing machine, 110 stitch applications, metal frame", ImageUrl = "https://placehold.co/400x400?text=SingerSewing",            Price = 999.99m  }, ["Arts & Crafts"]),
        };

        foreach (var (product, categoryNames) in products)
        {
            foreach (var name in categoryNames)
                product.Categories.Add(Cat(name));
            context.Products.Add(product);
        }

        await context.SaveChangesAsync();
    }
}
