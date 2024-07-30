import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import Login from '../../components/Auth/Login';

test('renders Login component', () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
            <Login />
        </Provider>
    );

    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
});

test('handles login form submission', () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
            <Login />
        </Provider>
    );

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(getByText('Login'));

    expect(getByText('Logging in...')).toBeInTheDocument();
});
