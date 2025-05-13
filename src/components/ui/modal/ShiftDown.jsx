// import {

//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   Transition,
//   TransitionChild,
// } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { Fragment, useRef } from "react";
// import { Button } from "components/ui";
// import PropTypes from 'prop-types';

// // Données statiques (à déplacer si nécessaire)
// const users = [
//   {
//     id: 1,
//     name: "Alice Dupont",
//     email: "alice.dupont@example.com",
//     avatar: "https://i.pravatar.cc/150?img=1",
//   },{
//     id: 4,
//     name: "Marc Lefebvre",
//     email: "marc.lefebvre@example.com",
//     avatar: "https://i.pravatar.cc/150?img=4",
//   },
//   {
//     id: 5,
//     name: "Emma Rousseau",
//     email: "emma.rousseau@example.com",
//     avatar: "https://i.pravatar.cc/150?img=5",
//   },
//   {
//     id: 6,
//     name: "Lucas Morel",
//     email: "lucas.morel@example.com",
//     avatar: "https://i.pravatar.cc/150?img=6",
//   },
//   // ... autres utilisateurs
// ];

// const kycInfo = {
//   profilePicture: "https://placehold.co/600x600",
//   fullName: "John Doe",
//   address: "456 Health Blvd, Boston, MA",
//   phone: "+1 123-456-7890",
//   email: "john.doe@example.com",
//   idNumber: "ID-123456789",
//   idType: "Passport",
//   status: "Verified",
// };
// export function ShiftDown({ isOpen, onClose, data }) {
//   const saveRef = useRef(null);

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog
//         as="div"
//         className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
//         onClose={onClose}
//         initialFocus={saveRef}
//       >
//         <TransitionChild
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
//         </TransitionChild>

//         <TransitionChild
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0 [transform:translate3d(0,-1rem,0)]"
//           enterTo="opacity-100 [transform:translate3d(0,0,0)]"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100 [transform:translate3d(0,0,0)]"
//           leaveTo="opacity-0 [transform:translate3d(0,-1rem,0)]"
//         >
//            <DialogPanel className="scrollbar-sm relative flex w-full max-w-4xl flex-col overflow-y-auto rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-dark-700">
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-500">
//               <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-dark-50">
//                 Détails de l&apos;organisation
//               </DialogTitle>
//               <Button
//                 onClick={onClose}
//                 variant="flat"
//                 isIcon
//                 className="size-7 rounded-full"
//               >
//                 <XMarkIcon className="size-5" />
//               </Button>
//             </div>
//             {/* Content */}
//             <div className="flex-1 overflow-y-auto p-5 space-y-6">
//               {/* Section Organisation */}
//               {data && (
//                 <div>
//                   <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-dark-50">
//                     Informations sur l&apos;organisation
//                   </h3>
//                   <div className="rounded-lg bg-gray-100 dark:bg-dark-600 p-4 space-y-3">
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Nom:</span> {data.name}
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Email:</span> {data.email}
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Téléphone:</span> {data.phone}
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Nombre d&apos;employés:</span> {data.employeeCount}
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Licence:</span> {data.license}
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Rôle:</span> {data.role}
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Statut:</span>{" "}
//                       <span className={`${data.status ? "text-green-500" : "text-red-500"}`}>
//                         {data.status ? "Actif" : "Inactif"}
//                       </span>
//                     </p>
//                     <p className="text-sm text-gray-800 dark:text-dark-200">
//                       <span className="font-medium">Âge de l&apos;entreprise:</span> {data.age} ans
//                     </p>
//                   </div>
//                 </div>
//               )}
//               <div>
//                 <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-dark-50">
//                   Informations personnelles
//                 </h3>
//                 <div className="rounded-lg bg-gray-100 dark:bg-dark-600 p-4">
//                   <div className="flex flex-row gap-6 items-start">
//                     {/* Section Informations KYC */}
//                     <div className="bg-white shadow-md rounded-lg p-4 w-1/2">
//                       <h2 className="text-lg font-semibold mb-3">Informations KYC</h2>
//                       <p className="text-sm text-gray-800">
//                         <span className="font-bold">Nom :</span> {kycInfo.fullName}
//                       </p>
//                       <p className="text-sm text-gray-800">
//                         <span className="font-bold">Adresse :</span> {kycInfo.address}
//                       </p>
//                       <p className="text-sm text-gray-800">
//                         <span className="font-bold">Téléphone :</span> {kycInfo.phone}
//                       </p>
//                       <p className="text-sm text-gray-800">
//                         <span className="font-bold">Email :</span> {kycInfo.email}
//                       </p>
//                       <p className="text-sm text-gray-800">
//                         <span className="font-bold">Numéro d&apos;identité :</span> {kycInfo.idNumber}
//                       </p>
//                       <p className="text-sm text-gray-800">
//                         <span className="font-bold">Type d&apos;identité :</span> {kycInfo.idType}
//                       </p>
//                       <p className="text-sm text-gray-800">
//                         <span className="font-bold">Statut :</span> {kycInfo.status}
//                       </p>
//                     </div>
//                      {/* Section Liste des utilisateurs */}
//                      <div className="w-1/2 bg-white shadow-md rounded-lg p-4">
//                       <h2 className="text-lg font-semibold mb-3">Liste des utilisateurs</h2>
//                       <div className="h-[140px] overflow-y-auto space-y-3">
//                         {users.map((user) => (
//                           <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg shadow-sm">
//                             <img
//                               src={user.avatar}
//                               alt={user.name}
//                               className="rounded-full border w-[40px] h-[40px]"
//                             />
//                             <div>
//                               <p className="text-sm font-semibold">{user.name}</p>
//                               <p className="text-xs text-gray-500">{user.email}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-dark-50">
//                 Informations sur l&apos;abonnement
//               </h3>
//             </div>
//           </DialogPanel>
//         </TransitionChild>
//       </Dialog>
//     </Transition>
//   );
// }

