import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

interface IModalConfirmProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  handleClose: () => void;
}
export const ModalConfirm = ({
  open,
  title,
  message,
  onConfirm,
  handleClose,
}: IModalConfirmProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
    >
      <div className="p-4">
        <div className="flex justify-center">
          <ReportProblemIcon className="text-[7rem]! text-red-600!" />
        </div>
        <DialogTitle
          className="text-center text-red-400! text-2xl font-bold"
          id="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="text-sm! text-red-400! text-center! font-semibold"
          >
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="flex items-center gap-2">
          <Button
            variant="outlined"
            className="border-red-600! text-red-600!"
            onClick={handleClose}
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            className="bg-red-600! text-white!"
            onClick={onConfirm}
            fullWidth
          >
            Confirmar
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};
