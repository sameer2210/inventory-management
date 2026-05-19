const Table = ({ product }) => {
  return (
    <div className=" border p-2  ">
      <table>
        <thead>
          <tr>
            <th>product ID </th>
            <th> Name </th>
            <th> categories </th>
          </tr>
        </thead>
        <tbody className="border-t   ">
          {product.map(ProductsDATA => (
            <tr className="bg-blue-50   " key={ProductsDATA.productId}>
              <th>{ProductsDATA.productId}</th>
              <th>{ProductsDATA.productName}</th>
              <th>{ProductsDATA.categories?.join(', ')}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
