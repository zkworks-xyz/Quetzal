import { CompleteAddress } from '@aztec/aztec.js';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { pxe } from '../../config.js';

export function walletsToItems(wallets: CompleteAddress[]) {
    const developerWalletNames = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy'];
    return wallets.map(({ address }: CompleteAddress, index) => {
        return { label: developerWalletNames[index], secondary: address.toShortString() };
    });
}

export function useWallets(): UseQueryResult<CompleteAddress[]> {
    return useQuery({
        queryKey: ['getRegisteredAccounts'],
        queryFn: () => pxe.getRegisteredAccounts()
    });
}
