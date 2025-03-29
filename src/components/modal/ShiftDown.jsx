// Import Dependencies
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
// import { useDisclosure } from "hooks";
// import { Switch, Button, Checkbox } from "components/ui";

// // ----------------------------------------------------------------------

// export function ShiftDown() {
//   const [isOpen, { open, close }] = useDisclosure(false);

//   const saveRef = useRef(null);

//   return (
//     <>
//       <Button onClick={open}>Shift Down</Button>

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
//             enterFrom="opacity-0 [transform:translate3d(0,-1rem,0)]"
//             enterTo="opacity-100 [transform:translate3d(0,0,0)]"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 [transform:translate3d(0,0,0)]"
//             leaveTo="opacity-0 [transform:translate3d(0,-1rem,0)]"
//           >
//             <DialogPanel className="scrollbar-sm relative flex w-full max-w-sm flex-col overflow-y-auto rounded-lg bg-white px-4 pb-4 transition-all duration-300 dark:bg-dark-700 sm:px-5">
//               <div className="my-3 flex h-8 items-center justify-between">
//                 <DialogTitle
//                   as="h3"
//                   className="line-clamp-1 font-medium tracking-wide text-gray-800 dark:text-dark-100 lg:text-base"
//                 >
//                   Table Settings
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
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
//                 dignissimos.
//               </p>
//               <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
//                 <Checkbox label="ID" defaultChecked />
//                 <Checkbox label="Name" defaultChecked />
//                 <Checkbox label="Email" defaultChecked />
//                 <Checkbox label="Address" />
//                 <Checkbox label="Created At" />
//                 <Checkbox label="Updated At" defaultChecked />
//                 <label className="col-span-2 inline-flex items-center space-x-2 rtl:space-x-reverse">
//                   <Switch variant="outlined" />
//                   <span>Show Avatar</span>
//                 </label>
//               </div>
//               <div className="mt-4 text-end">
//                 <Button
//                   onClick={close}
//                   variant="flat"
//                   className="h-8 rounded-full text-xs+"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={close}
//                   color="primary"
//                   className="h-8 rounded-full text-xs+"
//                   ref={saveRef}
//                 >
//                   Save
//                 </Button>
//               </div>
//             </DialogPanel>
//           </TransitionChild>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef } from "react";
import { Button } from "components/ui";
import PropTypes from 'prop-types';

// Données statiques (à déplacer si nécessaire)
const users = [
  {
    id: 1,
    name: "Alice Dupont",
    email: "alice.dupont@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 4,
    name: "Marc Lefebvre",
    email: "marc.lefebvre@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Emma Rousseau",
    email: "emma.rousseau@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Lucas Morel",
    email: "lucas.morel@example.com",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  // ... autres utilisateurs
];

const kycInfo = {
  profilePicture: "https://placehold.co/600x600",
  fullName: "John Doe",
  address: "456 Health Blvd, Boston, MA",
  phone: "+1 123-456-7890",
  email: "john.doe@example.com",
  idNumber: "ID-123456789",
  idType: "Passport",
  status: "Verified",
};

export function ShiftDown({ isOpen, onClose, data }) {
  const saveRef = useRef(null);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={onClose}
        initialFocus={saveRef}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 [transform:translate3d(0,-1rem,0)]"
          enterTo="opacity-100 [transform:translate3d(0,0,0)]"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 [transform:translate3d(0,0,0)]"
          leaveTo="opacity-0 [transform:translate3d(0,-1rem,0)]"
        >
          <DialogPanel className="scrollbar-sm relative flex w-full max-w-4xl flex-col overflow-y-auto rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-dark-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-500">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-dark-50">
                Détails de l'organisation
              </DialogTitle>
              <Button
                onClick={onClose}
                variant="flat"
                isIcon
                className="size-7 rounded-full"
              >
                <XMarkIcon className="size-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Section Organisation */}
              {data && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-dark-50">
                    Informations sur l'organisation
                  </h3>
                  <div className="rounded-lg bg-gray-100 dark:bg-dark-600 p-4 space-y-3">
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Nom:</span> {data.name}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Email:</span> {data.email}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Téléphone:</span> {data.phone}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Nombre d'employés:</span> {data.employeeCount}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Licence:</span> {data.license}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Rôle:</span> {data.role}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Statut:</span>{" "}
                      <span className={`${data.status ? "text-green-500" : "text-red-500"}`}>
                        {data.status ? "Actif" : "Inactif"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-800 dark:text-dark-200">
                      <span className="font-medium">Âge de l'entreprise:</span> {data.age} ans
                    </p>
                  </div>
                </div>
              )}

              {/* Section KYC et Liste des utilisateurs */}
              <div>
                <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-dark-50">
                  Informations personnelles
                </h3>
                <div className="rounded-lg bg-gray-100 dark:bg-dark-600 p-4">
                  <div className="flex flex-row gap-6 items-start">
                    {/* Section Informations KYC */}
                    <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
                      <h2 className="text-lg font-semibold mb-3">Informations KYC</h2>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Nom :</span> {kycInfo.fullName}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Adresse :</span> {kycInfo.address}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Téléphone :</span> {kycInfo.phone}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Email :</span> {kycInfo.email}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Numéro d'identité :</span> {kycInfo.idNumber}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Type d'identité :</span> {kycInfo.idType}
                      </p>
                      <p className="text-sm text-gray-800">
                        <span className="font-bold">Statut :</span> {kycInfo.status}
                      </p>
                    </div>

                    {/* Section Liste des utilisateurs */}
                    <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
                      <h2 className="text-lg font-semibold mb-3">Liste des utilisateurs</h2>
                      <div className="h-[180px] overflow-y-auto space-y-3">
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg shadow-sm">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="rounded-full border w-[40px] h-[40px]"
                            />
                            <div>
                              <p className="text-sm font-semibold">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-dark-50">
                Informations sur l'abonnement
              </h3>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

ShiftDown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object
};