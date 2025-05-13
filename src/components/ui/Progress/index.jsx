import { forwardRef } from "react";

const Progress = forwardRef((props, ref) => {
  const {
    children,
    value = 0,
    showRail = true,
    price,
    category,
    className = "",
    style = {},
    rootProps = {},
    ...rest
  } = props;

  // Couleur bleue fixe avec différentes opacités
  const blueColor = {
    rail: 'bg-blue-00 dark:bg-blue-900/30',
    bar: 'bg-blue-600 dark:bg-blue-500',
    text: 'text-white'
  };

  return (
    <div className={`flex items-center gap-4 w-full ${className}`}>
      {category && (
        <span className="w-32 text-sm font-medium text-gray-600 dark:text-gray-300">
          {category}
        </span>
      )}
      
      {showRail && (
        <div
          {...rootProps}
          className={`flex-1 h-6 overflow-hidden ${blueColor.rail}`}
        >
          <div
            {...rest}
            ref={ref}
            className={`h-full flex items-center justify-end transition-all duration-300 ease-out ${blueColor.bar}`}
            style={{
              width: `${value}%`,
              borderRadius: '0 4px 4px 0', // Arrondi seulement à droite
              ...style,
            }}
          >
            {price && (
              <span className={`text-xs font-medium ${blueColor.text} px-2`}>
                {price} 
              </span>
            )}
            {children}
          </div>
        </div>
      )}
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };