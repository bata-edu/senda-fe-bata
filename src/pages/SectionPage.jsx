import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SectionClass from '../components/section/Class';
import Exercise from '../components/section/Exercice';

const SectionPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  
  // Lógica de datos harcodeados
  const sectionsData = {
    '1': { type: 'class', title:"¿Qué es BODY?", subtitle:"Conoce la etiqueta <BODY>", message:"El <body> es donde todo lo que ves en la página web aparece. Es el cuerpo que contiene los textos, imágenes y más."    },
    '2': { type: 'exercise', content: 'Contenido del ejercicio de ejemplo' },    
  };
  const section = sectionsData[1];

  const handleNextSection = () => {
    navigate(`/section/${parseInt(sectionId) + 1}`);
  };

  return (
    <div>
      {section.type === 'class' && (
        <SectionClass message={section.message} title={section.title} subtitle={section.subtitle} />
      )}
      {section.type === 'exercise' && (
        <Exercise question="¿Cuál es la función de la etiqueta <html> en un documento web?"
        options={[
          "A) Define el encabezado de la página web.",
          "B) Contiene el contenido principal que se muestra en la página.",
          "C) Es el contenedor principal que envuelve todo el contenido de la página.",
          "D) Define el estilo de la página."
        ]} 
        />
      )}
{/*       <button onClick={handleNextSection}>Avanza a la siguiente sección</button>
 */}    </div>
  );
};

export default SectionPage;
