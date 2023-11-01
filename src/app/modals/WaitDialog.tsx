interface WaitDialogProps {
  message: string;
}

export function WaitDialog({message}: WaitDialogProps) {
  return (
    <section className="bg-white dark:bg-gray-900 max-w-xl rounded-lg px-8 py-16">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          {message}
        </h1>
      </div>
    </section>
  );
}
