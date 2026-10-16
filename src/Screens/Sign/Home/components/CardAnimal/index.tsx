import EditIcon from "@mui/icons-material/Edit";
import { Card, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate, type HerdAnimal } from "../..";

interface ICardAnimalProps {
  animal: HerdAnimal;
  openEdit: (animal: HerdAnimal) => void;
  setOpenModalSeeImage(value: boolean): void;
  setPhotosToSee(photos: string[]): void;
  setOpenModalDelete(value: boolean): void;
}
export const CardAnimal = ({
  animal,
  openEdit,
  setOpenModalSeeImage,
  setPhotosToSee,
  setOpenModalDelete,
}: ICardAnimalProps) => {
  return (
    <Card className="flex! md:hidden! mt-4! p-4! flex-col gap-2">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold">{animal.name}</h1>

        <div className="flex gap-2">
          <IconButton onClick={() => openEdit(animal)}>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon onClick={() => setOpenModalDelete(true)} />
          </IconButton>
        </div>
      </div>
      <img
        src={animal.photoUrl.at(-1)}
        alt={animal.name}
        className="w-full h-full object-cover"
        onClick={() => {
          if (animal.photoUrl.length === 0) return;
          setPhotosToSee(animal.photoUrl);
          setOpenModalSeeImage(true);
        }}
      />

      <div className="flex items-center justify-between">
        <p>Procedência:</p>
        <p>{animal.origin}</p>
      </div>
      <div className="flex items-center justify-between">
        <p>Data da compra:</p>
        <p>{formatDate(animal.purchaseDate)}</p>
      </div>
      <div className="flex items-center justify-between">
        <p>Data da atualização:</p>
        <p>{formatDate(animal.updatedAt)}</p>
      </div>
    </Card>
  );
};
