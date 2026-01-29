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
        name: 'eventType',
        title: 'Event Type',
        type: 'string',
        options: {
          list: [
            {title: 'Concert', value: 'concert'},
            {title: 'Festival', value: 'festival'},
            {title: 'Theater', value: 'theater'},
            {title: 'Sport', value: 'sport'},
            {title: 'Conference', value: 'conference'},
          ], 
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
  ],
})
