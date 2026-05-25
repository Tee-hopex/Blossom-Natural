interface Props {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export default function LoadingSpinner({ fullScreen = false, size = 'lg' }: Props) {
  const spinner = (
    <div
      className={`${sizeMap[size]} rounded-full border-sage border-t-terracotta animate-spin`}
      aria-label="Loading..."
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cream flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="font-heading text-brown/60 text-lg italic">Blossom Natural</p>
        </div>
      </div>
    );
  }

  return <div className="flex justify-center py-12">{spinner}</div>;
}
