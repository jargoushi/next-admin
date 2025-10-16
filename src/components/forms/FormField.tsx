interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

export default function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
