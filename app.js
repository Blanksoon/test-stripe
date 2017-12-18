const keyPublishable = 'pk_test_qghYMOBiEuWIDjedt7DNPA0w'
const keySecret = 'sk_test_M0ntlFuCChOkVnYc7Z1kShLO'
const stripe = require('stripe')(keySecret)
import {
  createSource,
  createCustomer,
  retrieveSource,
  chargePayment,
  createToken,
} from './stripe'

const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

app.set('view engine', 'pug')
app.set('view engine', 'ejs')
app.use(require('body-parser').urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))
app.use(cors())
console.log(__dirname)
app.use(bodyParser.json())

app.get('/', (req, res) => res.render('index.pug', { keyPublishable }))

app.get('/payment', (req, res) => res.render('stripe.ejs'))

app.get('/create-source', (req, res) => {
  console.log('hi create-soure')
  stripe.sources.create(
    {
      type: 'alipay',
      amount: 1099,
      currency: 'usd',
      owner: {
        email: 'admin.test@mail.com',
      },
      redirect: {
        return_url: 'http://localhost:4567/confirm-user',
      },
    },
    function(err, source) {
      if (err) {
        res.send(err)
      } else {
        res.send(source)
      }
    }
  )
})

app.get('/confirm-user', async (req, res) => {
  try {
    const result = await retrieveSource(req.query.source)
    console.log('111111111111', result.status)
    if (result.status === 'chargeable') {
      console.log('22222222222', result.status)
      const resultPayment = await chargePayment(result.id, result.customer)
      console.log('333333333', resultPayment.status)
      if (resultPayment.status === 'succeeded') {
        res.send(true)
      } else {
        res.send(false)
      }
    }
    //console.log(result)
    // console.log('body', req.body)
    // console.log('query', req.query)
    // console.log('params', req.params)
    //res.send('hi')
  } catch (err) {
    console.log(err)
    res.status(200).send(err)
  }
})

app.post('/retrieve-source', (req, res) => {
  stripe.sources.retrieve(req.body.source, function(err, source) {
    if (err) {
      res.send(err)
    } else {
      res.send(source)
    }
  })
})

app.post('/retrieve-customer', (req, res) => {
  stripe.customers.retrieve(req.body.customer, function(err, source) {
    if (err) {
      res.send(err)
    } else {
      res.send(source)
    }
  })
})

app.post('/retrieve-charges', (req, res) => {
  stripe.charges.retrieve(req.body.charge, function(err, source) {
    if (err) {
      res.send(err)
    } else {
      res.send(source)
    }
  })
})

app.post('/create-payment', (req, res) => {
  console.log('req', req.body)
  stripe.customers.createSource(
    req.body.user,
    {
      source: req.body.source,
    },
    function(err, source) {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        console.log(source)
        res.send(source)
      }
    }
  )
})

app.post('/creat-customer', (req, res) => {
  stripe.customers.create(
    { email: req.body.email, source: req.body.source },
    function(err, source) {
      if (err) {
        res.send(err)
      } else {
        res.send(source)
      }
    }
  )
})

app.post('/charge-alipay', (req, res) => {
  // stripe.customers.deleteSource(
  //   'cus_By3VIbhqJW9qtU',
  //   'card_1Ba7OCD4qrfRtagsiLMB1664',
  stripe.charges.create(
    {
      amount: 1099,
      description: 'Sample Charge',
      currency: 'usd',
      source: req.body.source,
      customer: req.body.customer,
    },
    function(err, source) {
      if (err) {
        res.send(err)
      } else {
        res.send(source)
      }
    }
  )
})

app.post('/charge', (req, res) => {
  let amount = 500

  console.log(req.body)
  // stripe.customers
  //   .createSource('cus_By3c84u6vdUZ1h', {
  //     source: 'src_1Ba7ZLD4qrfRtagsol3JdV7D',
  //   })
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then(customer => {
      console.log('customer', customer)
      return stripe.charges.create({
        amount,
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id,
      })
    })
    .then(charge => {
      console.log('a', charge)
      return res.render('charge.pug')
    })
})

app.post('/alipay', async (req, res) => {
  console.log('hi')
  try {
    const sourceResult = await createSource()
    const paymentResult = await createCustomer(req.body.email, sourceResult.id)
    console.log('aaaaaaaaaaa', paymentResult.sources.data[0].redirect.url)
    res.redirect(paymentResult.sources.data[0].redirect.url)
  } catch (err) {
    console.log(err)
    res.status(200).send(err)
  }
})

app.post('/credit-card', async (req, res) => {
  try {
    const sourceResult = await createToken(
      req.body.number,
      req.body.exp_month,
      req.body.exp_year,
      req.body.cvc
    )
    console.log('111111111', sourceResult.id)
    const customerResult = await createCustomer(req.body.email, sourceResult.id)
    console.log('222222222', customerResult)
    //const paymaneResult = await chargePayment(customerResult.id,)
    // console.log('aaaaaaaaaaa', paymentResult.sources.data[0].redirect.url)
    // res.redirect(paymentResult.sources.data[0].redirect.url)
    res.send('hi')
  } catch (err) {
    console.log(err)
    res.status(200).send(err)
  }
})

app.listen(4567)
