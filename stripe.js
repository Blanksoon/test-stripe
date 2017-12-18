const keyPublishable = 'pk_test_qghYMOBiEuWIDjedt7DNPA0w'
const keySecret = 'sk_test_M0ntlFuCChOkVnYc7Z1kShLO'
const stripe = require('stripe')(keySecret)

export function createSource() {
  return new Promise((resolve, reject) => {
    stripe.sources.create(
      {
        type: 'alipay',
        amount: 5,
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
          reject(err)
        } else {
          resolve(source)
        }
      }
    )
  })
}

export function createCustomer(email, source) {
  return new Promise((resolve, reject) => {
    stripe.customers.create({ email: email, source: source }, function(
      err,
      source
    ) {
      if (err) {
        reject(err)
      } else {
        resolve(source)
      }
    })
  })
}

export function retrieveSource(sourceId) {
  return new Promise((resolve, reject) => {
    stripe.sources.retrieve(sourceId, function(err, source) {
      if (err) {
        reject(err)
      } else {
        resolve(source)
      }
    })
  })
}

export function chargePayment(sourceId, customer) {
  return new Promise((resolve, reject) => {
    stripe.charges.create(
      {
        amount: 5,
        description: 'Sample Charge',
        currency: 'usd',
        source: sourceId,
        customer: customer,
      },
      function(err, source) {
        if (err) {
          reject(err)
        } else {
          resolve(source)
        }
      }
    )
  })
}

export function createToken(number, exp_month, exp_year, cvc) {
  return new Promise((resolve, reject) => {
    stripe.tokens.create(
      {
        card: {
          number: number,
          exp_month: exp_month,
          exp_year: exp_year,
          cvc: cvc,
        },
      },
      function(err, source) {
        if (err) {
          reject(err)
        } else {
          resolve(source)
        }
      }
    )
  })
}
