
import React, { forwardRef } from 'react';

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-cyber-green mb-2">
            {'>'} {label}
          </label>
        )}
        <input
          ref={ref}
          className={`cyber-input w-full ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

export default CyberInput;
