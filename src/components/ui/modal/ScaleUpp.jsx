// import { Textarea, Button, Input, Select, Switch } from "components/ui";
// import {
//     Dialog,
//     DialogPanel,
//     DialogTitle,
//     Transition,
//     TransitionChild,
//   } from "@headlessui/react";
//   import { XMarkIcon } from "@heroicons/react/24/outline";
//   import { Fragment, useRef } from "react";
  
//   // Local Imports
// //   import { Textarea, Button, Input, Select, Switch } from "components/ui";
// //   import { useDisclosure } from "hooks";
  
// export function ScaleUp({ isOpen, onClose }) {
//     const saveRef = useRef(null);
  
//     return (
//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
//           onClose={onClose}
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
//                   Ajouter un nouvel utilisateur
//                 </DialogTitle>
//                 <Button
//                   onClick={onClose}
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
//                   <Textarea placeholder="Enter Description" label="Description" rows="4" />
//                   <Input placeholder="Enter URL Address" label="Website Address" />
//                   <Switch label="Public pin" />
//                 </div>
//                 <div className="mt-4 space-x-3 text-end rtl:space-x-reverse">
//                   <Button onClick={onClose} variant="outlined" className="min-w-[7rem] rounded-full">
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={onClose}
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
//     );
//   }
  
//   ScaleUp.displayName = "ScaleUp"; // Correction ESLint


import { useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Button, Input } from "components/ui";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Listbox } from "components/shared/form/Listbox";

const roles = [
  { name: "Admin" },
  { name: "superAdmin" },
  { name: "manager" },
];

export function ScaleUp({ isOpen, onClose, onAddUser }) {
  const [emailVerified, setEmailVerified] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [selected, setSelected] = useState([roles[0]]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const inputRefs = useRef([]);

  const handleVerifyEmail = () => {
    setShowVerificationModal(true);
  };

  const handleSubmitVerification = () => {
    if (verificationCode === "1234") {
      setEmailVerified(true);
      setShowVerificationModal(false);
    } else {
      alert("Code incorrect !");
    }
  };

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      alert("Tous les champs doivent être remplis !");
      return;
    }

    if (!emailVerified) {
      alert("Veuillez vérifier l'email avant de soumettre.");
      return;
    }

    // Appeler la fonction onAddUser passée en props
    onAddUser({ name, email, phone});
    onClose(); // Fermer le modal après soumission
  };


  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Autoriser uniquement les chiffres

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus(); // Aller à la case suivante
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Revenir à la case précédente
    }
  };


  return (
    <>
      <Transition appear show={isOpen} as="div">
        <Dialog as="div" className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-5" onClose={onClose}>
          <TransitionChild
            as="div"
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
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative flex w-full max-w-3xl flex-col rounded-lg bg-white dark:bg-dark-700">
              <div className="flex items-center justify-between bg-gray-200 px-4 py-3 dark:bg-dark-800">
                <DialogTitle as="h3" className="text-base font-medium text-gray-800 dark:text-dark-100">
                  Ajouter un utilisateur
                </DialogTitle>
                <Button onClick={onClose} variant="flat" isIcon className="size-7 rounded-full">
                  <XMarkIcon className="size-4.5" />
                </Button>
              </div>

              <div className="flex flex-col px-4 py-4 sm:px-5">
                <Input
                  placeholder="Nom complet"
                  label="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Téléphone"
                  label="Téléphone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
               
                <div className="max-w-xl">
                  <Listbox
                    data={roles}
                    value={selected}
                    onChange={setSelected}
                    displayField="name"
                    placeholder="Sélectionner un rôle"
                    label="Rôle"
                    multiple
                  />
                </div>

                <div className="mt-4 space-x-3 text-end rtl:space-x-reverse">
                  <Button onClick={onClose} variant="outlined" className="min-w-[7rem] rounded-full">
                    Annuler
                  </Button>
                  {!emailVerified ? (
                    <Button onClick={handleVerifyEmail} color="primary" className="min-w-[7rem] rounded-full">
                      Vérifier lemail
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} color="primary" className="min-w-[7rem] rounded-full">
                      Soumettre
                    </Button>
                  )}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>

      {/* Modal de vérification de l'email */}
      {/* <Transition appear show={showVerificationModal} as="div">
        <Dialog as="div" className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 sm:px-5" onClose={() => setShowVerificationModal(false)}>
          <TransitionChild
            as="div"
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
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative flex w-full max-w-md flex-col rounded-lg bg-white dark:bg-dark-700 p-6">
              <DialogTitle as="h3" className="text-lg font-semibold text-gray-800 dark:text-dark-100">
                Vérification de lemail
              </DialogTitle>
              <p className="mt-2 text-sm text-gray-600 dark:text-dark-200">
                Un code de vérification a été envoyé à votre email. Entrez-le ci-dessous :
              </p>
              <Input
                placeholder="Code reçu par email"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={() => setShowVerificationModal(false)} variant="outlined">
                  Annuler
                </Button>
                <Button onClick={handleSubmitVerification} color="primary">
                  Vérifier
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition> */}

      <Transition appear show={showVerificationModal} as="div">
      <Dialog as="div" className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 sm:px-5" onClose={() => setShowVerificationModal(false)}>
        <TransitionChild
          as="div"
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
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="relative flex w-full max-w-md flex-col rounded-lg bg-white dark:bg-dark-700 p-6">
            <DialogTitle as="h3" className="text-lg font-semibold text-gray-800 dark:text-dark-100">
              Vérification de l email
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600 dark:text-dark-200">
              Un code de vérification a été envoyé à votre email. Entrez-le ci-dessous :
            </p>

            <div className="mt-4 flex justify-center space-x-2">
              {verificationCode.map((num, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={num}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-dark-600 dark:border-dark-400"
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-600"
              >
                Annuler
              </button>
              <button
                onClick={() => handleSubmitVerification(verificationCode.join(""))}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Vérifier
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
    </>
  );
}

ScaleUp.displayName = "ScaleUp";











