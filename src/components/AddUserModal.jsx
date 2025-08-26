import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef, useState, useEffect } from "react";
import { Button } from "components/ui";
import { useDisclosure } from "hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./../firebase.config";
import { useFirebaseUpload } from "hooks/useFirebaseUpload";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { compressImage, validatePdf } from './../../src/configs/fileUtils';

// Initialisation de Firebase Storage
const storage = getStorage(app);

// Schéma de validation
const userSchema = yup.object().shape({
  firstName: yup.string().required("Le nom est requis"),
  phone: yup
    .string()
    .required("Le téléphone est requis")
    .matches(/^[0-9]+$/, "Doit contenir uniquement des chiffres")
    .min(8, "Le téléphone doit contenir au moins 8 chiffres"),
  role: yup
    .string()
    .required("Le rôle est requis")
    .oneOf(["client", "driver", "manager"], "Rôle invalide"),
  vehiculeType: yup.string().when("role", {
    is: (val) => val === "driver",
    then: (schema) => schema.required("Le type de véhicule est requis"),
    otherwise: (schema) => schema.nullable(),
  }),
  matricule: yup.string().when("role", {
    is: (val) => val === "driver",
    then: (schema) => schema.required("La matricule est requise"),
    otherwise: (schema) => schema.nullable(),
  }),
  avatar: yup.mixed().when("role", {
    is: (val) => val === "driver",
    then: (schema) => schema.required("L'avatar est requis"),
    otherwise: (schema) => schema.nullable(),
  }),
  jointe: yup.mixed().when("role", {
    is: (val) => val === "driver",
    then: (schema) => schema.required("Le fichier est requis"),
    otherwise: (schema) => schema.nullable(),
  }),
  driverType: yup.string().when("role", {
    is: (val) => val === "driver",
    then: (schema) => schema.required("Le type de chauffeur est requis"),
    otherwise: (schema) => schema.nullable(),
  }),
});

