import React from "react";
import AppBar from "@mui/material/AppBar";
import { Outlet } from "react-router-dom";

import AgricultureIcon from "@mui/icons-material/Agriculture";

export const DefaultLayout: React.FC = () => {
  return (
    <div className="h-dvh bg-purple-100">
      <AppBar className="bg-white! px-6 py-4 ">
        <div className="flex gap-4">
          <div className="bg-orange-100 w-fit p-4 rounded-full">
            <AgricultureIcon />
          </div>
          <div>
            <h1 className="font-bold text-orange-100 text-2xl">Agro control</h1>
            <p className="text-sm text-black font-semibold">
              Modulo de acompanhamento Bovino
            </p>
          </div>
        </div>
      </AppBar>
      <div className="mt-24 p-6">
        <Outlet />
      </div>
    </div>
  );
};
