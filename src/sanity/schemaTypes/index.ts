import { type SchemaTypeDefinition } from 'sanity'
import { eventType } from './eventType'
import { bookingType } from './bookingType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, bookingType],
}
