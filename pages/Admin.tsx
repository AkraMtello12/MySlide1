import { useState } from 'react';
import { 
  addQuoteToDB, deleteQuoteFromDB, updateQuoteInDB,
  addResourceToDB, deleteResourceFromDB, updateResourceInDB,
  addWorkToDB, deleteWorkFromDB, updateWorkInDB,
  saveGuidelinesToDB
} from '../services/storage';
import { AppData, Quote, Resource, SlideWork } from '../types';
import { Button, Input, TextArea, Card } from '../components/UIComponents';
import { Plus, Trash2, Save, Image, Type, Link as LinkIcon, Edit, Loader2 } from 'lucide-react';

type Tab = 'quotes' | 'resources' | 'guidelines' | 'portfolio';

interface AdminPageProps {
  initialData: AppData;
  onUpdate: () => void; // Trigger a refetch in App.tsx
}

export default function AdminPage({ initialData, onUpdate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('quotes');
  const [loadingAction, setLoadingAction] = useState(false);

  // Local state for guidelines editor (save on button click only)
  const [guidelinesContent, setGuidelinesContent] = useState(initialData.guidelines.content);

  // --- Quote Handlers ---
  const handleAddQuote = async () => {
    setLoadingAction(true);
    await addQuoteToDB({ text: 'اقتباس جديد', author: 'الكاتب', active: true });
    await onUpdate();
    setLoadingAction(false);
  };
  const handleUpdateQuote = async (id: string, field: keyof Quote, value: string) => {
    await updateQuoteInDB(id, { [field]: value });
  };
  const handleDeleteQuote = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteQuoteFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Resource Handlers ---
  const handleAddResource = async () => {
    setLoadingAction(true);
    await addResourceToDB({ 
      title: 'موقع جديد', 
      url: 'https://', 
      image: 'https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=600&auto=format&fit=crop' // Default Image
    });
    await onUpdate();
    setLoadingAction(false);
  };
  const handleUpdateResource = async (id: string, field: keyof Resource, value: string) => {
    await updateResourceInDB(id, { [field]: value });
  };
  const handleDeleteResource = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteResourceFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Portfolio Handlers ---
  const handleAddWork = async () => {
    setLoadingAction(true);
    await addWorkToDB({ 
      title: 'مشروع جديد', 
      designerName: 'اسم المصمم', 
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop' // Default Image
    });
    await onUpdate();
    setLoadingAction(false);
  };
  const handleUpdateWork = async (id: string, field: keyof SlideWork, value: string) => {
    await updateWorkInDB(id, { [field]: value });
  };
  const handleDeleteWork = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteWorkFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Guidelines Save ---
  const handleSaveGuidelines = async () => {
    setLoadingAction(true);
    await saveGuidelinesToDB(guidelinesContent);
    await onUpdate();
    setLoadingAction(false);
    alert("تم حفظ اللائحة بنجاح");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-primary mb-4 md:mb-0">لوحة التحكم السحابية</h1>
          <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
             تم إيقاف الرفع المباشر: يرجى استخدام روابط الصور
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-primary text-white p-6 flex flex-col gap-2">
            {[
              { id: 'quotes', label: 'إدارة الاقتباسات', icon: Type },
              { id: 'resources', label: 'المواقع الهامة', icon: LinkIcon },
              { id: 'guidelines', label: 'اللائحة الداخلية', icon: Edit },
              { id: 'portfolio', label: 'معرض الأعمال', icon: Image },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-secondary text-primary font-bold shadow-lg' : 'hover:bg-white/10'}`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-grow p-8 bg-gray-50 overflow-y-auto max-h-[800px] relative">
            
            {loadingAction && (
               <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary w-12 h-12" />
               </div>
            )}

            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-primary">الاقتباسات</h2>
                   <Button onClick={handleAddQuote} className="text-sm py-2"><Plus size={16} /> إضافة</Button>
                </div>
                <div className="grid gap-4">
                  {initialData.quotes.map((quote) => (
                    <Card key={quote.id} className="p-4 flex flex-col gap-3 relative border-l-4 border-secondary">
                      <button onClick={() => handleDeleteQuote(quote.id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                      <Input 
                        label="نص الاقتباس" 
                        defaultValue={quote.text} 
                        onBlur={(e) => handleUpdateQuote(quote.id, 'text', e.target.value)}
                      />
                      <Input 
                        label="القائل" 
                        defaultValue={quote.author} 
                        onBlur={(e) => handleUpdateQuote(quote.id, 'author', e.target.value)}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-primary">المواقع الهامة</h2>
                   <Button onClick={handleAddResource} className="text-sm py-2"><Plus size={16} /> إضافة موقع</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {initialData.resources.map((res) => (
                    <Card key={res.id} className="p-4 flex flex-col gap-3 relative">
                      <button onClick={() => handleDeleteResource(res.id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600 bg-white p-1 rounded-full shadow z-20"><Trash2 size={18}/></button>
                      
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-2 relative group border border-gray-200">
                        {res.image ? (
                          <img src={res.image} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">لا توجد صورة</div>
                        )}
                      </div>

                      <Input 
                        label="رابط الصورة (URL)" 
                        defaultValue={res.image} 
                        placeholder="https://example.com/image.jpg"
                        onBlur={(e) => handleUpdateResource(res.id, 'image', e.target.value)}
                      />
                      <Input 
                        label="اسم الموقع" 
                        defaultValue={res.title} 
                        onBlur={(e) => handleUpdateResource(res.id, 'title', e.target.value)}
                      />
                      <Input 
                        label="رابط الموقع" 
                        defaultValue={res.url} 
                        onBlur={(e) => handleUpdateResource(res.id, 'url', e.target.value)}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Guidelines Tab */}
            {activeTab === 'guidelines' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-primary">تحرير اللائحة</h2>
                   <Button onClick={handleSaveGuidelines}><Save size={16} /> حفظ التعديلات</Button>
                </div>
                <TextArea 
                  label="المحتوى النصي (Markdown)" 
                  value={guidelinesContent}
                  onChange={(e) => setGuidelinesContent(e.target.value)}
                  className="min-h-[400px] font-mono text-base"
                />
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-primary">معرض الأعمال</h2>
                   <Button onClick={handleAddWork} className="text-sm py-2"><Plus size={16} /> إضافة عمل</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {initialData.portfolio.map((work) => (
                    <Card key={work.id} className="p-4 flex flex-col gap-3 relative">
                      <button onClick={() => handleDeleteWork(work.id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600 bg-white p-1 rounded-full shadow z-20"><Trash2 size={18}/></button>
                      
                      <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-2 relative group border border-gray-200">
                         {work.imageUrl ? (
                           <img src={work.imageUrl} alt="preview" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">لا توجد صورة</div>
                         )}
                      </div>

                      <Input 
                        label="رابط الصورة (URL)" 
                        defaultValue={work.imageUrl}
                        placeholder="https://example.com/slide-image.jpg"
                        onBlur={(e) => handleUpdateWork(work.id, 'imageUrl', e.target.value)}
                      />
                      <Input 
                        label="عنوان المشروع" 
                        defaultValue={work.title} 
                        onBlur={(e) => handleUpdateWork(work.id, 'title', e.target.value)}
                      />
                      <Input 
                        label="اسم المصمم" 
                        defaultValue={work.designerName} 
                        onBlur={(e) => handleUpdateWork(work.id, 'designerName', e.target.value)}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}