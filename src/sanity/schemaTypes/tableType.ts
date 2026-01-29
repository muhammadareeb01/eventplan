import { defineField, defineType } from 'sanity'

export const tableType = defineType({
  name: 'table',
  title: 'Tables / Tickets',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., Regular Table for Pokemon Event',
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{type: 'event'}],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'price',
      title: 'Price ($)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'availableQuantity',
      title: 'Total Capacity',
      type: 'number',
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'sold',
      title: 'Sold Quantity',
      type: 'number',
      readOnly: true,
      initialValue: 0
    }),
  ],
  preview: {
    select: {
      title: 'title',
      event: 'event.name',
      price: 'price',
      available: 'availableQuantity',
      sold: 'sold'
    },
    prepare(selection) {
        const {title, event, price, available, sold} = selection
        return {
          title: `${event || 'Unknown'} - ${title}`,
          subtitle: `$${price} | ${sold || 0}/${available} sold`,
        }
    }
  }
})
