import { useState } from 'react';
import { 
  addQuoteToDB, deleteQuoteFromDB, updateQuoteInDB,
  addResourceToDB, deleteResourceFromDB, updateResourceInDB
} from '../services/storage';
import { AppData, Quote, Resource } from '../types';
import { Button, Input, TextArea, Card, Modal } from '../components/UIComponents';
import { Plus, Trash2, Link as LinkIcon, Type, Loader2, LogOut } from 'lucide-react';

type Tab = 'quotes' | 'resources';

interface AdminPageProps {
  initialData: AppData;
  onUpdate: () => void; 
}

export default function AdminPage({ initialData, onUpdate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('quotes');
  const [loadingAction, setLoadingAction] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'quote' | 'resource' | null>(null);

  // Form States (Temporary storage for new items)
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });
  const [newResource, setNewResource] = useState({ title: '', url: '', image: '', description: '' });

  // --- Handlers ---
  
  const handleLogout = () => {
    if (confirm("هل تود تسجيل الخروج؟")) {
      sessionStorage.removeItem('isAdminLoggedIn');
      window.location.reload();
    }
  };

  const openModal = (type: 'quote' | 'resource') => {
    setModalType(type);
    // Reset forms
    setNewQuote({ text: '', author: '' });
    setNewResource({ title: '', url: '', image: '', description: '' });
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
    await updateQuoteInDB(id, { [field]: value });
  };

  const handleDeleteQuote = async (id: string) => {
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
    await updateResourceInDB(id, { [field]: value });
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setLoadingAction(true);
    await deleteResourceFromDB(id);
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
                   <Button onClick={() => openModal('resource')} className="text-sm py-2"><Plus size={16} /> إضافة موقع</Button>
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
                        onBlur={(e) => handleUpdateResource(res.id, 'image', e.target.value)}
                      />
                      <Input 
                        label="اسم الموقع" 
                        defaultValue={res.title} 
                        onBlur={(e) => handleUpdateResource(res.id, 'title', e.target.value)}
                      />
                      <TextArea 
                        label="وصف الموقع" 
                        defaultValue={res.description || ''}
                        onBlur={(e) => handleUpdateResource(res.id, 'description', e.target.value)}
                        className="min-h-[80px]"
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

    </div>
  );
}