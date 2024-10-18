import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SectionClass from '../components/section/Class';
import Exercise from '../components/section/Exercice';
import FinalWork
 from '../components/level/FinalWork';
const SectionPage = () => {
  const navigate = useNavigate();
  
  // Lógica de datos harcodeados
  const sectionsData = {
    '1': { type: 'class', title: "¿Qué es BODY?", subtitle: "Conoce la etiqueta <BODY>", message: "El <body> es donde todo lo que ves en la página web aparece. Es el cuerpo que contiene los textos, imágenes y más." },
    '2': { type: 'exercise', content: 'Contenido del ejercicio de ejemplo' },
    '3': { 
      type: 'finalWork', 
      title: 'Trabajo Integrador Final de Nivel', 
      description: 'Este es tu proyecto final para completar el nivel. Asegúrate de seguir todas las instrucciones y subir tu código.', 
      dueDate: '10/30/2024', 
      attemptsLeft: 2 
    },    
  };

  const section = sectionsData[3];


  return (
    <div>
      {section.type === 'class' && (
        <SectionClass message={section.message} title={section.title} subtitle={section.subtitle} />
      )}
      {section.type === 'exercise' && (
        <Exercise 
          question="¿Cuál es la función de la etiqueta <html> en un documento web?"
          options={[
            "A) Define el encabezado de la página web.",
            "B) Contiene el contenido principal que se muestra en la página.",
            "C) Es el contenedor principal que envuelve todo el contenido de la página.",
            "D) Define el estilo de la página."
          ]} 
        />
      )}
      {section.type === 'finalWork' && (
        <FinalWork 
          title={section.title} 
          description={section.description} 
          dueDate={section.dueDate} 
          attemptsLeft={section.attemptsLeft} 
        />
      )}
    </div>
  );
};

export default SectionPage;