export function AddUserModal({ fetchUsers, API_URL }) {
  const [isOpen, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const saveRef = useRef(null);


  const countryCodes = [
  { code: "CM", name: "Cameroun", dialCode: "+237", flag: "🇨🇲" },
  { code: "SN", name: "Sénégal", dialCode: "+221", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "GA", name: "Gabon", dialCode: "+241", flag: "🇬🇦" },
];
const [selectedCode, setSelectedCode] = useState(countryCodes[0]);




  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(userSchema),
    defaultValues: {
      firstName: "",
      phone: "",
      role: "client",
      vehiculeType: "",
      matricule: "",
      avatar: null,
      jointe: null,
      driverType: "",
    },
  });
  const { uploadFile } = useFirebaseUpload();
  const selectedRole = watch("role");
  const avatarFile = watch("avatar");
  console.log("uploadFile", uploadFile)

  // Effet pour gérer la prévisualisation de l'avatar
  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setAvatarPreview(reader.result );
      };
      
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  }, [avatarFile]);

  const showSuccessToast = () => {
    toast.success('Utilisateur créé avec succès!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleAddUser = async (userData) => {
    setError(null);
    
    try {
      // Préparation des données pour l'API AdonisJS
      const payload = {
        firstName: userData.firstName,
        phone: selectedCode.dialCode + userData.phone.replace(/^0+/, ""),
        role: userData.role,
        password: userData.matricule || "oiseaux2k2@",
        ...(userData.role === 'driver' && {
          vehiculeType: userData.vehiculeType,
          matricule: userData.matricule,
          avatar: userData.avatar, // Déjà transformé en URL
          jointe: userData.jointe, // Déjà transformé en URL
          driverType: userData.driverType
        })
      };
  console.log("payload" ,payload)
      const response = await axios.post(`${API_URL}/register`, payload);
      
      fetchUsers();
      reset();
      close();
      showSuccessToast();
      return response.data;
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // Upload des fichiers si c'est un chauffeur
      if (data.role === 'driver') {
        if (data.avatar && data.avatar.length > 0) {
          // Compression déjà faite dans handleAvatarChange, on upload directement
          const avatarRef = ref(storage, `avatars/${Date.now()}_${data.avatar[0].name}`);
          await uploadBytes(avatarRef, data.avatar[0]);
          data.avatar = await getDownloadURL(avatarRef);
        }
  
        if (data.jointe && data.jointe.length > 0) {
          // Valider le PDF avant upload
          const validatedPdf = validatePdf(data.jointe[0]);
          const jointeRef = ref(storage, `documents/${Date.now()}_${validatedPdf.name}`);
          await uploadBytes(jointeRef, validatedPdf);
          data.jointe = await getDownloadURL(jointeRef);
        }
      }
  
      await handleAddUser(data);
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error(error.message || "Erreur lors de l'ajout de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      setIsLoading(true);
      // Compresser l'image avant de la prévisualiser
      const compressedFile = await compressImage(file);
      
      // Créer une URL pour la prévisualisation
      const previewUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(compressedFile);
      });
      
      setAvatarPreview(previewUrl);
      setValue("avatar", [compressedFile]);
    } catch (error) {
      toast.error('Erreur lors de la compression de l\'image');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={open}
        className="h-10 px-4 py-2"
        style={{ backgroundColor: "#F4C509", color: "#06A257" }}
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
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur dark:bg-black/30" />
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
            <DialogPanel className="relative w-full max-w-3xl overflow-hidden rounded-lg bg-white dark:bg-dark-700">
              <div
                className="flex items-center justify-between px-4 py-3 sm:px-5"
                style={{ backgroundColor: "#F4C509" }}
              >
                <DialogTitle
                  as="h3"
                  className="text-base font-medium"
                  style={{ color: "#06A257" }}
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
                  className="size-7 rounded-full bg-transparent hover:bg-opacity-90"
                  style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                >
                  <XMarkIcon className="size-4.5" style={{ color: "#06A257" }} />
                </Button>
              </div>

              <div className="flex flex-col px-4 py-6 sm:px-5">
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Nom
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      placeholder="Nom complet"
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#06A257] focus:ring-[#06A257] ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Téléphone */}
                 <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
    Téléphone
  </label>
  <div className="mt-1 flex">
    <select
      value={selectedCode.dialCode}
      onChange={(e) => {
        const found = countryCodes.find(c => c.dialCode === e.target.value);
        if (found) setSelectedCode(found);
      }}
      className="mr-2 rounded-md border px-2 py-2 text-sm shadow-sm focus:border-[#06A257] focus:ring-[#06A257] bg-white"
    >
      {countryCodes.map((code) => (
        <option key={code.code} value={code.dialCode}>
          {code.flag} {code.dialCode}
        </option>
      ))}
    </select>
    <input
      type="text"
      {...register("phone")}
      placeholder="Téléphone (ex: 6xxxxxxxx)"
      className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#06A257] focus:ring-[#06A257] ${
        errors.phone ? "border-red-500" : "border-gray-300"
      }`}
    />
  </div>
  {errors.phone && (
    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
  )}
</div>


                  {/* Rôle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Rôle
                    </label>
                    <select
                      {...register("role")}
                      className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#06A257] focus:ring-[#06A257] ${
                        errors.role ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="client">Client</option>
                      <option value="driver">Chauffeur</option>
                      <option value="manager">manager</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                    )}
                  </div>

                  {/* Driver-specific fields */}
                  {selectedRole === "driver" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Type de véhicule
                        </label>
                        <select
                          {...register("vehiculeType")}
                          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#06A257] focus:ring-[#06A257] ${
                            errors.vehiculeType ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Sélectionnez un type</option>
                          <option value="moto-taxi">Moto-taxi</option>
                          <option value="trycycle">Trycycle</option>
                        </select>
                        {errors.vehiculeType && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.vehiculeType.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Matricule
                        </label>
                        <input
                          type="text"
                          {...register("matricule")}
                          placeholder="Matricule du véhicule"
                          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#06A257] focus:ring-[#06A257] ${
                            errors.matricule ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.matricule && (
                          <p className="mt-1 text-sm text-red-600">{errors.matricule.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Avatar (photo)
                        </label>
                        <div className="mt-1 flex items-center gap-4">

{avatarPreview && (
  <div className="relative">
    <img
      src={avatarPreview}
      alt="Preview"
      className="h-16 w-16 rounded-full object-cover"
      style={{
        // Optimisation pour les prévisualisations
        objectFit: 'cover',
        backgroundColor: '#f3f4f6' // Fond de fallback
      }}
    />
    {!isLoading && (
      <button
        type="button"
        onClick={() => {
          setAvatarPreview(null);
          setValue("avatar", null);
        }}
        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    )}
  </div>
)}



<label className="cursor-pointer">
  <span className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
    {isLoading ? 'Traitement...' : 'Choisir une photo'}
  </span>
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleAvatarChange}
    disabled={isLoading}
  />
</label>
                        </div>
                        {errors.avatar && (
                          <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Pièce jointe (CNI, Passeport)
                        </label>
                        <input
  type="file"
  accept=".jpg,.jpeg,.png,.pdf"
  {...register("jointe")}
  className="mt-1 w-full text-sm"
  disabled={isLoading}
/>
                        {errors.jointe && (
                          <p className="mt-1 text-sm text-red-600">{errors.jointe.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Type de chauffeur
                        </label>
                        <select
                          {...register("driverType")}
                          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-[#06A257] focus:ring-[#06A257] ${
                            errors.driverType ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Sélectionnez un type</option>
                          <option value="employe">Employé</option>
                          <option value="partenaire">Partenaire</option>
                        </select>
                        {errors.driverType && (
                          <p className="mt-1 text-sm text-red-600">{errors.driverType.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Boutons */}
                  <div className="col-span-2 mt-4 flex justify-end space-x-3 rtl:space-x-reverse">
                    <Button
                      type="button"
                      onClick={close}
                      variant="outlined"
                      className="min-w-[7rem] rounded-full"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      ref={saveRef}
                      className="min-w-[7rem] rounded-full"
                      style={{ backgroundColor: "#F4C509", color: "#06A257" }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          En cours...
                        </div>
                      ) : (
                        <>
                          <UserPlusIcon className="h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}