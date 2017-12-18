import Stripe from 'stripe'
const stripes = Stripe('pk_test_qghYMOBiEuWIDjedt7DNPA0w')
const test = async card => {
  //const { token, error } = await stripes.createToken(card)
  //console.log(token, error)
}
test({
  name: 'T',
  address_line1: 't',
  address_line2: '5',
  address_city: 't',
  address_state: 't',
  address_zip: 't',
  address_country: 't',
})
console.log('assss')
