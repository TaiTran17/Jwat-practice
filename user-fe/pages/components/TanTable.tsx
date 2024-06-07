// components/UserTable.tsx

import React, { FC } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface User {
  id: string;
  username: string;
  fullname: string;
  role: string;
  project: string;
  activeYn: boolean;
}

interface ITableProps {
  userData: User[];
  handleUpdate: (userId: string) => void;
  handleDelete: (userId: string) => void;
}

const columnHelper = createColumnHelper<User>();

const TanTable: FC<ITableProps> = ({
  userData,
  handleDelete,
  handleUpdate,
}) => {
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("username", {
      header: "Username",
    }),
    columnHelper.accessor("fullname", {
      header: "Fullname",
    }),
    columnHelper.accessor("role", {
      header: "Role",
    }),
    columnHelper.accessor("project", {
      header: "Project",
    }),
    columnHelper.accessor("activeYn", {
      header: "Active",
    }),
    columnHelper.display({
      header: "Action",
      cell: ({ row }) => (
        <div className=" p-4 text-center flex gap-5">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            onClick={() => handleUpdate(row.original.id)}
          >
            {" "}
            Update
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            onClick={() => handleDelete(row.original.id)}
          >
            {" "}
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: userData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table className="border-collapse border border-slate-400">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="border border-slate-300"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-slate-300 p-4 text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TanTable;
