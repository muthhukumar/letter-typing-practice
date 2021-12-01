export default function Status({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="flex items-center px-4 py-2 bg-yellow-700 rounded-full fit-content">
      <p className="font-bold">{title}</p>
      <p className="px-4 py-2 ml-2 bg-yellow-600 rounded-full">{value}</p>
    </div>
  )
}
