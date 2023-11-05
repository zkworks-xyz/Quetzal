import { PrimaryButton, SecondaryButton } from '../components/button.js';

interface WaitDialogProps {
  title: string;
  message?: string;
  primaryAction?: () => void;
  primaryLabel?: string;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}

export function InfoDialog({
  title,
  message,
  primaryAction,
  primaryLabel,
  secondaryAction,
  secondaryLabel,
}: WaitDialogProps) {
  const isPrimary = primaryAction && primaryLabel;
  const isSecondary = secondaryAction && secondaryLabel;
  return (
    <section className="bg-white dark:bg-gray-900 max-w-xl rounded-lg px-8 py-16">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          {title}
        </h1>
        {message && <p className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">{message}</p>}
        {(isPrimary || isSecondary) && (
          <div className="flex items-center justify-center w-full mt-6 space-x-2">
            {isPrimary && <PrimaryButton label={primaryLabel} action={primaryAction} />}
            {isSecondary && <SecondaryButton label={secondaryLabel} action={secondaryAction} />}
          </div>
        )}
      </div>
    </section>
  );
}
