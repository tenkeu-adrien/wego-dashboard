// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { useThemeContext } from "app/contexts/theme/context";
// import Drawer from "components/drawer/";
// import { Left } from "components/drawer/Left";
// import { Right } from "components/drawer/Right";
import { useDisclosure } from "hooks";
import { useState } from "react";
import { ShiftDown } from "components/ui/modal/ShiftDown";
// import { Basic } from "components/modal/Basic";
// import Billing from "components/ui/settings/sections/Billing";
// import UsersCard5 from "components/ui/users-card-5";
// import UsersCard7 from "components/ui/users-card-7";

// ----------------------------------------------------------------------

export function ListView({ table, rows, flexRender }) {
  const tableSettings = table.getState().tableSettings;
  const { cardSkin } = useThemeContext();
  // const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, { open, close }] = useDisclosure(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (row) => {
    console.log("row" ,row.original)
    setSelectedRow(row.original); // Stocker les données originales de la ligne
    open(); // Ouvrir la modale
  };
  // const handleRowClick = (row) => {
  //   setSelectedUser(row.original); // Stocker les données de l'utilisateur
  // };
  return (
    <>
    <div className="table-wrapper min-w-full grow overflow-x-auto">
      <Table
        hoverable
        dense={tableSettings.enableRowDense}
        sticky={tableSettings.enableFullScreen}
        className="w-full text-left rtl:text-right"
      >
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers
                .filter((header) => !header.column.columnDef.isHiddenColumn)
                .map((header) => (
                  <Th
                    key={header.id}
                    className={clsx(
                      "bg-gray-400 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 ltr:first:rounded-tl-lg ltr:last:rounded-tr-lg rtl:first:rounded-tr-lg rtl:last:rounded-tl-lg",
                      header.column.getCanPin() && [
                        header.column.getIsPinned() === "left" &&
                          "sticky z-2 ltr:left-0 rtl:right-0",
                        header.column.getIsPinned() === "right" &&
                          "sticky z-2 ltr:right-0 rtl:left-0",
                      ],
                      header.column.id === "status" && "w-px px-3",
                    )}
                  >
                    {header.column.getCanSort() ? (
                      <div
                        className="flex cursor-pointer select-none items-center space-x-3 rtl:space-x-reverse"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="flex-1">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </span>
                        <TableSortIcon sorted={header.column.getIsSorted()} />
                      </div>
                    ) : header.isPlaceholder ? null : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </Th>
                ))}
            </Tr>
          ))}
        </THead>
        <TBody>
          {rows.map((row) => {
            return (
              <Tr
                key={row.id}
                onClick={()=>handleRowClick(row)}
                className={clsx(
                  "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                  row.getIsSelected() &&
                    "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500",
                )}
              >
                {/* first row is a normal row */}
                {row
                  .getVisibleCells()
                  .filter((cell) => !cell.column.columnDef.isHiddenColumn)
                  .map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        className={clsx(
                          "relative",
                          cardSkin === "shadow"
                            ? "dark:bg-dark-700"
                            : "dark:bg-dark-900",
                          cell.column.getCanPin() && [
                            cell.column.getIsPinned() === "left" &&
                              "sticky z-2 ltr:left-0 rtl:right-0",
                            cell.column.getIsPinned() === "right" &&
                              "sticky z-2 ltr:right-0 rtl:left-0",
                          ],
                          cell.column.id === "status" && "px-3",
                        )}
                      >
                        {cell.column.getIsPinned() && (
                          <div
                            className={clsx(
                              "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                              cell.column.getIsPinned() === "left"
                                ? "ltr:border-r rtl:border-l"
                                : "ltr:border-l rtl:border-r",
                            )}
                          ></div>
                        )}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    );
                  })}
              </Tr>
            );
          })}
        </TBody>
      </Table>
    </div>
<ShiftDown   isOpen={isOpen} onClose={close}  data={selectedRow} />
{/* <Basic />
<Billing />
<UsersCard5 />
<UsersCard7 /> */}
</>
  );
}

ListView.propTypes = {
  table: PropTypes.object,
  rows: PropTypes.array,
  flexRender: PropTypes.func,
};
