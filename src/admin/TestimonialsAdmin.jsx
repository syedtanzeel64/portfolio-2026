import CollectionCrudPage from './CollectionCrudPage'

export default function TestimonialsAdmin() {
  return (
    <CollectionCrudPage
      title="Testimonials"
      collectionName="testimonials"
      schema={[
        { key: 'order', label: 'Order', placeholder: '1', preview: true },
        { key: 'name', label: 'Name', placeholder: 'Client name', preview: true },
        { key: 'role', label: 'Role', placeholder: 'CEO, Company', preview: true },
        {
          key: 'quote',
          label: 'Quote',
          type: 'textarea',
          placeholder: 'What did they say…',
          preview: true,
        },
      ]}
    />
  )
}

