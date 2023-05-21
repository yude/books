'use client';

import { useMemo, useEffect, useState, useRef, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactFragment, ReactPortal, useCallback } from 'react';
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
  }

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setQuickFilter(filterText)
    }
  }, [filterText])

  const { readString } = usePapaParse();

  const [windowSize, setWindowSize] = useState({
    height: 0,
  });
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    } else {
      return;
    }
  }, []);


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
      width: 600,
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
  }

  // Workaround for page height updates regarding software keyboards
  const getHeight = useCallback(
    () =>
      window.visualViewport ? window.visualViewport.height : window.innerHeight,
    [],
  )
  const [height, setHeight] = useState<number>(getHeight())
  useEffect(() => {
    const handleResize = (e: Event) => {
      setHeight(getHeight())
    }

    window.addEventListener('resize', handleResize)
    // From the top of my head this used to be required for older browsers since
    // this didn't trigger a resize event. Keeping it in to be safe.
    window.addEventListener('orientationchange', handleResize)
    // This is needed on iOS to resize the viewport when the Virtual/OnScreen
    // Keyboard opens. This does not trigger any other event, or the standard
    // resize event.
    window.visualViewport?.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [getHeight])


  return (
    <>
    <p className="font-mono bg-pink-200/75 text-4xl tracking-wide underline decoration-pink-500 decoration-4">
    @yude/books
    </p>
    <p>
      インターネット・本棚
    </p>

    <form className="bg-white rounded px-8 pt-6 pb-4" onSubmit={e => { e.preventDefault(); }}>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="search_query" type="text" value={filterText} onChange={handleFilterUpdate} placeholder="書籍を検索..." />
    </form>
    <div style={{ height: `${getHeight() - 230}px`}}>
    {books && gridRef && 
    
    <AgGridReact
        ref={gridRef}
        gridOptions={gridOptions}
        className="ag-theme-alpine"
    />
    }
    </div>
    <div className="text-center">
    <p className="underline"><a href="https://github.com/yude/books">GitHub リポジトリ</a></p>
    <p className="underline"><a href="https://github.com/yude/books/blob/main/public/books.csv">CSV データ</a></p>
    </div>
    </>
  )
}
