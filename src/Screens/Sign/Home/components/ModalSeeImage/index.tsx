import { Box, Dialog } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface IModalSeeImageProps {
  open: boolean;
  setOpen(open: boolean): void;
  images: string[];
}

export const ModalSeeImage = ({
  open,
  setOpen,
  images,
}: IModalSeeImageProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: "min(960px, calc(100vw - 32px))",
            height: "min(720px, calc(100vh - 32px))",
            maxWidth: "none",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: "#111",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          "& .carousel-root, & .carousel, & .slider-wrapper, & .slider, & .slide, & .slide > div":
            {
              height: "100% !important",
            },
          "& .slide img": {
            width: "100%",
            height: "100% !important",
            objectFit: "cover",
          },
        }}
      >
        <Carousel
          autoPlay
          infiniteLoop={images.length > 1}
          showThumbs={false}
          showStatus={false}
          showArrows={images.length > 1}
          showIndicators={images.length > 1}
        >
          {images.map((url, index) => (
            <div key={`${url}-${index}`}>
              <img
                src={url}
                alt={`Foto ${index + 1} do bovino`}
              />
            </div>
          ))}
        </Carousel>
      </Box>
    </Dialog>
  );
};
