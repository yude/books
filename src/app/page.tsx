'use client';

import { useMemo, useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { COLUMNS, TData } from "@/types/Table";

import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AgGridReact } from '@ag-grid-community/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([ ClientSideRowModelModule ]);

export default function Home() {
  const [books, setBooks] = useState()
  const { readString } = usePapaParse();

  const columnDefs = useMemo(() => COLUMNS, [])

  useEffect(() => {
    fetch('//' + window.location.host + '/books.csv')
      .then((res) => res.text())
      .then((data) => {
        readString(data, {
          worker: true,
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            setBooks(results.data)
            console.log(results.data)
          },
        });
      })
  }, [])

  return (
    <div className="h-[64rem]">
    <p className="font-mono bg-pink-200/75 text-4xl tracking-wide underline decoration-pink-500 decoration-4">
    @yude/books
    </p>
    <p>
      インターネット・本棚
    </p>
    {books && COLUMNS && <AgGridReact
        rowData={books}
        className="ag-theme-alpine"
        columnDefs={columnDefs}
    />
    }
    </div>
  )
}
