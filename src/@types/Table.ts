import React from 'react';

export interface ITableEntity {
  id: string | number;
}

export type Sort<T> = {
  key: keyof T;
  direction: 'asc' | 'desc';
};

export interface IColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width: number | string;
}

export type RowActions<T> = (row: T) => React.ReactNode;
