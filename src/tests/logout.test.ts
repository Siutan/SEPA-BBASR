import '@testing-library/jest-dom';

import { beforeEach, test, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';

import Logout from '../lib/components/Logout.svelte';

beforeEach(cleanup);

// Tests if Logout button renders
test('can render', () => {
	render(Logout);
});

// Tests if Logout button renders with correct text
test('can find the correct button text', () => {
	const { getByText } = render(Logout);
	expect(getByText('Log out')).toBeDefined();
});
