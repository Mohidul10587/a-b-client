export type PropsWithSlagArray = {
    params: Promise<{ id: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> ;
  };
  export type Props = {
    params: Promise<{ id: string ; searchText:string}>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>; 
  };