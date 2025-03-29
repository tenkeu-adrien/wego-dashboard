// Import Dependencies
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { TbGridDots, TbList, TbUpload } from "react-icons/tb";
import clsx from "clsx";
import { ScaleUp } from "../../../../components/ui/modal/ScaleUpp";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";
import { useState } from "react";
// Local Imports
import { Button, Input } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { TableConfig } from "./TableConfig";
import { rolesOptions } from "./data";
import { RoleFilter } from "./RoleFilter";

// ----------------------------------------------------------------------

export function Toolbar({ table  ,onAddUser}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between space-x-4 rtl:space-x-reverse",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x] pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Users Table
          </h2>
        </div>
        {isXs ? (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton
              as={Button}
              variant="flat"
              className="size-8 shrink-0 rounded-full p-0"
            >
              <EllipsisHorizontalIcon className="size-4.5" />
            </MenuButton>
            <Transition
              as={MenuItems}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
              className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
            >
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>New Order</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Share</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Print</span>
                  </button>
                )}
              </MenuItem>
              <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Import Orders</span>
                  </button>
                )}
              </MenuItem>
              <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Export as PDF</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Export as CSV</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Save Table as View</span>
                  </button>
                )}
              </MenuItem>
            </Transition>
          </Menu>
        ) : (
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant="outlined"
              className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
            >
              <PrinterIcon className="size-4" />
              <span>Print</span>
            </Button>

            <Menu
              as="div"
              className="relative inline-block whitespace-nowrap text-left"
            >
              <MenuButton
                as={Button}
                variant="outlined"
                className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
              >
                <TbUpload className="size-4" />
                <span>Export</span>
                <ChevronUpDownIcon className="size-4" />
              </MenuButton>
              <Transition
                as={MenuItems}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
              >
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Export as PDF</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Export as CSV</span>
                    </button>
                  )}
                </MenuItem>
              </Transition>
            </Menu>

            <Menu
              as="div"
              className="relative inline-block whitespace-nowrap text-left"
            >
              <MenuButton
                as={Button}
                variant="outlined"
                className="h-8 shrink-0 rounded-md px-2.5"
              >
                <EllipsisHorizontalIcon className="size-4.5" />
              </MenuButton>
              <Transition
                as={MenuItems}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="absolute z-[100] mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
              >
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>New User</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Share Users</span>
                    </button>
                  )}
                </MenuItem>
                <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Import Users</span>
                    </button>
                  )}
                </MenuItem>
                <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Save Table as View</span>
                    </button>
                  )}
                </MenuItem>
              </Transition>
            </Menu>
          </div>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
            <ViewTypeSelect table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
            )}
          >
            {table.getColumn("role") && (
              <RoleFilter
                column={table.getColumn("role")}
                options={rolesOptions}
              />
            )}
            
          </div>
        </>
      ) : (
//         <div
//           className={clsx(
//             "custom-scrollbar transition-content flex justify-between space-x-- overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
//             isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]",
//           )}
//           style={{
//             "--margin-scroll": isFullScreenEnabled
//               ? "1.25rem"
//               : "var(--margin-x)",
//           }}
//         >
//           {table.getColumn("role") && (
//             <RoleFilter
//               column={table.getColumn("role")}
//               options={rolesOptions}
//             />
//           )}
// <button className="bg-green-600">add new user</button>
//           <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
//             <SearchInput table={table} />
//             <TableConfig table={table} />
//             <ViewTypeSelect table={table} />
//           </div>
//         </div>
        <div
        className={clsx(
          "custom-scrollbar transition-content flex justify-between space-x-- overflow-x-auto pb-1 pt-4 rtl:space-x-reverse",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-[--margin-x]"
        )}
        style={{
          "--margin-scroll": isFullScreenEnabled ? "1.25rem" : "var(--margin-x)",
        }}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {table.getColumn("role") && (
            <RoleFilter column={table.getColumn("role")} options={rolesOptions} />
          )}
          {/* <button className="bg-green-600 px-4 py-2 rounded text-white">
            Add new user
          </button> */}
          <div>
      <Button onClick={() => setModalOpen(true)}>Ajouter une organisation</Button>
      <ScaleUp isOpen={isModalOpen} onClose={() => setModalOpen(false)}  onAddUser={onAddUser} />
    </div>
        </div>
      
        <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
          {/* <SearchInput table={table} /> */}
          {/* <TableConfig table={table} /> */}
          {/* <ViewTypeSelect table={table} /> */}
        </div>
      </div>
      
      )}

    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        root: "shrink-0",
        input: "text-xs ring-primary-500/50 focus:ring",
      }}
      placeholder="Search Course, Category..."
    />
  );
}

