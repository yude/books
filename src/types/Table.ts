import { ColumnDef } from "@tanstack/react-table";

type TData = {
    col1: String;
    col2: String;
    col3: String;
    col4: String;
    col5: String;
    col6: String;
}

export const COLUMNS: ColumnDef<any>[] = [
    {
      header: "タイトル",
      accessorKey: "col1",
    },
    {
      header: "著者",
      accessorKey: "col2",
    },
    {
      header: "出版社",
      accessorKey: "col3",
    },
    {
      header: "URL",
      accessorKey: "col4",
    },
    {
      header: "分類",
      accessorKey: "col5",
  },
    {
      header: "ISBN",
      accessorKey: "col6",
    },
  ];
