interface EmptyProps {
  message?: string;
  description?: string;
}

export default function Empty({
  message = '暂无数据',
  description = '当前没有可显示的内容',
}: EmptyProps) {
  return (
    <div className="empty-container">
      <div className="empty-icon">📭</div>
      <h3 className="empty-title">{message}</h3>
      <p className="empty-description">{description}</p>
    </div>
  );
}
