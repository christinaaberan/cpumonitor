import React from "react";
import ReactDOM from "react-dom";
import { cleanup, mount, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from './App';

afterEach(cleanup);

describe('App', () => {
  it("renders without crashing", () => {
    render(<App />);

    screen.debug();
  });

  it('renders header', () => {
    render(<App />);
    expect(screen.getByTestId('heading')).toHaveTextContent('CPU Usage Dashboard')
  });

  test('doesnt show items while value undefined', async () => {
    render(<App />);


    expect(await screen.queryByText('undefined%')).toBeNull();
  });
});