// ShiftDown.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   data: PropTypes.object
// };


import {
  Dialog,
  DialogPanel,
  // DialogTitle,
  Transition,
  TransitionChild,
  Tab, 
  TabGroup, 
  TabList, 
  TabPanel, 
  TabPanels
} from "@headlessui/react";
import { 
  XMarkIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Avatar, Badge, Button, Card } from "components/ui";
import clsx from "clsx";
import PropTypes from 'prop-types';
import { Circlebar } from "components/ui";
import { InvoiceTable } from "../settings/components/InvoiceTable";
import { Tag } from "components/ui";
const tabs = [
  {
    id: 1,
    title: "Organisation",
    icon: BuildingOfficeIcon,
  },
  {
    id: 2,
    title: "Informations personnelles",
    icon: UserGroupIcon,
  },
  {
    id: 3,
    title: "Abonnements",
    icon: CreditCardIcon,
  }
];
const users = [
  {
    id: 1,
    name: "Alice Dupont",
    email: "alice.dupont@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  },{
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
export function ShiftDown({ isOpen, onClose, data }) {
  const colorFromText = (text) => {
    const colors = ["primary", "success", "warning", "info", "error"];
    const hash = text.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

   console.log("data" ,data)
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-[200px] py-6 sm:px-8 overflow-scroll"
        onClose={onClose}
      >
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40" />
        </TransitionChild>

        <TransitionChild
          as={DialogPanel}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-dark-700"
        > 
        <>
        {/* Header avec bouton fermeture */}
        <div className="flex justify-end p-4">
          <Button
            onClick={onClose}
            variant="flat"
            isIcon
            className="size-7 rounded-full"
          >
            <XMarkIcon className="size-5" />
          </Button>
        </div>

        {/* Contenu avec onglets */}
        <div className="px-6 pb-6">
          <TabGroup>
            <div className="hide-scrollbar overflow-x-auto">
              <div className="w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
                <TabList className="-mb-0.5 flex">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.id}
                      className={({ selected }) =>
                        clsx(
                          "shrink-0 space-x-2 whitespace-nowrap border-b-2 px-4 py-2 font-medium rtl:space-x-reverse",
                          selected
                            ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                            : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100"
                        )
                      }
                      as={Button}
                      unstyled
                    >
                      <tab.icon className="size-5" />
                      <span>{tab.title}</span>
                    </Tab>
                  ))}
                </TabList>
              </div>
            </div>
            <TabPanels className="mt-4">
                
<TabPanel>
  <Card className="flex grow flex-col items-center p-4 sm:p-5">
    <Avatar
      size={20}
      name={data?.name}
      src={data?.avatar}
      initialColor="auto"
      classNames={{
        display: "text-2xl",
      }}
    />
    <h3 className="pt-3 text-lg font-medium text-gray-800 dark:text-dark-100">
      {data?.name}
    </h3>
    <p className="text-xs+">{data?.license}</p>
    <div className="my-4 h-px w-full bg-gray-200 dark:bg-dark-500"></div>
    <div className="mx-auto inline-grid grid-cols-1 gap-3 w-full">
      <div className="flex min-w-0 items-center space-x-2">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-600">
          <PhoneIcon className="size-3.5" />
        </div>
        <p className="truncate">{data?.phone}</p>
      </div>
      <div className="flex min-w-0 items-center space-x-2">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-600">
          <EnvelopeIcon className="size-3.5" />
        </div>
        <p className="truncate">{data?.email} </p>
      </div>
      <div className="flex min-w-0 items-center space-x-2">
        <Badge color={data?.status ? "success" : "error"}>
          {data?.status ? "Actif" : "Inactif"}
        </Badge>
      </div>
    </div>
    {/* Nouvelle section pour la description et les services */}
    <div className="flex grow flex-col px-4 w-full mt-4">
      <div className="mt-4">
        <p className="text-base font-medium text-gray-700 dark:text-dark-100">
          À propos de l&apos;organisation
        </p>
        <p className="mt-2 line-clamp-3">
          {data?.description}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {data?.services?.map((service, i) => (
          <Tag
            key={i}
            href="#"
            className="rounded-full text-tiny+"
            color={colorFromText(service)}
            variant="outlined"
          >
            {service}
          </Tag>
        ))}
      </div>
    </div>
  </Card>
