import '@testing-library/jest-dom';

import { beforeEach, test, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';

import CreateAccount from '../lib/components/auth/CreateAccount.svelte';

beforeEach(cleanup);

// Tests if Logout button renders
test('can render', () => {
	render(CreateAccount);
});

// Tests if input fields render
test('can find the First Name input', () => {
	render(CreateAccount);
	const input = screen.getByLabelText('First Name');
	expect(input).toBeInTheDocument();
});

// Tests if input fields render
test('can find the Last Name input', () => {
	render(CreateAccount);
	const input = screen.getByLabelText('Last Name');
	expect(input).toBeInTheDocument();
});

// Tests if input fields render
test('can find the Email input', () => {
	render(CreateAccount);
	const input = screen.getByLabelText('Company Email');
	expect(input).toBeInTheDocument();
});

// Tests if input fields render
test('can find the Employee ID input', () => {
	render(CreateAccount);
	const input = screen.getByLabelText('Employee ID');
	expect(input).toBeInTheDocument();
});

// Tests if input fields render
test('can find the Password input', () => {
	render(CreateAccount);
	const input = screen.getByLabelText('Password');
	expect(input).toBeInTheDocument();
});

// Tests if input fields render
test('can find the Confirm Password input', () => {
	render(CreateAccount);
	const input = screen.getByLabelText('Confirm Password');
	expect(input).toBeInTheDocument();
});

// Tests if input fields render
test('can find the Admin Switch', () => {
	render(CreateAccount);
	const input = screen.getByTestId('adminSwitch');
	expect(input).toBeInTheDocument();
});

// Tests if input fields render
test('can find the Create Account button', () => {
	render(CreateAccount);
	const input = screen.getByText('Create Account');
	expect(input).toBeInTheDocument();
});
