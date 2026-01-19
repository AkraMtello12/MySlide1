import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Cast motion components to any to avoid type errors
const MotionDiv = motion.div as any;

export default function GuidelinesPage({ content }: { content: string }) {
  // Simple markdown-ish parser for demo
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-black text-primary mt-8 mb-6">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-secondary mt-6 mb-4 flex items-center gap-2"><div className="w-2 h-8 bg-primary rounded-full"></div>{line.replace('## ', '')}</h2>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-lg text-gray-700 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
       <div className="container mx-auto px-4 max-w-4xl">
         
         <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ChevronRight size={14} />
            <span className="text-secondary font-bold">اللائحة الداخلية</span>
         </div>

         <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-white/50"
         >
           <div className="prose prose-lg max-w-none text-right font-sans">
              {renderContent(content)}
           </div>
         </MotionDiv>
       </div>
    </div>
  );
}