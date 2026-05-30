import { useNotification } from '../../context/NotificationContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} className="text-emerald-500" />,
  error:   <XCircle    size={18} className="text-red-500" />,
  warning: <AlertCircle size={18} className="text-amber-500" />,
  info:    <Info       size={18} className="text-primary-500" />,
};

const borders = {
  success: 'border-l-emerald-500',
  error:   'border-l-red-500',
  warning: 'border-l-amber-500',
  info:    'border-l-primary-500',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 bg-white rounded-xl shadow-card-lg border border-slate-100 border-l-4 ${borders[t.type] || borders.info} px-4 py-3 min-w-72 max-w-sm animate-slide-up`}
        >
          <div className="shrink-0 mt-0.5">{icons[t.type] || icons.info}</div>
          <p className="flex-1 text-sm text-slate-700 font-medium">{t.message}</p>
          <button onClick={() => removeToast(t.id)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
