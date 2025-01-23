import React, { useState, useEffect } from 'react';
import { Table, Avatar, ScrollArea } from '@mantine/core';
import defaultAvatar from '../../../assets/male-example.svg';

const GenericTable = ({
  data = [],
  columns = [],
  actions = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  minWidth = 800,
  isDarkBackground = false,
}) => {

  const handleSendClick = (row, action) => {
    action.onClick(row);
  };

  const resolveAccessor = (row, accessor) => {
    if (!accessor) return '-';
    if(accessor.includes('self')) return row[accessor.split('.')[1]];
    try {
      const keys = accessor.split('.');
      let value = row;
      for (const key of keys) {
        if (key.includes('[')) {
          const [arrayKey, index] = key.split(/[\[\]]/).filter(Boolean);
          value = value[arrayKey]?.[parseInt(index, 10)];
        } else {
          value = value[key];
        }
        if (value === undefined || value === null) return '-';
      }
      return value;
    } catch (error) {
      return '-';
    }
  };

  return (
    <div
      className={'pb-4 rounded-xl shadow-sm bg-transaparent' }
    >
      <ScrollArea>
        <Table.ScrollContainer minWidth={minWidth}>
          <Table className="w-full">
            <Table.Thead
              className={`${
                isDarkBackground ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-600'
              }`}
            >
              <Table.Tr>
                {columns.map((column) => (
                  <Table.Th
                    key={column.accessor}
                    className="text-sm font-medium px-4 py-3"
                  >
                    {column.header}
                  </Table.Th>
                ))}
                {actions.length > 0 && (
                  <Table.Th className="text-sm font-medium px-4 py-3">
                    Acciones
                  </Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data.map((row, rowIndex) => (
                <Table.Tr
                  key={rowIndex}
                  className={`hover:scale-105 hover:shadow-md transition-transform duration-200 ${
                    isDarkBackground ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {columns.map((column) => (
                    <Table.Td key={column.accessor} className="px-4 py-3">
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
                              {resolveAccessor(row, `${column.accessor}.name`) || '-'}
                            </span>
                            <span className="text-xs">
                              {resolveAccessor(row, `${column.accessor}.email`) || '-'}
                            </span>
                          </div>
                        </div>
                      ) : column.type === 'delay' ? (
                        <span
                          className={`font-medium ${
                            resolveAccessor(row, column.accessor) === true
                              ? 'text-orange-500'
                              : resolveAccessor(row, column.accessor) === false
                              ? 'text-green-500'
                              : 'text-gray-500'
                          }`}
                        >
                          {resolveAccessor(row, column.accessor) === null ||
                          resolveAccessor(row, 'examSubmissions')?.length === 0
                            ? 'No entregó'
                            : resolveAccessor(row, column.accessor) === true
                            ? 'Tarde'
                            : 'A tiempo'}
                        </span>
                      ) : column.type === 'date' ? (
                        <span className="font-medium">
                          {new Date(resolveAccessor(row, column.accessor)).toLocaleDateString()}
                        </span>
                      ) : column.type === 'proyectType' ? (
                        <span className={
                          `font-medium ${
                            resolveAccessor(row, column.accessor) === '-'
                              ? 'text-[#E0F47E]'
                              : 'text-gray-500'
                          }`
                        }>
                          {resolveAccessor(row, column.accessor) === '-' ? "Libre": "Trabajo practico" }
                        </span>
                      ) :
                      (
                        resolveAccessor(row, column.accessor)
                      )}
                    </Table.Td>
                  ))}
                  {actions.length > 0 && (
                    <Table.Td className="px-4 py-3">
                      {actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendClick(row, action)}
                          className={`font-medium text-sm ${
                            isDarkBackground ? 'text-blue-300' : 'text-strongBlue'
                          } hover:underline`}
                        >
                          {action.label}
                        </button>
                      ))}
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
          className={`font-medium ${
            isDarkBackground ? 'text-white' : 'text-gray-600'
          } hover:text-strongBlue ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Anterior
        </button>
        <span className={`text-sm ${isDarkBackground ? 'text-white' : 'text-gray-600'}`}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`font-medium ${
            isDarkBackground ? 'text-white' : 'text-gray-600'
          } hover:text-strongBlue ${
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
