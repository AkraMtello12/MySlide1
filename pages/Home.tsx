import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Quote as QuoteIcon, Folder, Lock, Unlock, ArrowRight } from 'lucide-react';
import { AppData, Quote, Resource, Category } from '../types';
import { SectionTitle, Card, Button, Input } from '../components/UIComponents';

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
            نصمم نجاحك، شريحة تلو الأخرى
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary leading-[1.3] md:leading-[1.4] mb-6">
            <span className="block">الإبداع في كل</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-secondary">تفاصيل العرض</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            في <span className="font-bold text-primary">MySlide</span>، نجمع بين التفكير الاستراتيجي والتصميم الهندسي الدقيق لنقدم عروضاً تقديمية تترك أثراً لا يمحى.
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
          </Card>
        </div>
      </div>
    </section>
  );
};

// --- Resources Grid ---
const Resources = ({ resources, categories }: { resources: Resource[], categories: Category[] }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [unlockedCategories, setUnlockedCategories] = useState<string[]>([]);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Helper to check if a category has a password
  const isCategoryProtected = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return !!cat?.password;
  };

  // Helper to check if a category is unlocked
  const isCategoryUnlocked = (catId: string) => {
    return unlockedCategories.includes(catId);
  };

  // Handle Tab Click
  const handleTabClick = (catId: string) => {
    setActiveCategory(catId);
    setPasswordInput('');
    setErrorMsg('');
  };

  // Handle Unlock Submit
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === activeCategory);
    if (cat && cat.password === passwordInput) {
      setUnlockedCategories([...unlockedCategories, cat.id]);
      setErrorMsg('');
      setPasswordInput('');
    } else {
      setErrorMsg('كلمة المرور غير صحيحة');
    }
  };

  // Filter Logic
  let filteredResources: Resource[] = [];
  let isCurrentLocked = false;

  if (activeCategory === 'all') {
    // Show all resources EXCEPT those in protected categories (unless unlocked? No, prompt says don't show in All)
    // The prompt says: "Sites added to a password protected Category do not appear in the All Category"
    filteredResources = resources.filter(res => !isCategoryProtected(res.categoryId));
  } else {
    // Specific Category logic
    const isProtected = isCategoryProtected(activeCategory);
    const isUnlocked = isCategoryUnlocked(activeCategory);
    
    if (isProtected && !isUnlocked) {
      isCurrentLocked = true;
    } else {
      filteredResources = resources.filter(res => res.categoryId === activeCategory);
    }
  }

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle="أدوات المصممين">المواقع الهامة</SectionTitle>
        
        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => handleTabClick('all')}
            className={`px-6 py-3 rounded-full font-bold transition-all border-2 ${
              activeCategory === 'all' 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => {
            const isProtected = !!cat.password;
            const isUnlocked = unlockedCategories.includes(cat.id);
            return (
             <button
              key={cat.id}
              onClick={() => handleTabClick(cat.id)}
              className={`px-6 py-3 rounded-full font-bold transition-all border-2 flex items-center gap-2 ${
                activeCategory === cat.id 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              <span>{cat.name}</span>
              {isProtected && !isUnlocked && <Lock size={14} className="opacity-70" />}
              {isProtected && isUnlocked && <Unlock size={14} className="opacity-70" />}
            </button>
          )})}
        </div>

        {/* Content Area */}
        <div className="min-h-[300px]">
          {isCurrentLocked ? (
             <MotionDiv
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-md mx-auto bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center"
             >
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="text-gray-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">محتوى محمي</h3>
                <p className="text-gray-500 mb-6">هذا القسم يتطلب كلمة مرور للعرض</p>
                
                <form onSubmit={handleUnlock} className="flex flex-col gap-4">
                   <Input 
                      label=""
                      type="password"
                      placeholder="أدخل كلمة المرور..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="text-center"
                   />
                   {errorMsg && <p className="text-red-500 text-sm font-bold">{errorMsg}</p>}
                   <Button type="submit" className="w-full">
                     فتح القسم <ArrowRight size={16} />
                   </Button>
                </form>
             </MotionDiv>
          ) : (
            <MotionDiv 
              layout 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredResources.map((resource) => (
                  <MotionDiv
                    layout
                    key={resource.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
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
              </AnimatePresence>
            </MotionDiv>
          )}

          {!isCurrentLocked && filteredResources.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Folder size={48} className="mx-auto mb-4 opacity-50" />
              <p>لا توجد مواقع في هذا التصنيف حالياً</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default function HomePage({ data }: HomeProps) {
  return (
    <>
      <Hero quotes={data.quotes} />
      <Resources resources={data.resources} categories={data.categories} />
    </>
  );
}