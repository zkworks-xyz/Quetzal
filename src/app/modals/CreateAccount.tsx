import { UserAccount } from "../model/UserAccount.js";

export interface CreateAccountProps {
  onAccountCreated: (account: UserAccount) => void;
}

export function CreateAccount({ onAccountCreated }: CreateAccountProps) {
  return (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-16">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          Create Account
        </h1>
        <button
          onClick={() => onAccountCreated({ username: 'test', address: '0x123' })}
          className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Continue
        </button>
        Main
      </div>
    </section>
  );
}
