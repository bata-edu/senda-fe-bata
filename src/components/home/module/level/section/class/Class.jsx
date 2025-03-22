"use client"

const SectionClass = ({ advance, content }) => {
  const advanceClass = () => {
    advance()
  }

  return (
    <div className="flex h-[70vh] justify-center items-center">
      <div className="border-2 border-[#E4E7EC] rounded-xl p-6 w-full max-w-md mx-auto bg-white">
        <div>
          <h2 className="text-xl font-semibold mb-4">{content?.name}</h2>
          <div className="mb-6">
            <p className="text-gray-700">{content?.content}</p>
          </div>
          <button onClick={() => advanceClass()} className="bg-[#4558C8] text-white py-2 w-full rounded-xl">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default SectionClass

