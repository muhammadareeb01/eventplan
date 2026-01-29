import { type SchemaTypeDefinition } from 'sanity'
import { eventType } from './eventType'
import { bookingType } from './bookingType'
import { tableType } from './tableType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, bookingType, tableType],
}
