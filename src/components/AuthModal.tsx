import React, { useState } from 'react';
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isSignedIn } = useAuth();

  // Close modal when user is signed in
  React.useEffect(() => {
    if (isSignedIn) {
      onClose();
    }
  }, [isSignedIn, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {isSignUp ? (
            <SignUp 
              forceRedirectUrl="/"
              fallbackRedirectUrl="/"
              signInUrl="#"
              afterSignUpUrl="/"
            />
          ) : (
            <SignIn 
              forceRedirectUrl="/"
              fallbackRedirectUrl="/"
              signUpUrl="#"
              afterSignInUrl="/"
            />
          )}
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? 'لديك حساب بالفعل؟ تسجيل الدخول' 
                : 'ليس لديك حساب؟ إنشاء حساب جديد'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;