// Import Dependencies
import { Link } from "react-router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

// Local Imports
// import Logo from "assets/appLogo.svg?react";
import { Button } from "components/ui";
import { useSidebarContext } from "app/contexts/sidebar/context";

// ----------------------------------------------------------------------

export function Header() {
  const { close } = useSidebarContext();
  return (
    <header className="relative flex h-[150px] shrink-0 items-center justify-between ltr:pl-6 ltr:pr-3 rtl:pl-3 rtl:pr-6 bg-yellow-400">
      <div className=" ">
        <Link to="/" className="">
          {/* <Logo  /> */}
          <img  alt="logo" src="/logo.png"  className=" text-primary-600 dark:text-primary-400  h-[200px] w-[300px]"/>
        </Link>
       
        {/* <span className="h-5 w-auto text-gray-800  text-xl dark:text-dark-50 font-bold" > Zégo</span> */}
      </div>
      <div className="pt-5 xl:hidden bg-white">
        <Button
          onClick={close}
          variant="flat"
          isIcon
          className="size-6 rounded-full"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
        </Button>
      </div>
    </header>
  );
}
