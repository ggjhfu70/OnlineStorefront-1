interface SkeletonLoaderProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full',
  rounded = false 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${height} ${width} ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
    />
  );
};

export default SkeletonLoader;