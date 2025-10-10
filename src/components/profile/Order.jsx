"use client";
import { useTable } from "react-table";
import { useMemo, useEffect, useState } from "react";
import { useMyOrdersQuery } from "@/store/api/orderApi";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function Order() {
  const { data, isLoading, error } = useMyOrdersQuery();
  const orders = data?.orders || [];
  const router = useRouter();
  const [trackingDataMap, setTrackingDataMap] = useState({});

  // Fetch tracking data for all orders with waybill using Promise.all
  useEffect(() => {
    const fetchTrackingData = async () => {
      const ordersWithWaybill = orders.filter((order) => order.waybill);
      if (ordersWithWaybill.length === 0) return;

      try {
        const trackingPromises = ordersWithWaybill.map((order) =>
          axios
            .get("/api/order/track", {
              params: {
                waybill: order.waybill,
                ref_ids: order.refIds || "ORD1243244",
              },
            })
            .then((response) => ({
              orderId: order._id,
              trackingData: response.data,
            }))
            .catch((err) => ({
              orderId: order._id,
              trackingData: null,
              error: err.message,
            }))
        );

        const trackingResults = await Promise.all(trackingPromises);

        const newTrackingDataMap = trackingResults.reduce((acc, result) => {
          acc[result.orderId] = result.trackingData || null;
          return acc;
        }, {});
        setTrackingDataMap(newTrackingDataMap);
      } catch (err) {
        console.error("Error fetching tracking data:", err);
      }
    };

    if (orders.length > 0) {
      fetchTrackingData();
    }
  }, [orders]);

  // Memoize table data
  const tableData = useMemo(() => {
    if (!orders.length) return [];

    return orders.map((order) => {
      // Get tracking data for this order
      const trackingData = trackingDataMap[order._id];

      // Determine current status: ShipmentData[0].Shipment.Status.Status or fallback to orderStatus
      const currentStatus =
        trackingData?.ShipmentData?.[0]?.Shipment?.Status?.Status ||
        order.orderStatus ||
        "Unknown";

      return {
        id: order._id,
        items: order.orderItems
          .map(
            (item) =>
              `${item.name} (x${item.quantity}${
                item.variant ? `, ${item.variant}` : ""
              })`
          )
          .join(", "),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        orderStatus: currentStatus, // Use currentStatus for the Status column
        createdAt: new Date(order.createdAt).toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        isToday:
          new Date(order.createdAt).toDateString() ===
          new Date().toDateString(),
      };
    });
  }, [orders, trackingDataMap]);

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: "Order ID",
        accessor: "id",
        Cell: ({ value }) => <span>#{value.slice(-6)}</span>,
      },
      {
        Header: "Items",
        accessor: "items",
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        Cell: ({ value }) => <span>₹{value.toFixed(2)}</span>,
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
      },
      {
        Header: "Status",
        accessor: "orderStatus", // Reflects currentStatus (tracking or fallback)
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
        id: "actions",
        Cell: ({ row }) => (
          <button
            style={{ width: "fit-content", height: "fit-content" }}
            className="woocomerce__cart-couponbtn px-3 py-2"
            onClick={() => router.push(`/order/${row.original.id}`)}
            title="View Order"
          >
            <FontAwesomeIcon icon={faEye} />
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
