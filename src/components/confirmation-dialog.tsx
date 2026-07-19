'use client'

import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    children: ReactNode
    confirmButtonText?: string
    cancelButtonText?: string
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
}: ConfirmationDialogProps) {
    if (!isOpen) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-lg border border-white/10 bg-slate-900 p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    aria-label="Fechar"
                >
                    <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <div className="mt-4 text-slate-300">{children}</div>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="rounded-full bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-red-600"
                    >
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    )
}