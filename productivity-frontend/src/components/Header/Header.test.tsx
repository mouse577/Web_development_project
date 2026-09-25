import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  beforeEach(() =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
        <Routes>
          <Route path='/' element={<p>Home page here</p>} />
          <Route path='/account' element={<p>Account page here</p>} />
        </Routes>
      </MemoryRouter>,
    ),
  );

  it('should display properly', () => expect(screen.getByText('Taskagotchi')).toBeInTheDocument());

  it('should redirect to the correct page', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByText('Account'));
    expect(screen.getByText('Account page here')).toBeInTheDocument();

    await user.click(screen.getByText('Home'));
    expect(screen.getByText('Home page here')).toBeInTheDocument();
  });
});
