const SectionClass = ({ advance, content }) => {
  const advanceClass = () => {
    advance();
  };

  return (
    <div className="flex h-[70vh] justify-center items-center">
        <div className="border-2 border-[#E4E7EC] rounded-xl p-6 w-96">
          <div>
            <h2 className="text-lg">{content?.name}</h2>
            <p>{content?.content}</p>
            <button
              onClick={() => advanceClass()}
              className="bg-[#4558C8] text-white py-2 w-full rounded-xl"
            >
              Siguiente
            </button>
          </div>
          <div></div>
        </div>
    </div>
  );
};

export default SectionClass;
