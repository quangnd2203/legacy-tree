import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-6 transition-all duration-300">
            {/* Overlay/Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`
                relative w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] 
                flex flex-col overflow-hidden z-10 scale-100 opacity-100 transition-all duration-300 ease-out
                border border-white/20
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 shrink-0 bg-white/80 backdrop-blur-xs">
                    <div className="min-w-0">
                        <h3 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight leading-none truncate">{title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 items-center gap-2 hidden sm:flex">
                            System Interface <span className="w-1 h-1 rounded-full bg-indigo-400" /> Secure Encryption
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#F8FAFC]">
                    {children}
                </div>
            </div>
        </div>
    );
}
