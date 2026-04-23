import CollectionCrudPage from './CollectionCrudPage'

export default function ProjectsAdmin() {
  return (
    <CollectionCrudPage
      title="Projects"
      collectionName="projects"
      schema={[
        { key: 'order', label: 'Order', placeholder: '1', preview: true },
        { key: 'category', label: 'Category', placeholder: 'Web', preview: true },
        { key: 'title', label: 'Title', placeholder: 'Project title', preview: true },
        {
          key: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Short description…',
          preview: true,
        },
        { key: 'tags', label: 'Tags (comma separated)', type: 'tags', preview: true },
        { key: 'imageUrl', label: 'Cover Image', type: 'image', preview: false },
        { key: 'liveUrl', label: 'Live URL', placeholder: 'https://…', preview: false },
        { key: 'sourceUrl', label: 'Source URL', placeholder: 'https://…', preview: false },
      ]}
    />
  )
}