</TabPanel>

                  {/* Onglet Informations personnelles */}
                  <TabPanel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {users.map((user) => (
                        <Card key={user.id} className="flex flex-row justify-between space-x-2 p-4">
                          <div>
                            <div className="flex space-x-1">
                              <h4 className="text-base font-medium text-gray-800 dark:text-dark-100">
                                {user.name}
                              </h4>
                            </div>
                            <p className="text-xs+">{user.email}</p>
                          </div>
                          <Avatar
                            size={10}
                            name={user.name}
                            src={user.avatar}
                            initialColor="auto"
                            classNames={{
                              display: "mask is-squircle rounded-none",
                            }}
                          />
                        </Card>
                      ))}
                    </div>
                  </TabPanel>
                  {/* Onglet Abonnements */}
                  <TabPanel>
                    <div className="space-y-16">
                      <div className="rounded-lg bg-gray-100 p-4 dark:bg-dark-800">
                        <div className="flex flex-col items-start justify-between sm:flex-row">
                          <div>
                            <p className="text-lg font-medium text-gray-800 dark:text-dark-100">
                              Premium Plan
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Circlebar
                                size={5}
                                strokeWidth={12}
                                variant="soft"
                                value={60}
                                color="primary"
                                className="flex"
                              />
                              <p>136 / 300 Days left</p>
                            </div>
                          </div>
                          <Button className="mt-6 sm:mt-0" color="primary">
                            Upgrade
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-base font-medium text-gray-800 dark:text-dark-100">
                          Invoices
                        </p>
                        <div className="hide-scrollbar -mx-4 mt-4 flex items-start gap-3 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
        <div className="w-72 shrink-0 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 p-[3px]">
          <div className="rounded-lg bg-white p-4 pb-3 dark:bg-dark-700">
            <div className="flex items-start justify-between">
              <div>
                <img
                  src="/images/payments/cc-visa.svg"
                  className="h-5"
                  alt="logo"
                />
                <div className="mt-2">
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    Travis Fuller
                  </p>
                  <p className="mt-0.5 text-xs">•••• 6988</p>
                </div>
              </div>
              <Badge
                className="h-5 rounded-full text-tiny+ uppercase"
                color="primary"
              >
                Primary
              </Badge>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs">Expired 02.06.2024</p>

              <Button
                className="-mb-1 -mr-1 size-6 rounded-full"
                variant="flat"
                isIcon
              >
                <Cog6ToothIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-72 shrink-0 rounded-lg bg-gradient-to-br from-info to-info-darker p-[3px]">
          <div className="rounded-lg bg-white p-4 pb-3 dark:bg-dark-700">
            <div className="flex items-start justify-between">
              <div>
                <img
                  src="/images/payments/cc-mastercard.svg"
                  className="h-5"
                  alt="logo"
                />
                <div className="mt-2">
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    Samantha Shelton
                  </p>
                  <p className="mt-0.5 text-xs">•••• 6988</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs">Expired 02.06.2024</p>

              <Button
                className="-mb-1 -mr-1 size-6 rounded-full"
                variant="flat"
                isIcon
              >
                <Cog6ToothIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-72 shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-[3px]">
          <div className="rounded-lg bg-white p-4 pb-3 dark:bg-dark-700">
            <div className="flex items-start justify-between">
              <div>
                <img
                  src="/images/payments/paypal.svg"
                  className="h-5"
                  alt="logo"
                />
                <div className="mt-2">
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    John Doe
                  </p>
                  <p className="mt-0.5 text-xs">John@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs">Expired 02.06.2024</p>

              <Button
                className="-mb-1 -mr-1 size-6 rounded-full"
                variant="flat"
                isIcon
              >
                <Cog6ToothIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
                        <div className="mt-4">
                          <InvoiceTable />
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </>
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