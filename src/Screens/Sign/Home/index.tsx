import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  Paper,
  Table,
  Button,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TextField,
  TableContainer,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { ModalSeeImage } from "./components/ModalSeeImage";
import { ModalCreateAndUpdate } from "./components/ModalCreateAndUpdate";
import type {
  BovinoFormSubmit,
  BovinoSex,
} from "./components/ModalCreateAndUpdate/useBovinoFormValidation";
import { ModalConfirm } from "../../../components/ModalConfirm";
import { CardAnimal } from "./components/CardAnimal";

export type HerdAnimal = {
  id: string;
  name: string;
  sex: BovinoSex;
  origin: string;
  purchaseDate: Date;
  updatedAt: Date;
  weight: string;
  age: string;
  calfAge: string;
  heatDate: Date | null;
  observations: string;
  photoUrl: string[];
};

export const formatDate = (date: Date) => format(date, "dd/MM/yyyy");

export const Home = () => {
  const [openModalSeeImage, setOpenModalSeeImage] = useState(false);
  const [, setSearch] = useState("");
  const [animals, setAnimals] = useState<HerdAnimal[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<HerdAnimal | null>(null);
  const [photosToSee, setPhotosToSee] = useState<string[]>([]);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const openCreate = () => {
    setEditingAnimal(null);
    setFormOpen(true);
  };

  const openEdit = (animal: HerdAnimal) => {
    setEditingAnimal(animal);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingAnimal(null);
  };

  const handleSave = (data: BovinoFormSubmit) => {
    const newPhotoUrl = data.photo ? URL.createObjectURL(data.photo) : null;

    if (editingAnimal) {
      setAnimals((current) =>
        current.map((animal) =>
          animal.id === editingAnimal.id
            ? {
                ...animal,
                name: data.name,
                sex: data.sex,
                origin: data.origin,
                purchaseDate: data.purchaseDate,
                updatedAt: new Date(),
                weight: data.weight,
                age: data.age,
                calfAge: data.calfAge,
                heatDate: data.heatDate,
                observations: data.observations,
                photoUrl: newPhotoUrl
                  ? [...animal.photoUrl, newPhotoUrl]
                  : animal.photoUrl,
              }
            : animal,
        ),
      );
    } else {
      setAnimals((current) => [
        {
          id: crypto.randomUUID(),
          name: data.name,
          sex: data.sex,
          origin: data.origin,
          purchaseDate: data.purchaseDate,
          updatedAt: new Date(),
          weight: data.weight,
          age: data.age,
          calfAge: data.calfAge,
          heatDate: data.heatDate,
          observations: data.observations,
          photoUrl: newPhotoUrl ? [newPhotoUrl] : [],
        },
        ...current,
      ]);
    }

    closeForm();
  };

  const handleDelete = (id: string) => {
    setAnimals((current) => current.filter((animal) => animal.id !== id));
    setOpenModalDelete(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-orange-600">
        Gestão do rebanho e acompanhamento fotográfico
      </h1>
      <span>
        Módulo destinado ao monitoramento biométrico e registro fotográfico
        periódico a cada 30 dias. Permite gerenciar a evolução corporal, origem
        e controle cronológico de pesagem dos animais.
      </span>
      <div className="mt-4 w-full h-0.5 bg-orange-600 rounded-full" />
      <Card className="p-4 mt-4 flex gap-4 md:flex-row flex-col">
        <div className="flex items-center w-full">
          <TextField
            id="outlined-basic"
            label="Pesquisar"
            variant="outlined"
            fullWidth
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por Razão Social ou Nome Fantasia"
            slotProps={{ input: { style: { color: "#f08c10" } } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px 0 0 8px",
                "& fieldset": {
                  borderColor: "#f08c10",
                },
                "&:hover fieldset": {
                  borderColor: "#f08c10",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f08c10",
                },
              },
            }}
          />
          <div className="flex items-center justify-center p-2 bg-orange-100 rounded-r-sm">
            <SearchIcon className="text-white!" />
          </div>
        </div>
        <Button
          variant="contained"
          className="bg-blue-100! capitalize! w-full md:w-40!"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          Novo Bovino
        </Button>
      </Card>
      {animals.map((item) => (
        <CardAnimal
          key={item.id}
          animal={item}
          openEdit={openEdit}
          setOpenModalSeeImage={setOpenModalSeeImage}
          setPhotosToSee={setPhotosToSee}
          setOpenModalDelete={setOpenModalDelete}
        />
      ))}

      <Paper
        sx={{ width: "100%", overflow: "hidden" }}
        className="mt-4  rounded-tl-2xl! rounded-tr-2xl!"
      >
        <TableContainer sx={{ maxHeight: 440 }} className="hidden md:block">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  className="bg-orange-100! text-white! font-bold! rounded-tl-2xl!"
                >
                  Foto
                </TableCell>
                <TableCell
                  align="center"
                  className="bg-orange-100! text-white! font-bold!"
                >
                  Nome / identificação
                </TableCell>
                <TableCell
                  align="center"
                  className="bg-orange-100! text-white! font-bold!"
                >
                  Procedência
                </TableCell>
                <TableCell
                  align="center"
                  className="bg-orange-100! text-white! font-bold!"
                >
                  Data Atualização
                </TableCell>
                <TableCell
                  align="center"
                  className="bg-orange-100! text-white! font-bold!"
                >
                  Data da Compra
                </TableCell>
                <TableCell
                  align="center"
                  className="bg-orange-100! text-white! font-bold! rounded-tr-2xl!"
                >
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {animals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <div className="flex flex-col items-center gap-2 py-12 text-[#1c274c]">
                      <InboxOutlinedIcon
                        sx={{ fontSize: 52, color: "#f08c10" }}
                      />
                      <p className="text-base font-semibold">
                        Nenhum animal cadastrado
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                animals.map((animal) => (
                  <TableRow hover key={animal.id}>
                    <TableCell
                      align="center"
                      className="flex! items-center! justify-center! h-24! cursor-pointer!"
                      onClick={() => {
                        if (animal.photoUrl.length === 0) return;
                        setPhotosToSee(animal.photoUrl);
                        setOpenModalSeeImage(true);
                      }}
                    >
                      <div className="w-20 h-20  flex items-center justify-center absolute ">
                        {animal.photoUrl.at(-1) ? (
                          <img
                            src={animal.photoUrl.at(-1)}
                            alt={animal.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded bg-slate-100 text-[10px] text-slate-400">
                            Sem foto
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="center">{animal.name}</TableCell>
                    <TableCell align="center">{animal.origin}</TableCell>
                    <TableCell align="center">
                      {formatDate(animal.updatedAt)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(animal.purchaseDate)}
                    </TableCell>
                    <TableCell align="center" className="flex gap-2">
                      <IconButton onClick={() => openEdit(animal)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => setOpenModalDelete(true)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {openModalSeeImage && (
        <ModalSeeImage
          open={openModalSeeImage}
          setOpen={setOpenModalSeeImage}
          images={photosToSee}
        />
      )}
      {formOpen && (
        <ModalCreateAndUpdate
          open
          mode={editingAnimal ? "update" : "create"}
          initialValues={
            editingAnimal
              ? {
                  name: editingAnimal.name,
                  sex: editingAnimal.sex,
                  purchaseDate: editingAnimal.purchaseDate,
                  weight: editingAnimal.weight,
                  age: editingAnimal.age,
                  calfAge: editingAnimal.calfAge,
                  heatDate: editingAnimal.heatDate,
                  origin: editingAnimal.origin,
                  observations: editingAnimal.observations,
                  photo: null,
                }
              : undefined
          }
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {openModalDelete && (
        <ModalConfirm
          open={openModalDelete}
          handleClose={() => setOpenModalDelete(false)}
          title="Excluir animal"
          message="Tem certeza que deseja excluir o animal?"
          onConfirm={() => handleDelete(editingAnimal?.id || "")}
        />
      )}
    </div>
  );
};
