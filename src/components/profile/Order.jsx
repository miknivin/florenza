"use client";
import { useTable } from "react-table";
import { useMemo } from "react";
import { useMyOrdersQuery } from "@/store/api/orderApi";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function Order() {
  const { data, isLoading, error } = useMyOrdersQuery();
  const orders = data?.orders || []; // Access data.orders, default to empty array
  const router = useRouter();

  // Memoize table data
  const tableData = useMemo(() => {
    if (!orders.length) return [];
    return orders.map((order) => ({
      id: order._id,
      items: order.orderItems
        .map(
          (item) =>
            `${item.name} (x${item.quantity}${
              item.variant ? `, ${item.variant}` : ""
            })`
        )
        .join(", "), // Handle optional variant
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      createdAt: new Date(order.createdAt).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
      }), // Format for IST
      isToday:
        new Date(order.createdAt).toDateString() === new Date().toDateString(), // Check if created today
    }));
  }, [orders]);

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: "Order ID",
        accessor: "id",
        Cell: ({ value }) => <span>#{value.slice(-6)}</span>, // Shorten ID
      },
      {
        Header: "Items",
        accessor: "items",
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        Cell: ({ value }) => <span>₹{value.toFixed(2)}</span>, // Use INR symbol
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
      },
      {
        Header: "Status",
        accessor: "orderStatus",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ row }) => (
          <div>
            {row.original.createdAt}
            {row.original.isToday && (
              <span className="badge bg-success ms-2">Today</span>
            )}
          </div>
        ),
      },
      {
        Header: "Actions",
        id: "actions", // Unique ID for the column
        Cell: ({ row }) => (
          <button
            style={{ width: "fitContent" }}
            className="woocomerce__cart-couponbtn me-3 "
            onClick={() => router.push(`/order/${row.original.id}`)}
            title="View Order"
          >
            View <FontAwesomeIcon icon={faEye} />
          </button>
        ),
      },
    ],
    [router]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  return (
    <div className="tab-pane fade show">
      <div className="woocomerce__account-rtitlewrap">
        <span className="woocomerce__account-rtitle">
          Your Orders: {tableData?.length}
        </span>
      </div>

      <div>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <p>{error?.data?.message || "Unknown error"}</p>
        ) : tableData.length ? (
          <div
            style={{
              overflowX: "auto",
              maxWidth: "100vw",
              WebkitOverflowScrolling: "touch",
              whiteSpace: "nowrap",
            }}
            className="table_content"
          >
            <table className="table table-bordered" {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup, i) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={`header-${i}`}
                  >
                    {headerGroup.headers.map((column, j) => (
                      <th {...column.getHeaderProps()} key={`header-${i}-${j}`}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={`row-${i}`}>
                      {row.cells.map((cell, j) => (
                        <td
                          style={{ whiteSpace: "break-spaces" }}
                          {...cell.getCellProps()}
                          key={`cell-${i}-${j}`}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <p>No Orders Available</p>
          </div>
        )}
      </div>
    </div>
  );
}
