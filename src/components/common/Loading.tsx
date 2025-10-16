interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '加载中...' }: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}
