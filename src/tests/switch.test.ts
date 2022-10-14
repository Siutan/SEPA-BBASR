import '@testing-library/jest-dom';

import { beforeEach, test, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';

import Switch from '../lib/components/Switch.svelte';

beforeEach(cleanup);

// Tests if Logout button renders
test('can Render as Inner value true', () => {
	render(Switch, {
		label: 'Switch',
		design: 'inner',
		options: ['Yes', 'No'],
		fontSize: 15,
		value: true
	});
});

// Tests if Logout button renders
test('can Render as Inner value false', () => {
	render(Switch, {
		label: 'Switch',
		design: 'inner',
		options: ['Yes', 'No'],
		fontSize: 15,
		value: false
	});
});

// Tests if Switch renders with correct text
test('can find the Option 1 as Inner', () => {
	const { getByText } = render(Switch, {
		label: 'Switch',
		design: 'inner',
		options: ['Yes', 'No'],
		fontSize: 15,
		value: true
	});
	expect(getByText('Yes')).toBeDefined();
});

// Tests if Switch renders with correct text
test('can find the Option 2 as Inner', () => {
	const { getByText } = render(Switch, {
		label: 'Switch',
		design: 'inner',
		options: ['Yes', 'No'],
		fontSize: 15,
		value: true
	});
	expect(getByText('No')).toBeDefined();
});

// Tests if Switch renders with correct text
test('can Render as Slider value true', () => {
	render(Switch, {
		label: 'Switch',
		design: 'slider',
		options: ['Yes', 'No'],
		fontSize: 15,
		value: true
	});
});

// Tests if Switch renders with correct text
test('can Render as Slider value false', () => {
	render(Switch, {
		label: 'Switch',
		design: 'slider',
		options: ['Yes', 'No'],
		fontSize: 15,
		value: false
	});
});
