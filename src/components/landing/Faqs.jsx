import Accordion from "./Accordion";
export default function Faqs() {
  const faqs = [
    {
      question: "Lorem Ipsum es simplemente el texto de relleno",
      answer: "Lorem Ipsum es simplemente el texto de relleno",
    },
    {
      question: "Lorem Ipsum es simplemente el texto de relleno",
      answer: "Lorem Ipsum es simplemente el texto de relleno",
      active: true,
    },
    {
      question: "Lorem Ipsum es simplemente el texto de relleno",
      answer: "Lorem Ipsum es simplemente el texto de relleno",
    },
    {
      question: "Lorem Ipsum es simplemente el texto de relleno",
      answer: "Lorem Ipsum es simplemente el texto de relleno",
    },
    {
      question: "Lorem Ipsum es simplemente el texto de relleno",
      answer: "Lorem Ipsum es simplemente el texto de relleno",
    },
    {
      question: "Lorem Ipsum es simplemente el texto de relleno",
      answer: "Lorem Ipsum es simplemente el texto de relleno",
    },
    {
      question: "Lorem Ipsum es simplemente el texto de relleno",
      answer: "Lorem Ipsum es simplemente el texto de relleno",
    },
  ];

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <h2 className="text-3xl font-bold md:text-4xl font-sans">
              Preguntas frecuentas
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  title={faq.question}
                  id={`faqs-${index}`}
                  active={faq.active}
                >
                  {faq.answer}
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
