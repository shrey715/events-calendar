import { Loader } from 'lucide-react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <Loader className="animate-spin mr-2" />
      <span>Loading...</span>
    </div>
  )
}

export default Loading