import '@testing-library/jest-dom';

import { beforeEach, test, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';

import Input from '../lib/components/Input.svelte';

beforeEach(cleanup);

// Tests if Input renders
test('can render', () => {
	render(Input, {
		id: 'employeeIdInput',
		name: 'employeeIdInput',
		label: 'Employee Id',
		disabled: false
	});
	const input = screen.getByLabelText('Employee Id');
	expect(input).toBeInTheDocument();
});

// Test if value is empty
test('has empty value', () => {
	render(Input, {
		id: 'employeeIdInput',
		name: 'employeeIdInput',
		label: 'Employee Id',
		disabled: false
	});
	const input = screen.getByLabelText('Employee Id');
	expect(input).toHaveValue('');
});

// Test if type is password
test('can hide value', () => {
	render(Input, {
		id: 'passwordInput',
		name: 'passwordInput',
		label: 'Password',
		disabled: false,
		type: 'password'
	});
	const input = screen.getByLabelText('Password');
	expect(input).toHaveAttribute('type', 'password');
});

// Test if svg icon is rendered
test('can render hide icon', () => {
	render(Input, {
		id: 'passwordInput',
		name: 'passwordInput',
		label: 'Password',
		disabled: false,
		type: 'password'
	});
	const icon = document.getElementById('hide-icon');
	expect(icon).toBeInTheDocument();
});
