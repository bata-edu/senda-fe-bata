import React, { useState } from 'react';
import { Table, Avatar, ScrollArea, Button } from '@mantine/core';
import defaultAvatar from '../../../assets/male-example.svg';

const GenericTable = ({
  data = [],
  columns = [],
  actions = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  minWidth = 800,
}) => {
  const [editRow, setEditRow] = useState(null); // Guarda la fila que está en edición
  const [inputValue, setInputValue] = useState(''); // Valor del input para calificación

  const handleSendClick = (row, action) => {
    action.onClick(row, inputValue); // Llama a la función con el valor
    setEditRow(null); // Resetea el estado de edición
    setInputValue(''); // Limpia el input
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <ScrollArea>
        <Table.ScrollContainer minWidth={minWidth}>
          <Table className="w-full">
            <Table.Thead className="bg-gray-50">
              <Table.Tr>
                {columns.map((column) => (
                  <Table.Th
                    key={column.accessor}
                    className="text-gray-600 text-sm font-medium px-4 py-3"
                  >
                    {column.header}
                  </Table.Th>
                ))}
                {actions.length > 0 && (
                  <Table.Th className="text-gray-600 text-sm font-medium px-4 py-3">
                    Acciones
                  </Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data.map((row, rowIndex) => (
                <Table.Tr key={rowIndex} className="hover:bg-gray-50 transition">
                  {columns.map((column) => (
                    <Table.Td key={column.accessor} className="px-4 py-3 text-gray-700">
                      {column.type === 'user' ? (
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={row[column.accessor]?.photo || defaultAvatar}
                            alt="User"
                            radius="xl"
                            size="md"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                              {row[column.accessor]?.name || '-'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {row[column.accessor]?.email || '-'}
                            </span>
                          </div>
                        </div>
                      ) : column.type === 'delay' ? (
                        <span
                          className={`font-medium ${
                            row[column.accessor] ? 'text-orange-500' : 'text-green-500'
                          }`}
                        >
                          {row[column.accessor] ? 'Tarde' : 'A tiempo'}
                        </span>
                      ) : (
                        row[column.accessor] || '-'
                      )}
                    </Table.Td>
                  ))}
                  {actions.length > 0 && (
                    <Table.Td className="px-4 py-3">
                      {editRow === rowIndex ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nota"
                            className="w-16 px-2 py-1 border rounded-lg text-sm"
                          />
                          <button
                            onClick={() =>
                              handleSendClick(row, actions[0])
                            }
                            className="bg-strongBlue text-white text-xs px-2 py-1 rounded-lg hover:bg-blue-600"
                          >
                            Enviar
                          </button>
                        </div>
                      ) : (
                        actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => setEditRow(rowIndex)}
                            className="text-strongBlue hover:underline font-medium text-sm"
                          >
                            {action.label}
                          </button>
                        ))
                      )}
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea>

      <div className="flex justify-between items-center mt-4 px-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`text-gray-600 font-medium hover:text-strongBlue ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`text-gray-600 font-medium hover:text-strongBlue ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default GenericTable;
