import { useState } from 'react';
import { 
  addQuoteToDB, deleteQuoteFromDB, updateQuoteInDB,
  addResourceToDB, deleteResourceFromDB, updateResourceInDB,
  addCategoryToDB, deleteCategoryFromDB, updateCategoryInDB
} from '../services/storage';
import { AppData } from '../types';
import { Button, Input, TextArea, Card, Modal, Select } from '../components/UIComponents';
import { Plus, Trash2, Link as LinkIcon, Type, Loader2, LogOut, Folder, Edit, ExternalLink, Lock, Unlock } from 'lucide-react';

type Tab = 'quotes' | 'resources' | 'categories';

interface AdminPageProps {
  initialData: AppData;
  onUpdate: () => void; 
}

export default function AdminPage({ initialData, onUpdate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('quotes');
  const [loadingAction, setLoadingAction] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'quote' | 'resource' | 'category' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // Track if editing

  // Form States
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const [newResource, setNewResource] = useState({ title: '', url: '', image: '', description: '', categoryId: '' });
  const [newCategory, setNewCategory] = useState({ name: '', password: '' });
  const [isProtected, setIsProtected] = useState(false);

  // --- Handlers ---
  
  const handleLogout = () => {
    if (confirm("هل تود تسجيل الخروج؟")) {
      sessionStorage.removeItem('isAdminLoggedIn');
      window.location.reload();
    }
  };

  const openModal = (type: 'quote' | 'resource' | 'category', editItem?: any) => {
    setModalType(type);
    setEditingId(editItem ? editItem.id : null);

    if (type === 'quote') {
      if (editItem) {
         setNewQuote({ text: editItem.text, author: editItem.author });
      } else {
         setNewQuote({ text: '', author: '' });
      }
    } else if (type === 'resource') {
      if (editItem) {
        setNewResource({ 
          title: editItem.title, 
          url: editItem.url, 
          image: editItem.image, 
          description: editItem.description || '', 
          categoryId: editItem.categoryId || '' 
        });
      } else {
        setNewResource({ 
          title: '', 
          url: '', 
          image: '', 
          description: '', 
          categoryId: initialData.categories.length > 0 ? initialData.categories[0].id : '' 
        });
      }
    } else if (type === 'category') {
       if (editItem) {
         setNewCategory({ name: editItem.name, password: editItem.password || '' });
         setIsProtected(!!editItem.password);
       } else {
         setNewCategory({ name: '', password: '' });
         setIsProtected(false);
       }
    }
    
    setIsModalOpen(true);
  };

  // --- Quote Logic ---
  const saveQuote = async () => {
    if (!newQuote.text) return alert("الرجاء إدخال النص");
    setLoadingAction(true);
    if (editingId) {
      await updateQuoteInDB(editingId, newQuote);
    } else {
      await addQuoteToDB({ ...newQuote, active: true });
    }
    await onUpdate();
    setIsModalOpen(false);
    setLoadingAction(false);
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteQuoteFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Resource Logic ---
  const saveResource = async () => {
    if (!newResource.title || !newResource.url || !newResource.categoryId) return alert("الرجاء إدخال الاسم، الرابط، والتصنيف");
    setLoadingAction(true);
    if (editingId) {
       await updateResourceInDB(editingId, newResource);
    } else {
       await addResourceToDB({ ...newResource });
    }
    await onUpdate();
    setIsModalOpen(false);
    setLoadingAction(false);
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteResourceFromDB(id);
    await onUpdate();
    setLoadingAction(false);
  };

  // --- Category Logic ---
  const saveCategory = async () => {
    if (!newCategory.name) return alert("الرجاء إدخال اسم التصنيف");
    if (isProtected && !newCategory.password) return alert("الرجاء إدخال كلمة المرور للتصنيف المحمي");

    setLoadingAction(true);
    
    const categoryData = {
      name: newCategory.name,
      password: isProtected ? newCategory.password : "" 
    };

    if (editingId) {
      await updateCategoryInDB(editingId, categoryData);
    } else {
      await addCategoryToDB(categoryData);
    }
    
    await onUpdate();
    setIsModalOpen(false);
    setLoadingAction(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟ سيتم إخفاء المواقع المرتبطة بهذا التصنيف.')) return;
    setLoadingAction(true);
    await deleteCategoryFromDB(id);
    await onUpdate();
    setLoadingAction(false);
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
            {[
              { id: 'quotes', label: 'إدارة الاقتباسات', icon: Type },
              { id: 'categories', label: 'التصنيفات', icon: Folder },
              { id: 'resources', label: 'المواقع الهامة', icon: LinkIcon },
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
               <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-lg">
                  <Loader2 className="animate-spin text-primary w-12 h-12" />
               </div>
            )}

            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-primary">الاقتباسات</h2>
                   <Button onClick={() => openModal('quote')} className="text-sm py-2"><Plus size={16} /> إضافة جديد</Button>
                </div>
                <div className="grid gap-4">
                  {initialData.quotes.map((quote) => (
                    <Card key={quote.id} className="p-4 flex flex-col gap-3 relative border-l-4 border-secondary group">
                      <div className="absolute top-4 left-4 flex gap-2">
                        <button onClick={() => openModal('quote', quote)} className="text-blue-400 hover:text-blue-600"><Edit size={18}/></button>
                        <button onClick={() => handleDeleteQuote(quote.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                      </div>
                      <p className="font-bold text-lg">{quote.text}</p>
                      <p className="text-gray-500 text-sm">{quote.author}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-primary">التصنيفات (المجلدات)</h2>
                   <Button onClick={() => openModal('category')} className="text-sm py-2"><Plus size={16} /> إضافة تصنيف</Button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {initialData.categories.map((cat) => (
                    <Card key={cat.id} className="p-6 flex items-center justify-between border-b-4 border-secondary relative group">
                       <div className="flex items-center gap-3">
                          {cat.password ? (
                            <Lock className="text-red-400" size={20} />
                          ) : (
                            <Folder className="text-secondary" size={20} />
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-primary">{cat.name}</span>
                            {cat.password && <span className="text-xs text-red-400 font-bold">محمي بكلمة مرور</span>}
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => openModal('category', cat)} className="text-blue-400 hover:text-blue-600"><Edit size={18}/></button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                       </div>
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
                   <Button onClick={() => openModal('resource')} className="text-sm py-2"><Plus size={16} /> إضافة موقع</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {initialData.resources.map((res) => {
                    const cat = initialData.categories.find(c => c.id === res.categoryId);
                    const catName = cat?.name || 'غير مصنف';
                    const isLocked = !!cat?.password;
                    
                    return (
                      <Card key={res.id} className="p-4 flex flex-col gap-3 relative group">
                        <div className="absolute top-4 left-4 flex gap-2 z-20">
                           <button onClick={() => openModal('resource', res)} className="bg-white p-2 rounded-full shadow text-blue-500 hover:text-blue-700"><Edit size={16}/></button>
                           <button onClick={() => handleDeleteResource(res.id)} className="bg-white p-2 rounded-full shadow text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                        </div>
                        
                        <div className="flex gap-4">
                           <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                             {res.image ? (
                               <img src={res.image} alt="preview" className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">لا توجد صورة</div>
                             )}
                           </div>
                           <div className="flex flex-col flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded w-fit">{catName}</span>
                                {isLocked && <Lock size={12} className="text-red-400" />}
                              </div>
                              <h3 className="font-bold text-primary mb-1">{res.title}</h3>
                              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{res.description}</p>
                              <a href={res.url} target="_blank" className="text-xs text-primary flex items-center gap-1 hover:underline mt-auto">
                                {res.url} <ExternalLink size={10} />
                              </a>
                           </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Quote Modal */}
      <Modal isOpen={isModalOpen && modalType === 'quote'} onClose={() => setIsModalOpen(false)} title={editingId ? "تعديل اقتباس" : "إضافة اقتباس جديد"}>
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
              <Button onClick={saveQuote} disabled={loadingAction}>{loadingAction ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </div>
         </div>
      </Modal>

       {/* Category Modal */}
       <Modal isOpen={isModalOpen && modalType === 'category'} onClose={() => setIsModalOpen(false)} title={editingId ? "تعديل تصنيف" : "إضافة تصنيف جديد"}>
         <div className="space-y-4">
            <Input 
              label="اسم التصنيف" 
              value={newCategory.name} 
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              placeholder="مثال: خطوط، صور، أدوات..."
            />
            
            {/* Status Toggle */}
            <div className="bg-gray-50 p-1 rounded-xl flex gap-1 border border-gray-200 mb-2">
                <button 
                  onClick={() => setIsProtected(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    !isProtected 
                      ? 'bg-white text-primary shadow-sm border border-gray-100' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Unlock size={16} />
                   عام (غير محمي)
                </button>
                <button 
                  onClick={() => setIsProtected(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isProtected 
                      ? 'bg-white text-red-500 shadow-sm border border-red-100' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Lock size={16} />
                   محمي بكلمة مرور
                </button>
            </div>

            {isProtected && (
               <div className="animate-fade-in">
                  <Input 
                    label="تعيين كلمة المرور" 
                    value={newCategory.password} 
                    onChange={(e) => setNewCategory({...newCategory, password: e.target.value})}
                    placeholder="أدخل كلمة المرور..."
                    type="text"
                    autoFocus
                  />
                  <p className="text-xs text-red-400 mt-1 font-bold">
                    * لن يظهر هذا التصنيف في قائمة "الكل" وسيطلب كلمة مرور للدخول.
                  </p>
               </div>
            )}

            <div className="flex justify-end pt-4 border-t mt-4">
              <Button onClick={saveCategory} disabled={loadingAction}>{loadingAction ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </div>
         </div>
      </Modal>

      {/* Resource Modal */}
      <Modal isOpen={isModalOpen && modalType === 'resource'} onClose={() => setIsModalOpen(false)} title={editingId ? "تعديل موقع" : "إضافة موقع جديد"}>
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <Input 
                label="اسم الموقع" 
                value={newResource.title} 
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                placeholder="اسم الموقع..."
              />
               <Select 
                label="التصنيف" 
                options={initialData.categories.map(c => ({ value: c.id, label: c.name }))}
                value={newResource.categoryId}
                onChange={(e) => setNewResource({...newResource, categoryId: e.target.value})}
              />
            </div>
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
              placeholder="رابط مباشر للصورة..."
            />
            <TextArea 
              label="وصف مختصر" 
              value={newResource.description} 
              onChange={(e) => setNewResource({...newResource, description: e.target.value})}
              placeholder="اكتب وصفاً مختصراً للموقع..."
            />
            <div className="flex justify-end pt-4">
              <Button onClick={saveResource} disabled={loadingAction}>{loadingAction ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}