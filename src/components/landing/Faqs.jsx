import Accordion from "./Accordion";
export default function Faqs() {
  const faqs = [
    {
      question:
        "¿Qué hace diferente a Bata de otras plataformas de aprendizaje?",
      answer:
        "Bata combina aprendizaje interactivo, ejercicios prácticos, y una experiencia dinámica que se adapta a tus necesidades. Además, incluye herramientas como pantalla dividida para ver el código y los resultados en tiempo real, y el apoyo de IA para guiarte en cada paso.",
    },
    {
      question: "¿Puedo acceder desde cualquier dispositivo?",
      answer:
        "Por ahora, Bata está disponible únicamente desde computadoras con conexión a Internet. Estamos trabajando para ampliar el acceso a celulares, tablets e incluso una aplicación móvil en el futuro.",
    },
    {
      question: "¿Qué lenguajes de programación se enseñan en la plataforma?",
      answer:
        "Actualmente, ofrecemos cursos de HTML, CSS, JavaScript y Phyton, pero estamos desarrollando nuevos contenidos para incluir muchos más próximamente.",
    },
    {
      question: "¿Necesito conocimientos previos para comenzar?",
      answer:
        "No es necesario. Bata está diseñado tanto para quienes recién empiezan como para aquellos con experiencia previa que buscan fortalecer sus habilidades.",
    },
    {
      question:
        "¿Hay una comunidad o foro donde interactuar con otros estudiantes?",
      answer:
        "Sí, Bata cuenta con una comunidad activa donde podés compartir experiencias, resolver dudas y conectar con otros estudiantes.",
    },
    {
      question: "¿Qué tipo de ejercicios y actividades ofrece la plataforma?",
      answer:
        "Bata ofrece ejercicios prácticos, desafíos interactivos, y actividades que cubren distintos lenguajes de programación. Cada nivel está diseñado para reforzar lo aprendido con ejercicios adaptativos.",
    },
    {
      question: "¿La plataforma es adecuada para colegios y empresas?",
      answer:
        "Sí, Bata tiene planes especialmente diseñados para instituciones educativas. Además, estamos desarrollando funcionalidades específicas para empresas, con herramientas avanzadas para enseñar y monitorear el progreso de los equipos.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-48">
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
