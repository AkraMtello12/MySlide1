import { useState, useEffect } from 'react';
import { 
  addQuoteToDB, deleteQuoteFromDB, updateQuoteInDB,
  addResourceToDB, deleteResourceFromDB, updateResourceInDB,
  addWorkToDB, deleteWorkFromDB, updateWorkInDB,
  saveGuidelinesToDB, saveCategoriesConfigToDB
} from '../services/storage';
import { AppData, Quote, Resource, SlideWork, CategoryConfig } from '../types';
import { Button, Input, TextArea, Card, Modal } from '../components/UIComponents';
import { Plus, Trash2, Save, Image, Type, Link as LinkIcon, Edit, Loader2, LogOut, Settings, Shield, Lock, Unlock } from 'lucide-react';

type Tab = 'quotes' | 'resources' | 'guidelines' | 'portfolio' | 'settings';

interface AdminPageProps {
  initialData: AppData;
  onUpdate: () => void; 
}

// Icon mapping
const ICONS = {
  quotes: Type,
  resources: LinkIcon,
  guidelines: Edit,
  portfolio: Image,
};

export default function AdminPage({ initialData, onUpdate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('quotes');
  const [loadingAction, setLoadingAction] = useState(false);
  const [guidelinesContent, setGuidelinesContent] = useState(initialData.guidelines.content);
  
  // Local state for categories to allow editing before saving
  const [categories, setCategories] = useState<CategoryConfig[]>(initialData.categories);

  // Update local categories if initialData changes (after a refetch)
  useEffect(() => {
    setCategories(initialData.categories);
  }, [initialData.categories]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'quote' | 'resource' | 'work' | null>(null);

  // Form States
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const [newResource, setNewResource] = useState({ title: '', url: '', image: '', description: '' });
  const [newWork, setNewWork] = useState({ title: '', designerName: '', imageUrl: '' });

  // Helpers to get current category config
  const getCatConfig = (id: string) => categories.find(c => c.id === id);
  const isProtected = (id: string) => getCatConfig(id)?.isProtected || false;

  // --- Handlers ---
  
  const handleLogout = () => {
    if (confirm("هل تود تسجيل الخروج؟")) {
      sessionStorage.removeItem('isAdminLoggedIn');
      window.location.reload();
    }
  };

  const openModal = (type: 'quote' | 'resource' | 'work') => {
    // Check protection before opening
    let catId = '';
    if (type === 'quote') catId = 'quotes';
    if (type === 'resource') catId = 'resources';
    if (type === 'work') catId = 'portfolio';

    if (isProtected(catId)) {
      alert("هذا المجلد محمي. لا يمكن الإضافة إليه.");
      return;
    }

    setModalType(type);
    setNewQuote({ text: '', author: '' });
    setNewResource({ title: '', url: '', image: '', description: '' });
    setNewWork({ title: '', designerName: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  // --- Quote Logic ---
  const saveNewQuote = async () => {
    if (!newQuote.text) return alert("الرجاء إدخال النص");
    setLoadingAction(true);
    await addQuoteToDB({ ...newQuote, active: true });
    await onUpdate();
    setIsModalOpen(false);
    setLoadingAction(false);
  };

  const handleUpdateQuote = async (id: string, field: keyof Quote, value: string) => {
    if (isProtected('quotes')) return alert("المجلد محمي");
    await updateQuoteInDB(id, { [field]: value });
  };

  const handleDeleteQuote = async (id: string) => {
    if (isProtected('quotes')) return alert("المجلد محمي");
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteQuoteFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Resource Logic ---
  const saveNewResource = async () => {
    if (!newResource.title || !newResource.url) return alert("الرجاء إدخال الاسم والرابط");
    setLoadingAction(true);
    await addResourceToDB({ ...newResource });
    await onUpdate();
    setIsModalOpen(false);
    setLoadingAction(false);
  };

  const handleUpdateResource = async (id: string, field: keyof Resource, value: string) => {
    if (isProtected('resources')) return alert("المجلد محمي");
    await updateResourceInDB(id, { [field]: value });
  };

  const handleDeleteResource = async (id: string) => {
    if (isProtected('resources')) return alert("المجلد محمي");
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteResourceFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Portfolio Logic ---
  const saveNewWork = async () => {
    if (!newWork.title) return alert("الرجاء إدخال عنوان المشروع");
    setLoadingAction(true);
    await addWorkToDB({ ...newWork });
    await onUpdate();
    setIsModalOpen(false);
    setLoadingAction(false);
  };

  const handleUpdateWork = async (id: string, field: keyof SlideWork, value: string) => {
    if (isProtected('portfolio')) return alert("المجلد محمي");
    await updateWorkInDB(id, { [field]: value });
  };

  const handleDeleteWork = async (id: string) => {
    if (isProtected('portfolio')) return alert("المجلد محمي");
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteWorkFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Guidelines Save ---
  const handleSaveGuidelines = async () => {
    if (isProtected('guidelines')) return alert("المجلد محمي");
    setLoadingAction(true);
    await saveGuidelinesToDB(guidelinesContent);
    await onUpdate();
    setLoadingAction(false);
    alert("تم حفظ اللائحة بنجاح");
  };

  // --- Settings / Categories Logic ---
  const handleCategoryChange = (index: number, field: keyof CategoryConfig, value: any) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const saveSettings = async () => {
    setLoadingAction(true);
    await saveCategoriesConfigToDB(categories);
    await onUpdate();
    setLoadingAction(false);
    alert("تم تحديث إعدادات المجلدات");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-black text-primary">لوحة التحكم السحابية</h1>
          <Button variant="danger" onClick={handleLogout} className="text-sm px-4 py-2">
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-primary text-white p-6 flex flex-col gap-2">
            {categories.map((cat) => {
              const Icon = ICONS[cat.id as keyof typeof ICONS];
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as Tab)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeTab === cat.id ? 'bg-secondary text-primary font-bold shadow-lg' : 'hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{cat.label}</span>
                  </div>
                  {cat.isProtected && <Lock size={14} className="text-white/50" />}
                </button>
              );
            })}
            
            <div className="h-px bg-white/10 my-2"></div>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-secondary text-primary font-bold shadow-lg' : 'hover:bg-white/10'}`}
            >
              <Settings size={18} />
              <span>إعدادات المجلدات</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-grow p-8 bg-gray-50 overflow-y-auto max-h-[800px] relative">
            
            {loadingAction && (
               <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-lg">
                  <Loader2 className="animate-spin text-primary w-12 h-12" />
               </div>
            )}

            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-primary">{getCatConfig('quotes')?.label}</h2>
                      {isProtected('quotes') && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Lock size={12}/> محمي</span>}
                   </div>
                   <Button onClick={() => openModal('quote')} className="text-sm py-2" disabled={isProtected('quotes')}><Plus size={16} /> إضافة جديد</Button>
                </div>
                <div className="grid gap-4">
                  {initialData.quotes.map((quote) => (
                    <Card key={quote.id} className="p-4 flex flex-col gap-3 relative border-l-4 border-secondary">
                      <button 
                        onClick={() => handleDeleteQuote(quote.id)} 
                        disabled={isProtected('quotes')}
                        className={`absolute top-4 left-4 ${isProtected('quotes') ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-600'}`}
                      >
                        <Trash2 size={18}/>
                      </button>
                      <Input 
                        label="نص الاقتباس" 
                        defaultValue={quote.text} 
                        disabled={isProtected('quotes')}
                        onBlur={(e) => handleUpdateQuote(quote.id, 'text', e.target.value)}
                      />
                      <Input 
                        label="القائل" 
                        defaultValue={quote.author} 
                        disabled={isProtected('quotes')}
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
                   <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-primary">{getCatConfig('resources')?.label}</h2>
                      {isProtected('resources') && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Lock size={12}/> محمي</span>}
                   </div>
                   <Button onClick={() => openModal('resource')} className="text-sm py-2" disabled={isProtected('resources')}><Plus size={16} /> إضافة موقع</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {initialData.resources.map((res) => (
                    <Card key={res.id} className="p-4 flex flex-col gap-3 relative">
                      <button 
                        onClick={() => handleDeleteResource(res.id)} 
                        disabled={isProtected('resources')}
                        className={`absolute top-4 left-4 bg-white p-1 rounded-full shadow z-20 ${isProtected('resources') ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-600'}`}
                      >
                        <Trash2 size={18}/>
                      </button>
                      
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
                        disabled={isProtected('resources')}
                        onBlur={(e) => handleUpdateResource(res.id, 'image', e.target.value)}
                      />
                      <Input 
                        label="اسم الموقع" 
                        defaultValue={res.title} 
                        disabled={isProtected('resources')}
                        onBlur={(e) => handleUpdateResource(res.id, 'title', e.target.value)}
                      />
                      <TextArea 
                        label="وصف الموقع" 
                        defaultValue={res.description || ''}
                        disabled={isProtected('resources')}
                        onBlur={(e) => handleUpdateResource(res.id, 'description', e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Input 
                        label="رابط الموقع" 
                        defaultValue={res.url} 
                        disabled={isProtected('resources')}
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
                   <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-primary">{getCatConfig('guidelines')?.label}</h2>
                      {isProtected('guidelines') && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Lock size={12}/> محمي</span>}
                   </div>
                   <Button onClick={handleSaveGuidelines} disabled={isProtected('guidelines')}><Save size={16} /> حفظ التعديلات</Button>
                </div>
                <TextArea 
                  label="المحتوى النصي (Markdown)" 
                  value={guidelinesContent}
                  onChange={(e) => setGuidelinesContent(e.target.value)}
                  disabled={isProtected('guidelines')}
                  className="min-h-[400px] font-mono text-base"
                />
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-primary">{getCatConfig('portfolio')?.label}</h2>
                      {isProtected('portfolio') && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Lock size={12}/> محمي</span>}
                   </div>
                   <Button onClick={() => openModal('work')} className="text-sm py-2" disabled={isProtected('portfolio')}><Plus size={16} /> إضافة عمل</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {initialData.portfolio.map((work) => (
                    <Card key={work.id} className="p-4 flex flex-col gap-3 relative">
                      <button 
                        onClick={() => handleDeleteWork(work.id)} 
                        disabled={isProtected('portfolio')}
                        className={`absolute top-4 left-4 bg-white p-1 rounded-full shadow z-20 ${isProtected('portfolio') ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-600'}`}
                      >
                        <Trash2 size={18}/>
                      </button>
                      
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
                        disabled={isProtected('portfolio')}
                        onBlur={(e) => handleUpdateWork(work.id, 'imageUrl', e.target.value)}
                      />
                      <Input 
                        label="عنوان المشروع" 
                        defaultValue={work.title} 
                        disabled={isProtected('portfolio')}
                        onBlur={(e) => handleUpdateWork(work.id, 'title', e.target.value)}
                      />
                      <Input 
                        label="اسم المصمم" 
                        defaultValue={work.designerName} 
                        disabled={isProtected('portfolio')}
                        onBlur={(e) => handleUpdateWork(work.id, 'designerName', e.target.value)}
                      />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab (NEW) */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-primary">إعدادات المجلدات</h2>
                   <Button onClick={saveSettings}><Save size={16} /> حفظ الإعدادات</Button>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                  <div className="flex items-start gap-3">
                     <Shield className="text-secondary flex-shrink-0 mt-1" />
                     <p className="text-sm text-gray-600 leading-relaxed">
                       يمكنك هنا تغيير مسميات الأقسام في لوحة التحكم. 
                       <br/>
                       <strong>وضع الحماية:</strong> عند تفعيل الحماية لمجلد ما، سيتم منع "الإضافة"، "التعديل"، أو "الحذف" في ذلك القسم لضمان عدم تغيير البيانات عن طريق الخطأ.
                     </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {categories.map((cat, index) => (
                    <Card key={cat.id} className="p-6 flex items-center justify-between gap-4">
                       <div className="flex-grow">
                          <label className="text-xs font-bold text-gray-400 mb-1 block">اسم المجلد (ID: {cat.id})</label>
                          <input 
                            value={cat.label} 
                            onChange={(e) => handleCategoryChange(index, 'label', e.target.value)}
                            className="w-full text-lg font-bold text-primary bg-transparent border-b border-gray-200 focus:border-secondary outline-none py-1"
                          />
                       </div>
                       
                       <div className="flex items-center gap-4 border-r border-gray-100 pr-4">
                          <div className="text-center">
                            <label className="block text-xs text-gray-400 mb-2">الحالة</label>
                            <button 
                              onClick={() => handleCategoryChange(index, 'isProtected', !cat.isProtected)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
                                cat.isProtected 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {cat.isProtected ? (
                                <>
                                  <Lock size={16} />
                                  <span>محمي</span>
                                </>
                              ) : (
                                <>
                                  <Unlock size={16} />
                                  <span>متاح</span>
                                </>
                              )}
                            </button>
                          </div>
                       </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Create Quote Modal */}
      <Modal isOpen={isModalOpen && modalType === 'quote'} onClose={() => setIsModalOpen(false)} title="إضافة اقتباس جديد">
         <div className="space-y-4">
            <Input 
              label="نص الاقتباس" 
              value={newQuote.text} 
              onChange={(e) => setNewQuote({...newQuote, text: e.target.value})}
              placeholder="اكتب الاقتباس هنا..."
            />
            <Input 
              label="القائل" 
              value={newQuote.author} 
              onChange={(e) => setNewQuote({...newQuote, author: e.target.value})}
              placeholder="اسم صاحب الاقتباس"
            />
            <div className="flex justify-end pt-4">
              <Button onClick={saveNewQuote} disabled={loadingAction}>{loadingAction ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </div>
         </div>
      </Modal>

      {/* Create Resource Modal */}
      <Modal isOpen={isModalOpen && modalType === 'resource'} onClose={() => setIsModalOpen(false)} title="إضافة موقع جديد">
         <div className="space-y-4">
            <Input 
              label="اسم الموقع" 
              value={newResource.title} 
              onChange={(e) => setNewResource({...newResource, title: e.target.value})}
            />
            <TextArea 
               label="وصف الموقع" 
               value={newResource.description} 
               onChange={(e) => setNewResource({...newResource, description: e.target.value})}
               placeholder="وصف مختصر عما يقدمه هذا الموقع..."
               className="min-h-[80px]"
            />
            <Input 
              label="رابط الموقع (URL)" 
              value={newResource.url} 
              onChange={(e) => setNewResource({...newResource, url: e.target.value})}
              placeholder="https://..."
            />
            <Input 
              label="رابط الصورة (URL)" 
              value={newResource.image} 
              onChange={(e) => setNewResource({...newResource, image: e.target.value})}
              placeholder="https://..."
            />
            <div className="flex justify-end pt-4">
              <Button onClick={saveNewResource} disabled={loadingAction}>{loadingAction ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </div>
         </div>
      </Modal>

      {/* Create Work Modal */}
      <Modal isOpen={isModalOpen && modalType === 'work'} onClose={() => setIsModalOpen(false)} title="إضافة عمل جديد">
         <div className="space-y-4">
            <Input 
              label="عنوان المشروع" 
              value={newWork.title} 
              onChange={(e) => setNewWork({...newWork, title: e.target.value})}
            />
            <Input 
              label="اسم المصمم" 
              value={newWork.designerName} 
              onChange={(e) => setNewWork({...newWork, designerName: e.target.value})}
            />
             <Input 
              label="رابط صورة السلايد (URL)" 
              value={newWork.imageUrl} 
              onChange={(e) => setNewWork({...newWork, imageUrl: e.target.value})}
              placeholder="https://..."
            />
            <div className="flex justify-end pt-4">
              <Button onClick={saveNewWork} disabled={loadingAction}>{loadingAction ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </div>
         </div>
      </Modal>

    </div>
  );
}