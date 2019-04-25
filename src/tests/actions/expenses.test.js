import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { startAddExpense, editExpense, removeExpense } from '../../actions/expenses'
import expenses from '../fixtures/expenses'
import database from '../../firebase/firebase'

const createMockStore = configureMockStore([thunk])

// test('Should setup add expense action object with provided values', () => {
//   const action = startAddExpense(expenses[2])

//   expect(action).toEqual({
//     type: 'ADD_EXPENSE',
//     expense: expenses[2]
//   })
// })

test('Should add expense to database and store', (done) => {
  const store = createMockStore({})

  const expenseData = {
    description: 'Food',
    amount: 2345,
    note: '',
    createAt: 1000
  }

  store.dispatch(startAddExpense(expenseData))
    .then(() => {
      const actions = store.getActions()

      expect(actions[0]).toEqual({
        type: 'ADD_EXPENSE',
        expense: {
          id: expect.any(String),
          ...expenseData
        }
      })

      return database.ref(`expenses/${actions[0].expense.id}`).once('value')
    })
      .then((snapshot) => {
        expect(snapshot.val()).toEqual(expenseData)

        done()
      })
})

test('Should add expense with default to database and store', (done) => {
  const store = createMockStore({})

  const defaultExpenseData = {
    description: '',
    amount: 0,
    note: '',
    createAt: 0
  }

  store.dispatch(startAddExpense({}))
    .then(() => {
      const actions = store.getActions()

      expect(actions[0]).toEqual({
        type: 'ADD_EXPENSE',
        expense: {
          id: expect.any(String),
          ...defaultExpenseData
        }
      })

      return database.ref(`expenses/${actions[0].expense.id}`).once('value')
    })
      .then((snapshot) => {
        expect(snapshot.val()).toEqual(defaultExpenseData)

        done()
      })
})

// test('Should setup add expense action object with default values', () => {
//   const action = addExpense()

//   expect(action).toEqual({
//     type: 'ADD_EXPENSE',
//     expense: {
//       id: expect.any(String),
//       description: '',
//       note: '',
//       amount: 0,
//       createAt: 0
//     }
//   })
// })

test('Should setup edit expense action object', () => {
  const action = editExpense(99, { note: 'New note value!' })

  expect(action).toEqual({
    type: 'EDIT_EXPENSE',
    id: 99,
    updates: { note: 'New note value!' }
  })
})

test('Should setup remove expense action object', () => {
  const action = removeExpense({ id: '1234asd' })

  expect(action).toEqual({
    type: 'REMOVE_EXPENSE',
    id: '1234asd'
  })
})