// Local Imports
import { Progress } from "components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <div className="fixed grid h-full w-full place-content-center">
    <div className="bg-[#F4C509]">
    <img src="/logo.png" alt="logo" style={{width: "400px"}} />   
    </div>
      <Progress
        color="success"
        isIndeterminate
        animationDuration="1s"
        className="mt-2 h-1"
      />
    </div>
  );
}
