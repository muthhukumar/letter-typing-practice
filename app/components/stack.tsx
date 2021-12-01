import * as React from 'react'

const Stack: React.FC = ({ children }) => {
  return (
    <div className="flex items-center">
      {React.Children.map(children, (child) => {
        if (child) return <span className="mr-2">{React.cloneElement(child)}</span>
        return child
      })}
    </div>
  )
}

export default Stack
