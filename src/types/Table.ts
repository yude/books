export type TData = {
    title: String;
    authors: String;
    category: String;
    publisher: String;
    ISBN: String;
    url: String;
}

export const COLUMNS = [
  {
    headerName: "タイトル",
    field: "title",
  },
  {
    headerName: "著者",
    field: "authors",
  },
  {
    headerName: "出版社",
    field: "publisher",
  },
  {
    headerName: "URL",
    field: "url",
  },
  {
    headerName: "分類",
    field: "category",
  },
  {
    headerName: "ISBN",
    field: "ISBN",
  },
];
