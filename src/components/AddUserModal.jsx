// Import Dependencies
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
  } from "@headlessui/react";
  import { XMarkIcon, UserPlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
  import { Fragment, useRef, useState } from "react";
  
  // Local Imports
  import {  Button, Input, Select, } from "components/ui";
  import { useDisclosure } from "hooks";
  import { User, Phone, Mail, MapPin} from 'lucide-react';
  
  // ----------------------------------------------------------------------
  
  export function AddUserModal() {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      ville: '',
      role: 'client',
      avatar: ''
    });
  
    const saveRef = useRef(null);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = () => {
      console.log('User added:', formData);
      // Ajoutez ici la logique pour sauvegarder l'utilisateur
      close();
    };
  
    return (
      <>
        <Button 
          onClick={open} 
          className="h-10 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span>Ajouter un utilisateur</span>
        </Button>
  
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            onClose={close}
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
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative flex w-full max-w-2xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
                <div className="flex items-center justify-between rounded-t-lg bg-green-600 px-4 py-3 dark:bg-green-700 sm:px-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-medium text-white"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Ajouter un nouvel utilisateur</span>
                    </div>
                  </DialogTitle>
                  <Button
                    onClick={close}
                    variant="flat"
                    isIcon
                    className="size-7 rounded-full bg-transparent hover:bg-green-700 ltr:-mr-1.5 rtl:-ml-1.5"
                  >
                    <XMarkIcon className="size-4.5 text-white" />
                  </Button>
                </div>
  
                <div className="flex flex-col overflow-y-auto px-4 py-4 sm:px-5">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                      name="name"
                      placeholder="Nom complet"
                      label="Nom"
                      value={formData.name}
                      onChange={handleInputChange}
                      icon={<User className="h-4 w-4 text-gray-400" />}
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      icon={<Mail className="h-4 w-4 text-gray-400" />}
                    />
                    <Input
                      name="phone"
                      placeholder="Téléphone"
                      label="Téléphone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      icon={<Phone className="h-4 w-4 text-gray-400" />}
                    />
                    <Input
                      name="ville"
                      placeholder="Ville"
                      label="Ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      icon={<MapPin className="h-4 w-4 text-gray-400" />}
                    />
                    <Select 
                      name="role"
                      label="Rôle"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="col-span-1"
                    >
                      <option value="moto-taxi">Moto-taxi</option>
                      <option value="trycycle">Trycycle</option>
                    </Select>
                    <Input
                      name="avatar"
                      placeholder="URL de l'avatar"
                      label="Avatar (URL)"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className="col-span-1"
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                    <Button
                      onClick={close}
                      variant="outlined"
                      className="min-w-[7rem] rounded-full flex items-center gap-2"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      color="primary"
                      ref={saveRef}
                      className="min-w-[7rem] rounded-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </Dialog>
        </Transition>
      </>
    );
  }