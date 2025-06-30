// Import Dependencies
// import { Link } from "react-router";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

// Local Imports
// import Logo from "assets/appLogo.svg?react";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { PhoneIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

// ----------------------------------------------------------------------

export default function SignIn() {
  const { login, errorMessage, isAuthenticated } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });


  console.log("errorMessage" ,errorMessage)
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // navigate('/dashboard');
      navigate('/dashboards');
    }
  }, [isAuthenticated ,navigate]);

  const onSubmit = (data) => {
      login({
      phone: data.phone,
      password: data.password,
    });

     
  };

  return (
    <Page title="Wego Login">
    <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
      <div className="w-full max-w-[30rem] sm:px-5"> {/* Augmentation de la largeur max */}
        <div className="text-center bg-yellow-400">
          <img src="/logo.png" className="mx-auto h-[200px] w-[200px] -mb-[60px]" alt="logo"/>
          <div className="mt-">
            <p className="text-gray-600 dark:text-dark-300">
              Veuillez vous connecter pour continuer
            </p>
          </div>
        </div>
        <Card className="mt-5 rounded-lg p-5 lg:p-7">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="space-y-4">
              <Input
                label="Numéro de téléphone"
                placeholder="Entrez votre numéro"
                prefix={
                  <PhoneIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                {...register("phone")} 
                error={errors?.phone?.message}
                className="w-full" 
                inputClassName="w-full" 
              />
             <Input
  label="Mot de passe"
  placeholder="Entrez votre mot de passe"
  type={showPassword ? "text" : "password"}
  prefix={
    <LockClosedIcon
      className="size-5 transition-colors duration-200"
      strokeWidth="1"
    />
  }
  suffix={ // 👁️ Icône d'affichage du mot de passe
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="focus:outline-none"
    >
      {showPassword ? (
        <EyeOffIcon className="size-5 text-gray-500" />
      ) : (
        <EyeIcon className="size-5 text-gray-500" />
      )}
    </button>
  }
  {...register("password")}
  error={errors?.password?.message}
  className="w-full"
  inputClassName="w-full"
/>
            </div>
  
            <div className="mt-2">
              <InputErrorMsg
                when={errorMessage && errorMessage?.message !== ""}
              >
                {errorMessage?.message}
              </InputErrorMsg>
            </div>
  
            <div className="mt-4 flex items-center justify-between space-x-2">
              <Checkbox label="Se souvenir de moi" />
              <a
                href="##"
                className="text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100"
              >
                Mot de passe oublié?
              </a>
            </div>
  
            <Button 
              type="submit" 
              className="mt-5 w-full" 
              style={{
                backgroundColor: "#F4C509", /* Couleur de fond */
                color: "#06A257" /* Couleur du texte */
              }}
            >
              Se connecter
            </Button>
          </form>
        </Card>
      </div>
    </main>
  </Page>
  );
}
