<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" edit-icon="done">
      <div>
        {{ $t('steps.coupon.title') | capitalize }}
        <span>
          &mdash;
          <a>{{ $t('generic.edit') }}</a>
        </span>
      </div>
      <small>{{ $t('steps.coupon.hint') | capitalize }}</small>
    </v-stepper-step>
    <v-stepper-content :step="step">
      <div class="coupon" v-if="showGiftCardOrCoupon">
        <CouponGiftCardOrCouponField />
        <v-btn
        id="delivery-step-submit"
        color="primary"
        @click="submit()"
        :block="isMobile"
        :disabled="disabled"
        :loading="buttons.loading_delivery"
        >{{ submitLabel }}</v-btn>
      </div>
    </v-stepper-content>
  </div>
</template>

<script>
// import _ from 'lodash'
import { stepMixin } from '@/mixins/stepMixin'
import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'

import CouponGiftCardOrCouponField from '@/components/fields/CouponGiftCardOrCouponField'

export default {
  components: {
    CouponGiftCardOrCouponField
  },
  mixins: [stepMixin],
  computed: {
    disabled () {
      return this.invalid_payment_method
    },
    submitLabel () {
      return this.$t('buttons.continue_to_payment')
    },
    showGiftCardOrCoupon () {
      return (
        this.order.editable &&
        process.env.VUE_APP_HIDE_GIFT_CARD_OR_COUPON !== 'TRUE'
      )
    },
    ...mapState(['buttons', 'errors']),
    ...mapFields([
      'validations.invalid_payment_method',
      'order',
      'order.payment_method',
      'selected_payment_option_component'
    ])
  },
  methods: {
    submit () {
      this.nextStep()
    }
  }
}
</script>

<style lang="scss">

.v-input--selection-controls {
  .v-input__control {
    width: 100% !important;
  }
}

.order-error {
  color: $ERROR_COLOR;
  margin-top: 1rem;
}

.sm-and-up {
  .payment-method-fields {
    padding: 2rem 2rem 1rem;
  }
}
</style>
