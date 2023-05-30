import { useEffect, useState } from "react";
import "./../styles/table.scss";
export const PaginatedTable = ({
  titles,
  data,
  renderFunction,
  resetTrigger = null,
  countPerPage = 15,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageHandler = (pageNum) => {
    if (pageNum <= Math.ceil(data.length / countPerPage) && pageNum >= 1) {
      setCurrentPage(pageNum);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [resetTrigger]);
  return (
    <>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              {titles.map((title) => (
                <th>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data
              .slice(
                (currentPage - 1) * countPerPage,
                countPerPage * currentPage
              )
              .map((item, index) => (
                <tr>
                  <td>{(currentPage - 1) * countPerPage + index + 1}</td>
                  {renderFunction(item)}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {data.length > countPerPage && (
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
      )}
    </>
  );
};
