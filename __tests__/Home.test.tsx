import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

// Simulamos la función fetch global para que el test no intente llamar a la API real
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [], totalRecords: 0, page: 1, pageSize: 10 }),
  })
) as jest.Mock;

describe('Home Page', () => {
  it('debe renderizar el título de la página y el botón de nuevo incidente', () => {
    render(<Home />);

    // Ajustamos para que coincida con la nueva UI "Gestión de Incidentes"
    const titleElement = screen.getByText(/Gestión de Incidentes/i);
    const buttonElement = screen.getByText(/Nuevo Incidente/i);

    expect(titleElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });
});