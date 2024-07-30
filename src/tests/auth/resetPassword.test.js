import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import ResetPassword from '../../components/Auth/ResetPassword';

test('renders ResetPassword component', () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
            <ResetPassword />
        </Provider>
    );

    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByText('Send Reset Link')).toBeInTheDocument();
});

test('handles reset password form submission', () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
            <ResetPassword />
        </Provider>
    );

    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });

    fireEvent.click(getByText('Send Reset Link'));

    expect(getByText('Sending reset link...')).toBeInTheDocument();
});
