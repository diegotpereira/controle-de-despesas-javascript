const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
    // console.log({ incomeDisplay, expenseDisplay, balanceDisplay });

// console.log(transactionsUl);
// let transactions = [
//     { id: 1, name: 'Bolo de brigadeiro', amount: -20 },
//     { id: 2, name: 'Salário', amount: 300 },
//     { id: 3, name: 'Torta de frango', amount: -10 },
//     { id: 4, name: 'Violão', amount: 150 }
// ]

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))

let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {

    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')


    li.classList.add(CSSClass)
    li.innerHTML = `
    ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.append(li)
        // console.log(li);
        // console.log(operator);
        // <li class="minus">
        //   Salário <span>-$400</span><button class="delete-btn">x</button>
        // </li>
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts.filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    // Armazendo valores em array
    const transactionsAmounts = transactions.map(({ amount }) => amount)

    const total = getTotal(transactionsAmounts)

    const income = getIncome(transactionsAmounts)

    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
        // console.log(expense);
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

// addTransactionIntoDOM(transactions[0])
// addTransactionIntoDOM(transactions[1])
// Criando transação e adicionando no array
const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const clearInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}
const handleFormSubmit = event => {
    event.preventDefault()

    // Constantes de valores inseridos no input
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''
        // Verifica se algum input não foi preenchido
    if (isSomeInputEmpty) {
        alert('Por favor, preencha nome e valor da transação')
        return
    }


    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    clearInputs()
}

// Eventos do Form
form.addEventListener('submit', handleFormSubmit)