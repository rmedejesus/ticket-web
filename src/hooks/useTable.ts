import { useState, useEffect } from "react";
import type { ITicket } from "../types/ticket";

const calculateRange = (tickets: ITicket[], rowsPerPage: number) => {
  const range = [];
  const num = Math.ceil(tickets?.length / rowsPerPage);
  for (let i = 1; i <= num; i++) {
    range.push(i);
  }
  return range;
};

const sliceData = (tickets: ITicket[], page: number, rowsPerPage: number) => {
  return tickets.slice((page - 1) * rowsPerPage, page * rowsPerPage);
};

const useTable = (tickets: ITicket[], page: number, rowsPerPage: number) => {
  const [tableRange, setTableRange] = useState<number[]>([]);
  const [slice, setSlice] = useState<ITicket[]>([]);

  useEffect(() => {
    const range = calculateRange(tickets, rowsPerPage);
    setTableRange([...range]);

    const slice = sliceData(tickets, page, rowsPerPage);
    setSlice([...slice]);
  }, [tickets, setTableRange, page, setSlice]);

  return { slice, range: tableRange };
};

export default useTable;