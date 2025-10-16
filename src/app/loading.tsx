import LoadingComponent from '@/components/common/Loading';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingComponent message="应用加载中..." />
    </div>
  );
}