function ViewTypeSelect({ table }) {
  const setViewType = table.options.meta.setViewType;
  const viewType = table.getState().viewType;

  return (
    <div
      data-tab
      className="flex rounded-md bg-gray-200 px-1 py-1 text-xs+ text-gray-800 dark:bg-dark-700 dark:text-dark-200"
    >
      <Button
        data-tooltip
        data-tooltip-content="List View"
        data-tab-item
        className={clsx(
          "shrink-0 whitespace-nowrap rounded px-1.5 py-1 font-medium",
          viewType === "list"
            ? "bg-white shadow dark:bg-dark-500 dark:text-dark-100"
            : "hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
        )}
        unstyled
        onKeyDown={createScopedKeydownHandler({
          siblingSelector: "[data-tab-item]",
          parentSelector: "[data-tab]",
          activateOnFocus: true,
          loop: false,
          orientation: "horizontal",
        })}
        onClick={() => setViewType("list")}
      >
        <TbList className="size-4.5" />
      </Button>

      <Button
        data-tooltip
        data-tooltip-content="Grid View"
        data-tab-item
        className={clsx(
          "shrink-0 whitespace-nowrap rounded px-1.5 py-1 font-medium",
          viewType === "grid"
            ? "bg-white shadow dark:bg-dark-500 dark:text-dark-100"
            : "hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
        )}
        unstyled
        onKeyDown={createScopedKeydownHandler({
          siblingSelector: "[data-tab-item]",
          parentSelector: "[data-tab]",
          activateOnFocus: true,
          loop: false,
          orientation: "horizontal",
        })}
        onClick={() => setViewType("grid")}
      >
        <TbGridDots className="size-4.5" />
      </Button>
    </div>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object,
};

SearchInput.propTypes = {
  table: PropTypes.object,
};

ViewTypeSelect.propTypes = {
  table: PropTypes.object,
};



// // Import Dependencies
// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   Transition,
//   TransitionChild,
// } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { Fragment, useRef } from "react";

// // Local Imports
// import { Textarea, Button, Input, Select, Switch } from "components/ui";
// import { useDisclosure } from "hooks";

// // ----------------------------------------------------------------------

// export function ScaleUp() {
//   const [isOpen, { open, close }] = useDisclosure(false);

//   const saveRef = useRef(null);

//   return (
//     <>
//       <Button onClick={open}>Scale Uppp</Button>

//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
//           onClose={close}
//           initialFocus={saveRef}
//         >
//           <TransitionChild
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
//           </TransitionChild>

//           <TransitionChild
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <DialogPanel className="relative flex w-full max-w-lg origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
//               <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
//                 <DialogTitle
//                   as="h3"
//                   className="text-base font-medium text-gray-800 dark:text-dark-100"
//                 >
//                   Edit Pin
//                 </DialogTitle>
//                 <Button
//                   onClick={close}
//                   variant="flat"
//                   isIcon
//                   className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
//                 >
//                   <XMarkIcon className="size-4.5" />
//                 </Button>
//               </div>

//               <div className="flex flex-col overflow-y-auto px-4 py-4 sm:px-5">
//                 <p>
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//                   Assumenda incidunt
//                 </p>
//                 <div className="mt-4 space-y-5">
//                   <Select label="Choose Category">
//                     <option>React</option>
//                     <option>NodeJS</option>
//                     <option>Vue</option>
//                     <option>Others</option>
//                   </Select>
//                   <Textarea
//                     placeholder="Enter Description"
//                     label="Description"
//                     rows="4"
//                   />
//                   <Input
//                     placeholder="Enter URL Address"
//                     label="Website Address"
//                   />
//                   <Switch label="Public pin" />
//                 </div>
//                 <div className="mt-4 space-x-3 text-end rtl:space-x-reverse">
//                   <Button
//                     onClick={close}
//                     variant="outlined"
//                     className="min-w-[7rem] rounded-full"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={close}
//                     color="primary"
//                     ref={saveRef}
//                     className="min-w-[7rem] rounded-full"
//                   >
//                     Save
//                   </Button>
//                 </div>
//               </div>
//             </DialogPanel>
//           </TransitionChild>
//         </Dialog>
//       </Transition>
      
//     </>
//   );
// }
