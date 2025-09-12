import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  type?: 'error' | 'warning' | 'success';
}

interface ValidatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rules?: ValidationRule[];
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const ValidatedInput = ({
  label,
  value,
  onChange,
  rules = [],
  type = "text",
  placeholder,
  required = false,
  className = ""
}: ValidatedInputProps) => {
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    message: string;
    type: 'error' | 'warning' | 'success' | 'idle';
  }>({ isValid: true, message: "", type: 'idle' });

  useEffect(() => {
    if (!value && !required) {
      setValidationState({ isValid: true, message: "", type: 'idle' });
      return;
    }

    if (!value && required) {
      setValidationState({ 
        isValid: false, 
        message: `${label} is required`, 
        type: 'error' 
      });
      return;
    }

    for (const rule of rules) {
      if (!rule.test(value)) {
        setValidationState({
          isValid: false,
          message: rule.message,
          type: rule.type || 'error'
        });
        return;
      }
    }

    setValidationState({ 
      isValid: true, 
      message: "Valid", 
      type: 'success' 
    });
  }, [value, rules, required, label]);

  const getIcon = () => {
    switch (validationState.type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getInputStyles = () => {
    switch (validationState.type) {
      case 'success':
        return "border-green-500 focus:border-green-500";
      case 'error':
        return "border-red-500 focus:border-red-500";
      case 'warning':
        return "border-yellow-500 focus:border-yellow-500";
      default:
        return "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("pr-10", getInputStyles())}
        />
        
        {validationState.type !== 'idle' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getIcon()}
          </div>
        )}
      </div>
      
      {validationState.message && validationState.type !== 'idle' && (
        <p className={cn(
          "text-xs animate-fade-in",
          {
            "text-red-500": validationState.type === 'error',
            "text-yellow-600": validationState.type === 'warning',
            "text-green-600": validationState.type === 'success'
          }
        )}>
          {validationState.message}
        </p>
      )}
    </div>
  );
};

// Common validation rules
export const emailValidation: ValidationRule[] = [
  {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Please enter a valid email address",
    type: 'error'
  }
];

export const phoneValidation: ValidationRule[] = [
  {
    test: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value),
    message: "Please enter a valid phone number",
    type: 'error'
  }
];

export const passwordValidation: ValidationRule[] = [
  {
    test: (value) => value.length >= 8,
    message: "Password must be at least 8 characters",
    type: 'error'
  },
  {
    test: (value) => /[A-Z]/.test(value),
    message: "Password should contain at least one uppercase letter",
    type: 'warning'
  },
  {
    test: (value) => /[0-9]/.test(value),
    message: "Password should contain at least one number",
    type: 'warning'
  }
];

export const nameValidation: ValidationRule[] = [
  {
    test: (value) => value.trim().length >= 2,
    message: "Name must be at least 2 characters",
    type: 'error'
  },
  {
    test: (value) => value.trim().length <= 100,
    message: "Name must be less than 100 characters",
    type: 'error'
  }
];