import "./../styles/table.scss";
export const CustomTable = ({ children, titles }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {titles.map((title) => (
              <th>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
