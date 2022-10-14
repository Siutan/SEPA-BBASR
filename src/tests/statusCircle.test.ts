import '@testing-library/jest-dom';

import { beforeEach, test, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';

import StatusCircle from '../lib/components/StatusCircle.svelte';

beforeEach(cleanup);

// Tests if Status Cirlce renders
test('can render', () => {
	render(StatusCircle);
});

// Tests if Status Circle renders with Success status
test('can render correct status (Success)', () => {
	render(StatusCircle, { status: 'success' });
	const statusCircle = screen.getByTestId('success');
	expect(statusCircle).toBeInTheDocument();
});

// Tests if Status Circle renders with Pending status
test('can render correct status (Pending)', () => {
	render(StatusCircle, { status: 'pending' });
	const statusCircle = screen.getByTestId('pending');
	expect(statusCircle).toBeInTheDocument();
});

// Tests if Status Circle renders with Failed status
test('can render correct status (Failed)', () => {
	render(StatusCircle, { status: 'failed' });
	const statusCircle = screen.getByTestId('failed');
	expect(statusCircle).toBeInTheDocument();
});

// Tests if Status Circle renders with Failed status if invalid status is passed
test('can render correct status (Invalid)', () => {
	render(StatusCircle, { status: 'invalid' });
	const statusCircle = screen.getByTestId('failed');
	expect(statusCircle).toBeInTheDocument();
});
