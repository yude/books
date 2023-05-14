'use client';

import { useMemo, useEffect, useState, useRef, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactFragment, ReactPortal } from 'react';
import { usePapaParse } from 'react-papaparse';
import { TData } from "@/types/Table";

import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { AgGridReact } from '@ag-grid-community/react';
import { AgGridReact as AgGridReactType } from '@ag-grid-community/react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([ ClientSideRowModelModule ]);

export default function Home() {
  const [books, setBooks] = useState<TData[]>()

  const [filterText, setFilterText] = useState("")
  const gridRef = useRef<AgGridReactType>(null)
  
  const handleFilterUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value)
    if (gridRef.current && gridRef.current.api) {
      if (filterText.length <= 0) {
        gridRef.current.api.resetQuickFilter()
      } else {
        gridRef.current.api.setQuickFilter(filterText)
      }
    }
  }

  const { readString } = usePapaParse();

  interface ICar {
    title: string,
    authors: string,
    publisher: string,
    url: string,
    category: string,
    ISBN: string
  }

  const COLUMNS = [
    {
      headerName: "タイトル",
      field: "title",
      width: "600px",
      filter: true,
      cellRenderer: (params: { data: { url: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | PromiseLikeOfReactNode | null | undefined; }; }) => {
        return (
          <a href={params.data.url}>{params.data.title}</a>
        );
      }
    },
    {
      headerName: "著者",
      field: "authors",
      filter: false,
    },
    {
      headerName: "出版社",
      field: "publisher",
      filter: false,
    },
    {
      headerName: "URL",
      field: "url",
      filter: false,
      hide: true
    },
    {
      headerName: "分類",
      field: "category",
      filter: false,
    },
    {
      headerName: "ISBN",
      field: "ISBN",
      filter: false,
    },
  ];
  
  const columnDefs = useMemo(() => COLUMNS, [])

  useEffect(() => {
    fetch('//' + window.location.host + '/books/books.csv')
      .then((res) => res.text())
      .then((data) => {
        readString(data, {
          worker: true,
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            const d = results.data.map((p: { ISBN: string; }) => {
              p.ISBN = p.ISBN.replace(/-/g, "")
              return p
            })
            setBooks(d)
          },
        });
      })
  }, [])

  const gridOptions = {
    headerHeight: 30,
    enableSorting: true,
    enableFilter: true,
    columnDefs: columnDefs,
    rowData: books,
    // quickFilterText: filterText,
  }

  return (
    <div className="h-[64rem]">
    <p className="font-mono bg-pink-200/75 text-4xl tracking-wide underline decoration-pink-500 decoration-4">
    @yude/books
    </p>
    <p>
      インターネット・本棚
    </p>

    <form className="bg-white rounded px-8 pt-6 pb-4">
    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" value={filterText} onChange={handleFilterUpdate} placeholder="書籍を検索... (しかし、日本語検索に不具合がある)" />
    </form>
    {filterText}
    
    {books && gridRef && 

    <AgGridReact
        ref={gridRef}
        // @ts-ignore
        gridOptions={gridOptions}
        className="ag-theme-alpine"
    />
    }
    <div className="text-center">
    <p className="underline"><a href="https://github.com/yude/books">GitHub リポジトリ</a></p>
    <p className="underline"><a href="https://github.com/yude/books/blob/main/public/books.csv">CSV データ</a></p>
    </div>
    </div>
  )
}
