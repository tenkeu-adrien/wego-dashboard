// Local Imports
// import Logo from "assets/appLogo.svg?react";
import { Progress } from "components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center">
      {/* <Logo  /> */}
      <img src="/logo1.png"  alt="logo" className="size-25" width={500} height={500}/>
      <Progress
        color="success"
        isIndeterminate
        animationDuration="1s"
        className="mt-2 h-1"
      />
    </div>
  );
}
