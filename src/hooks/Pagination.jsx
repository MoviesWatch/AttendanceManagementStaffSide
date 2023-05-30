import { useState } from "react";
const countPerPage = 15;

export const usePagination = (data) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = data.slice(
    (currentPage - 1) * countPerPage,
    currentPage * countPerPage
  );
  return {
    countPerPage,
    currentPage,
    setCurrentPage,
    paginatedData,
  };
};

export const PaginationElement = ({ data, currentPage, setCurrentPage }) => {
  const pageHandler = (pageNum) => {
    if (pageNum <= Math.ceil(data.length / countPerPage) && pageNum >= 1) {
      setCurrentPage(pageNum);
    }
  };
  return (
    data.length > countPerPage && (
      <div className="pagination">
        <button onClick={() => pageHandler(currentPage - 1)}>Prev</button>
        <div className="page-num">
          <input
            type="number"
            value={currentPage}
            onChange={(ev) => setCurrentPage(+ev.target.value)}
          />
          / <span>{Math.ceil(data.length / countPerPage)}</span>
        </div>
        <button onClick={() => pageHandler(currentPage + 1)}>Next</button>
      </div>
    )
  );
};
