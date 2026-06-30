'use client';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import {
  ReactNode,
  useEffect,
} from 'react';
import { X } from 'lucide-react';

type ModalSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;

  title: string;
  description?: string;

  children: ReactNode;

  footer?: ReactNode;

  icon?: ReactNode;

  size?: ModalSize;

  loading?: boolean;

  closeOnBackdrop?: boolean;
}

const SIZE = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function BaseModal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  icon,
  size = 'md',
  loading = false,
  closeOnBackdrop = true,
}: BaseModalProps) {
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handler);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handler);
    };
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>

      {open && (

        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"

          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}

        >

          {/* Overlay */}

          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => {
              if (closeOnBackdrop && !loading) {
                onClose();
              }
            }}
          />

          {/* Modal */}

          <motion.div

            initial={{
              opacity: 0,
              y: 40,
              scale: 0.97,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              y: 25,
              scale: 0.98,
            }}

            transition={{
              duration: 0.2,
            }}

            onClick={(e) => e.stopPropagation()}

            className={`
relative
bg-white
w-full
${SIZE[size]}
rounded-t-3xl
sm:rounded-3xl
shadow-2xl
overflow-hidden
max-h-[92vh]
flex
flex-col
`}
          >

            {/* Header */}

            <div
              className="
px-6
py-5
border-b
border-gray-100
flex
items-start
justify-between
gap-4
"
            >

              <div className="flex gap-4">

                {icon && (

                  <div
                    className="
w-11
h-11
rounded-2xl
bg-blue-50
text-blue-600
flex
items-center
justify-center
"
                  >
                    {icon}
                  </div>

                )}

                <div>

                  <h2
                    className="
text-lg
font-bold
text-gray-900
"
                  >
                    {title}
                  </h2>

                  {description && (

                    <p
                      className="
mt-1
text-sm
text-gray-500
"
                    >
                      {description}
                    </p>

                  )}

                </div>

              </div>

              <button
                disabled={loading}
                onClick={onClose}
                className="
w-10
h-10
rounded-xl
hover:bg-gray-100
transition
flex
items-center
justify-center
disabled:opacity-40
"
              >
                <X size={18} />
              </button>

            </div>

            {/* Body */}

            <div
              className="
flex-1
overflow-y-auto
px-6
py-6
"
            >
              {children}
            </div>

            {/* Footer */}

            {footer && (

              <div
                className="
border-t
border-gray-100
px-6
py-4
bg-gray-50/70
"
              >
                {footer}
              </div>

            )}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}