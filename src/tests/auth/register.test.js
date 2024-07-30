import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import Register from '../../components/Auth/Register';

test('renders Register component', () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
            <Register />
        </Provider>
    );

    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
});

test('handles register form submission', () => {
    const { getByPlaceholderText, getByText } = render(
        <Provider store={store}>
            <Register />
        </Provider>
    );

    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'ashrf00963@gmail.com' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'Ashrf.00963' } });

    fireEvent.click(getByText('Register'));

    expect(getByText('Registering...')).toBeInTheDocument();
});