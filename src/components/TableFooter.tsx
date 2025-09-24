import { useEffect } from "react";
import styles from "../TableFooter.module.css";

interface TableFooterProps {
  range: number[];
  setPage: (page: number) => void;
  page: number;
  slice: any[];
}

const TableFooter: React.FC<TableFooterProps> = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  return (
    <div className={styles.tableFooter}>
      {range.map((el: number, index: number) => (
        <button
          key={index}
          className={`${styles.button} ${
            page === el ? styles.activeButton : styles.inactiveButton
          }`}
          onClick={() => setPage(el)}
        >
          {el}
        </button>
      ))}
    </div>
  );
};

export default TableFooter;