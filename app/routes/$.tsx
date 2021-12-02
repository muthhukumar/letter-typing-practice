import { LoaderFunction, redirect } from 'remix'

export const loader: LoaderFunction = () => {
  return redirect('/')
}

export default function SplatRoute() {
  return (
    <div>
      <h1>job. You should not be able to see this route. Well good job!! Can you let Muthu know you can see this route:)</h1>
    </div>
  )
}
