import '@testing-library/jest-dom';

import { beforeEach, test, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';

import Search from '../lib/components/search/search.svelte';

beforeEach(cleanup);

// Tests if Logout button renders
test('can render', () => {
	render(Search);
});

// Tests if search label renders with correct text
test('can find the correct button text', () => {
	render(Search);
	const input = screen.getByLabelText('Search by Claim ID');
	expect(input).toBeInTheDocument();
});
