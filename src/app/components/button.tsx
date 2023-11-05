import classNames from 'classnames';

export interface ButtonProps {
  label: string;
  action: () => void;
  classes?: string;
}

export function PrimaryButton({ label, action, classes = '' }: ButtonProps) {
  return (
    <button
      onClick={() => action()}
      className={classNames(
        'px-3 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform',
        'bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300',
        'mt-4 focus:ring-opacity-50',
        classes,
      )}
    >
      {label}
    </button>
  );
}

export function SecondaryButton({ label, action }: ButtonProps) {
  return (
    <button
      onClick={() => action()}
      className={classNames(
        'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1',
        'mt-4 ring-inset ring-gray-300 hover:bg-gray-50',
      )}
    >
      {label}
    </button>
  );
}

export function SmallButton({ label, action }: ButtonProps) {
  return (
    <button
      onClick={action}
      className={classNames(
        'px-3 py-1 ml-4 text-xs font-medium tracking-wide text-white capitalize transition-colors',
        'duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring',
        'focus:ring-blue-300 focus:ring-opacity-50',
      )}
    >
      {label}
    </button>
  );
}
