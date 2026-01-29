import { defineField, defineType } from 'sanity'

export const bookingType = defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    defineField({
        name: 'orderNumber',
        title: 'Order Number',
        type: 'string',
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{type: 'event'}],
    }),
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'tableType',
      title: 'Table Type',
      type: 'string',
      options: {
        list: [
          {title: 'Regular', value: 'regular'},
          {title: 'Wall', value: 'wall'},
          {title: 'Premium', value: 'premium'},
        ]
      }
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity',
      type: 'number',
    }),
    defineField({
        name: 'totalAmount',
        title: 'Total Amount',
        type: 'number',
    }),
    defineField({
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
            list: [
                {title: 'Pending', value: 'pending'},
                {title: 'Paid', value: 'paid'},
                {title: 'Confirmed', value: 'confirmed'},
                {title: 'Cancelled', value: 'cancelled'},
            ],
        },
        initialValue: 'pending'
    }),
    defineField({
        name: 'stripePaymentId',
        title: 'Stripe Payment ID',
        type: 'string',
    }),
    defineField({
        name: 'stripeCustomerId',
        title: 'Stripe Customer ID',
        type: 'string',
    }),
    defineField({
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        initialValue: (new Date()).toISOString()
    })
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'status',
    },
  },
})
