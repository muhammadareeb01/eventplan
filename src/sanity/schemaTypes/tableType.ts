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
      name: 'events',
      title: 'Events',
      description: 'Select one or more events that this table option applies to.',
      type: 'array',
      of: [{type: 'reference', to: {type: 'event'}}],
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
      initialValue: 0
    }),
  ],
  preview: {
    select: {
      title: 'title',
      events: 'events',
      price: 'price',
      available: 'availableQuantity',
      sold: 'sold'
    },
    prepare(selection) {
        const {title, events, price, available, sold} = selection
        const eventCount = events ? events.length : 0;
        return {
          title: `${title}`,
          subtitle: `$${price} | Used in ${eventCount} Event(s) | Capacity: ${available}`,
        }
    }
  }
})
