import React from 'react';
import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  actionButton?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  tag,
  actionButton,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
      <div>
        {tag && (
          <div className="flex items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tag}</span>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight uppercase text-slate-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
    </div>
  );
};
