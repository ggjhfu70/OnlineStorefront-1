import SkeletonLoader from './SkeletonLoader';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonLoader key={index} height="h-6" width="w-full" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader key={colIndex} height="h-4" width="w-full" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;