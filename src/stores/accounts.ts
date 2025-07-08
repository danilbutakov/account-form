import { defineStore } from 'pinia';

interface Account {
	id: string;
	labels: { text: string }[];
	type: 'LDAP' | 'Local';
	login: string;
	password: string | null;
}

export const useAccountStore = defineStore('accounts', {
	state: () => ({
		accounts: JSON.parse(localStorage.getItem('accounts') || '[]') as Account[]
	}),
	actions: {
		addAccount() {
			this.accounts.push({
				id: crypto.randomUUID(),
				labels: [],
				type: 'Local',
				login: '',
				password: ''
			});
			this.saveToLocalStorage();
		},
		removeAccount(id: string) {
			this.accounts = this.accounts.filter((account) => account.id !== id);
			this.saveToLocalStorage();
		},
		updateAccount(id: string, updatedAccount: Partial<Account>) {
			const index = this.accounts.findIndex((account) => account.id === id);
			if (index !== -1) {
				this.accounts[index] = { ...this.accounts[index], ...updatedAccount };
				this.saveToLocalStorage();
			}
		},
		saveToLocalStorage() {
			localStorage.setItem('accounts', JSON.stringify(this.accounts));
		}
	}
});
