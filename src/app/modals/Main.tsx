import { UserAccount } from '../model/UserAccount.js';

interface MainProps {
  account: UserAccount;
}

export function Main({ account }: MainProps) {
  return (
    <>
      {account.address}, {account.username}
    </>
  );
}
