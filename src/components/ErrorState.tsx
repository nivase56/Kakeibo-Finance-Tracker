interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
  }
  
  export default function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg inline-block">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="mt-2 text-red-600 dark:text-red-400">{message}</p>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-4 text-blue-600 dark:text-blue-400 underline"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }