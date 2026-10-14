import clsx from "clsx";
import React, { type ComponentProps } from "react";

interface IShadowComponentProps extends ComponentProps<"div"> {
  item: React.JSX.Element;
  className?: string;
}

export const ShadowComponent: React.FC<IShadowComponentProps> = ({
  item,
  className,
  ...props
}) => {
  return (
    <div className={clsx("shadow-orange", className)} {...props}>
      {item}
    </div>
  );
};
