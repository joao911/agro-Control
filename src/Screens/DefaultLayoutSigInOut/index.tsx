import { Card } from "@mui/material";
import { Outlet } from "react-router-dom";

export const DefaultLayoutSigInOut = () => {
  return (
    <div className="h-dvh flex justify-center items-center w-full bg-cover md:bg-[url(/bg.png)]">
      <div className="relative flex flex-col items-center w-full px-4">
        <Card
          elevation={0}
          sx={{ overflow: "visible" }}
          className="relative p-4 pb-12 overflow-visible md:px-12"
        >
          <Outlet />
        </Card>
      </div>
    </div>
  );
};
