import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, Quote as QuoteIcon, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppData, Quote } from '../types';
import { SectionTitle, Button, Card } from '../components/UIComponents';

interface HomeProps {
  data: AppData;
}

// --- Hero Section Component ---
const Hero = ({ quotes }: { quotes: Quote[] }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Rotate quotes every 6 seconds
  useEffect(() => {
    if (quotes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background Geometrics */}
      <div className="absolute inset-0 bg-background bg-geometric-pattern opacity-40"></div>
      
      {/* Animated Shapes */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-96 h-96 border-[40px] border-secondary/10 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-40 -left-20 w-[600px] h-[600px] border-[2px] border-primary/5 rounded-full border-dashed"
      />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-primary font-bold text-sm mb-6 border border-white shadow-sm">
            نصمم نجاحك، شريحة تلو الأخرى
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary leading-[1.3] md:leading-[1.4] mb-6">
            <span className="block">الإبداع في كل</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">تفاصيل العرض</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            في <span className="font-bold text-primary">MySlide</span>، نجمع بين التفكير الاستراتيجي والتصميم الهندسي الدقيق لنقدم عروضاً تقديمية تترك أثراً لا يمحى.
          </p>
        </motion.div>

        {/* Dynamic Quotes Section */}
        <div className="w-full max-w-3xl mx-auto relative">
          <div className="absolute -top-10 -right-10 text-secondary/20">
            <QuoteIcon size={80} />
          </div>
          <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-md border-t-4 border-secondary relative overflow-hidden">
             <AnimatePresence mode="wait">
              {quotes.length > 0 && (
                <motion.div
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
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div 
              key={`progress-${currentQuoteIndex}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-secondary/30"
            />
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
          <motion.div
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
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- CTA Section ---
const InternalCTA = () => (
  <section className="py-20 bg-primary relative overflow-hidden">
    <div className="absolute top-0 right-0 w-full h-full opacity-10">
        <svg width="100%" height="100%">
            <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#fff" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-white md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">بيئة عمل احترافية ومنظمة</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            نحرص في MySlide على توفير بيئة عمل واضحة وشفافة. يمكنك الاطلاع على اللائحة الداخلية للشركة ومعرفة كافة الحقوق والواجبات.
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center md:justify-end">
          <Link to="/guidelines">
            <Button variant="secondary" className="px-8 py-4 text-lg shadow-2xl shadow-blue-900/50">
              <BookOpen size={24} />
              <span>عرض اللائحة الداخلية</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// --- Portfolio Section ---
const Portfolio = ({ works }: { works: AppData['portfolio'] }) => (
  <section className="py-24 bg-background relative">
    <div className="container mx-auto px-4">
      <SectionTitle subtitle="معرض الأعمال">أفضل السلايدات</SectionTitle>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {works.map((work, idx) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="break-inside-avoid"
          >
            <div className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-white">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={work.imageUrl} 
                  alt={work.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{work.title}</h3>
                <div className="flex items-center gap-2 mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-white font-bold">
                    {work.designerName.charAt(0)}
                  </div>
                  <span className="text-blue-200 text-sm">تصميم: {work.designerName}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <Button variant="outline" className="mx-auto">
          <span>شاهد المزيد من الأعمال</span>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  </section>
);

export default function HomePage({ data }: HomeProps) {
  return (
    <>
      <Hero quotes={data.quotes} />
      <Resources resources={data.resources} />
      <InternalCTA />
      <Portfolio works={data.portfolio} />
    </>
  );
}