interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export default function FormContainer({ title, children, onSubmit }: FormContainerProps) {
  return (
    <div className="form-container">
      <h2 className="form-title">{title}</h2>
      <form className="form" onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}
