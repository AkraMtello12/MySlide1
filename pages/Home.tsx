import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Quote as QuoteIcon } from 'lucide-react';
import { AppData, Quote } from '../types';
import { SectionTitle, Card } from '../components/UIComponents';

interface HomeProps {
  data: AppData;
}

// Cast motion components to any to avoid type errors
const MotionDiv = motion.div as any;

// --- Hero Section Component ---
const Hero = ({ quotes }: { quotes: Quote[] }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    if (quotes.length === 0) return;

    const calculateIndex = () => {
      // Logic: Change quote every 6 hours
      const now = Date.now();
      const sixHoursInMs = 6 * 60 * 60 * 1000;
      // Integer division of current timestamp by 6 hours gives a "window ID"
      const windowIndex = Math.floor(now / sixHoursInMs);
      // Use modulo to cycle through available quotes
      const index = windowIndex % quotes.length;
      setCurrentQuoteIndex(index);
    };

    calculateIndex();
    
    // Recalculate every minute to ensure it updates when the 6-hour window crosses
    const interval = setInterval(calculateIndex, 60000); 

    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background Geometrics */}
      <div className="absolute inset-0 bg-background bg-geometric-pattern opacity-40"></div>
      
      {/* Animated Shapes */}
      <MotionDiv 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-96 h-96 border-[40px] border-secondary/10 rounded-full"
      />
      <MotionDiv 
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-20 w-[600px] h-[600px] border-[2px] border-primary/5 rounded-full border-dashed"
      />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-primary font-bold text-sm mb-6 border border-white shadow-sm">
            أهلاً بك في ركنك المفضل ☕
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary leading-[1.3] md:leading-[1.4] mb-6">
            <span className="block">كل ما يحتاجه المصمم...</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">بمكان واحد</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            <span className="font-bold text-primary">مساحتك الخاصة للوصول إلى الأدوات الأكثر استخدامًا
</span>
          </p>
        </MotionDiv>

        {/* Dynamic Quotes Section */}
        <div className="w-full max-w-3xl mx-auto relative">
          <div className="absolute -top-10 -right-10 text-secondary/20">
            <QuoteIcon size={80} />
          </div>
          <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-md border-t-4 border-secondary relative overflow-hidden">
             <AnimatePresence mode="wait">
              {quotes.length > 0 && (
                <MotionDiv
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-2xl md:text-3xl font-bold text-primary mb-6 leading-relaxed">
                    "{quotes[currentQuoteIndex].text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-[2px] w-12 bg-secondary"></div>
                    <span className="text-gray-500 font-medium">{quotes[currentQuoteIndex].author}</span>
                    <div className="h-[2px] w-12 bg-secondary"></div>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>
            {/* Removed progress bar as it doesn't make sense for a 6-hour duration visually */}
          </Card>
        </div>
      </div>
    </section>
  );
};

// --- Resources Grid ---
const Resources = ({ resources }: { resources: AppData['resources'] }) => (
  <section className="py-24 bg-white relative">
    <div className="container mx-auto px-4">
      <SectionTitle subtitle="أدوات المصممين">المواقع الهامة</SectionTitle>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {resources.map((resource, idx) => (
          <MotionDiv
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="group h-full flex flex-col overflow-hidden">
              <div className="h-48 overflow-hidden relative border-b border-gray-100">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                <img 
                  src={resource.image} 
                  alt={resource.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-2">{resource.title}</h3>
                {resource.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {resource.description}
                  </p>
                )}
                <div className="mt-auto pt-2">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-secondary font-bold group-hover:text-primary transition-colors text-sm"
                  >
                    <span>زيارة الموقع</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </Card>
          </MotionDiv>
        ))}
      </div>
    </div>
  </section>
);

export default function HomePage({ data }: HomeProps) {
  return (
    <>
      <Hero quotes={data.quotes} />
      <Resources resources={data.resources} />
    </>
  );
}
