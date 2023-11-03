interface WaitDialogProps {
  title: string;
  message?: string;
  primaryAction?: () => void;
  primaryLabel?: string;
}

export function InfoDialog({ title, message, primaryAction, primaryLabel }: WaitDialogProps) {
  return (
    <section className="bg-white dark:bg-gray-900 max-w-xl rounded-lg px-8 py-16">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          {title}
        </h1>
        {message && <p className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">{message}</p>}
        {primaryAction && primaryLabel && (
          <button
            onClick={() => primaryAction()}
            className="px-6 py-2 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Retry
          </button>
        )}
      </div>
    </section>
  );
}
