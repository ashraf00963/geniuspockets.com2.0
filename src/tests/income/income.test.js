import reducer, { addIncome, fetchIncomes } from '../../redux/slices/incomeSlice';
import { configureStore } from '@reduxjs/toolkit';
import api from '../../utils/api';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(api);
const store = configureStore({ reducer: { income: reducer } });

describe('income slice', () => {
  it('should handle initial state', () => {
    expect(store.getState().income).toEqual({
      incomes: [],
      analysis: null,
      loading: false,
      error: null,
    });
  });

  it('should handle adding income', async () => {
    const incomeData = { user_id: 1, type: 'salary', amount: 2000, hpw: 30 };
    mock.onPost('/addIncome.php').reply(200, { success: true, data: incomeData });

    await store.dispatch(addIncome(incomeData));

    const state = store.getState().income;
    expect(state.incomes).toHaveLength(1);
    expect(state.incomes[0]).toEqual(incomeData);
  });

  it('should handle fetching incomes', async () => {
    const incomesData = [
      { id: 1, user_id: 1, type: 'salary', amount: 2000, hpw: 30, added_at: '2023-01-01' },
      { id: 2, user_id: 1, type: 'passive', amount: 500, added_at: '2023-01-02' },
    ];
    mock.onGet('/getIncome.php?user_id=1').reply(200, { success: true, data: incomesData });

    await store.dispatch(fetchIncomes(1));

    const state = store.getState().income;
    expect(state.incomes).toHaveLength(2);
    expect(state.incomes).toEqual(incomesData);
  });
});
