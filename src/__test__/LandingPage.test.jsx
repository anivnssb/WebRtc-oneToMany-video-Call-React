import React from 'react';
import { render, screen, logRoles } from '@testing-library/react';
import Landing from '../components/Landing';

test('renders button element', () => {
  render(<Landing />);
  // logRoles(screen.getByTestId('landing-page'));
  const buttonElement = screen.queryByRole('textarea', {
    name: 'Start a Meeting',
  });
  expect(buttonElement).toBeNull();
});
