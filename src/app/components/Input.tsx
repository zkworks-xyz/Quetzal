import classNames from 'classnames';

export interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
}
export function Label({ children, htmlFor }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 text-left">
      {children}
    </label>
  );
}

export interface InputProps {
  placeholder?: string;
  id: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
}

export function Input({ placeholder = '', onChange = () => {}, type = 'text', id }: InputProps) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      className={classNames(
        'block w-full rounded-md border-0 bg-white/5 px-2 py-2 text-gray-900 dark:text-white shadow-sm',
        'ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6',
      )}
      onChange={onChange}
    />
  );
}
