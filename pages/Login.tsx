import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Card } from '../components/UIComponents';
import { Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

// Cast motion components to any to avoid type errors
const MotionDiv = motion.div as any;

export default function LoginPage({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'slide' && password === 'MySlide124') {
      onLogin();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-primary/30">
            <Lock className="text-secondary w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-primary">تسجيل الدخول</h2>
          <p className="text-gray-500 mt-2">منطقة الإدارة - الموظفين فقط</p>
        </div>

        <Card className="p-8 border-t-4 border-primary">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="اسم المستخدم"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              required
            />
            <Input
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
            />
            
            {error && (
              <MotionDiv 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-50 text-red-500 text-sm rounded-lg font-bold text-center border border-red-100"
              >
                {error}
              </MotionDiv>
            )}

            <Button type="submit" className="w-full">
              دخول
            </Button>
          </form>
        </Card>
      </MotionDiv>
    </div>
  );
}