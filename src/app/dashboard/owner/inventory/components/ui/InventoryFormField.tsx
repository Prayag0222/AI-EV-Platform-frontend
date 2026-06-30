'use client';

import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  icon?: ReactNode;
  className?: string;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    textarea?: false;
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textarea: true;
  };

type Props = InputProps | TextareaProps;

export default function InventoryFormField(props: Props) {
  const {
    label,
    error,
    hint,
    required,
    icon,
    className = '',
  } = props;

  const commonClasses = `
w-full
rounded-xl
border
bg-white
px-4
py-3
text-sm
text-gray-900
placeholder:text-gray-400
outline-none
transition-all
focus:border-blue-500
focus:ring-4
focus:ring-blue-100
disabled:bg-gray-100
disabled:cursor-not-allowed
${error ? 'border-red-300' : 'border-gray-200'}
${icon ? 'pl-11' : ''}
${className}
`;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div
            className="
absolute
left-3
top-1/2
-z-0
-translate-y-1/2
text-gray-400
pointer-events-none
"
          >
            {icon}
          </div>
        )}

        {props.textarea ? (
          <textarea
            {...props}
            rows={4}
            className={`${commonClasses} resize-none`}
          />
        ) : (
          <input
            {...props}
            className={commonClasses}
          />
        )}
      </div>

      {hint && !error && (
        <p className="text-xs text-gray-500">
          {hint}
        </p>
      )}

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}