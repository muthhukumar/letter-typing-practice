export default function Status({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="flex items-center bg-gray-700 rounded-md fit-content">
      <p className="p-4">{title}</p>
      <p className="mx-4 bg-gray-600">{value}</p>
    </div>
  )
}
