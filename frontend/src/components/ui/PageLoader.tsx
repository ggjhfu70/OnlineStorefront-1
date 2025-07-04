import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  text?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ text = 'Đang tải...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

export default PageLoader;