export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <a href="/dashboard">仪表板</a>
          </li>
          <li>
            <a href="/profile">个人资料</a>
          </li>
          <li>
            <a href="/settings">系统设置</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
