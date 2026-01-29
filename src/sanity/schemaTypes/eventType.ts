import { defineField, defineType } from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Event Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),

    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string', 
      description: 'e.g. 10:00 AM - 5:00 PM'
    }),
    defineField({
        name: 'location',
        title: 'Location',
        type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'ticketTypes',
      title: 'Ticket Types',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
            defineField({ name: 'type', title: 'Ticket Type', type: 'string', initialValue: 'regular' }), 
            defineField({ name: 'price', title: 'Price', type: 'number', initialValue: 50 }),
            defineField({ name: 'availableQuantity', title: 'Total Available Quantity', type: 'number', initialValue: 100 }),
            defineField({ name: 'sold', title: 'Sold Quantity', type: 'number', initialValue: 0, readOnly: true }),
        ],
        preview: {
            select: {
                title: 'type',
                subtitle: 'availableQuantity',
                sold: 'sold',
                price: 'price'
            },
            prepare({title, subtitle, sold, price}) {
                const soldCount = sold || 0;
                const left = (subtitle || 0) - soldCount;
                return {
                    title: `${title} ($${price})`,
                    subtitle: `${soldCount} sold / ${subtitle} total (${left} left)`
                }
            }
        }
      }]
    }),
  ],
})
