import CollectionCrudPage from './CollectionCrudPage'

export default function ServicesAdmin() {
  return (
    <CollectionCrudPage
      title="Services"
      collectionName="services"
      schema={[
        { key: 'order', label: 'Order', placeholder: '1', preview: true },
        { key: 'title', label: 'Title', placeholder: 'Service title', preview: true },
        {
          key: 'desc',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Short description…',
          preview: true,
        },
        { key: 'bullets', label: 'Bullets (comma separated)', type: 'tags', preview: true },
      ]}
    />
  )
}

