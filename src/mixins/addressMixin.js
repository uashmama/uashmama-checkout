import _ from 'lodash'
import countries from '@/data/countries'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import CustomerAddressFields from '@/components/fields/CustomerAddressFields'

export const addressMixin = {
  components: {
    CustomerAddressFields
  },
  data () {
    return {
      billing: true
    }
  },
  computed: {
    countries () {
      return countries
    },
    states () {
      return this.hasStates ? this.selectedCountry.states : []
    },
    selectedCountry () {
      // eslint-disable-next-line no-undef
      return _.find(countries, { code: this.country_code })
    },
    hasStates () {
      return !(
        _.isEmpty(this.selectedCountry) ||
        _.isEmpty(this.selectedCountry.states)
      )
    },
    requiresBillingInfo () {
      return this.billing && this.order.requires_billing_info
    },
    requiresInvoiceVatNumber () {
      return this.billing && this.order._invoice_requested && this.order._invoice_vat_number.length === 0
    },
    showAddressBook () {
      return !_.isEmpty(this.addresses)
    },
    showBillingAddress () {
      return !this._billing_address_clone_id
    },
    showShippingAddress () {
      return !this._shipping_address_clone_id
    },
    ...mapState(['order', 'validations']),
    ...mapFields([
      'customer.addresses',
      'order._billing_address_clone_id',
      'order._shipping_address_clone_id'
    ])
  },
  validations: {
    first_name: { required },
    last_name: { required },
    line_1: { required },
    city: { required },
    country_code: { required },
    state_code: { required },
    zip_code: { required },
    phone: { required },
    billing_info: {
      required: requiredIf(function (model) {
        return this.requiresBillingInfo
      })
    },
    invoice_vat_number: {
      required: requiredIf(function (model) {
        return this.requiresInvoiceVatNumber
      })
    }
  },
  methods: {
    handleBlur (fieldName) {
      this.$v[fieldName].$touch()
      if (fieldName === 'country_code') {
        this.state_code = null
      }
    },
    inputLabel (fieldName) {
      return _.capitalize(this.$t(`addresses.${fieldName}`))
    },
    errorMessages (fieldName) {
      const errors = []
      if (!this.$v[fieldName].$dirty) return errors
      const fieldError = this.$t(`errors.${fieldName}`) !== `errors.${fieldName}` ? this.$t(`errors.${fieldName}`) : this.$t('errors.generic')
      !this.$v[fieldName].required && errors.push(fieldError)
      return errors
    },
    handleInput () {
      this.updateAddressInvalid()
    }
  },
  mounted () {
    this.updateAddressInvalid()
  }
}
