import "./App.css";
import { useState } from "react";
import ImageCropDialog from "./ImageCropDialog";
import { imageUpload } from "./utils/cloudinaryUpload";

const initData = [
  {
    id: 1,
    imageUrl: "images/car1.png",
    croppedImageUrl: null,
  },
  {
    id: 2,
    imageUrl: "images/car2.png",
    croppedImageUrl: null,
  },
  {
    id: 3,
    imageUrl: "images/car3.png",
    croppedImageUrl: null,
  },
  {
    id: 4,
    imageUrl: "images/car4.png",
    croppedImageUrl: null,
  },
];

function App() {
  const [cars, setCars] = useState(initData);
  const [selectedCar, setSelectedCar] = useState(null);

  const onCancel = () => {
    setSelectedCar(null);
  };
  const blobTofile = (theBlob, fileName) => {
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
  }
  const setCroppedImageFor = async (id, crop, zoom, aspect, croppedImageUrl) => {
    const _newCars = cars.map(val => val.id === id ? { ...val, crop, zoom, aspect, croppedImageUrl } : val)
    console.log(croppedImageUrl)
    let blob = await fetch(croppedImageUrl).then(r => r.blob());
    const f = new File([blob], "name", { type: blob.type });
    console.log("blobl==>", f)
    const Images = await imageUpload([f])
    console.log(Images)
    setCars(_newCars)
    setSelectedCar(null)
  };

  const resetImage = (id) => {
    setCroppedImageFor(id);
  };

  return (
    <div>
      <input type='file' onChange={async (e) => {
        console.log(e.target.files[0])
        // const images = await imageUpload([e.target.files[0]])
        // console.log(images)
      }}
      />
      {selectedCar ? (
        <ImageCropDialog
          id={selectedCar.id}
          imageUrl={selectedCar.imageUrl}
          cropInit={selectedCar.crop}
          zoomInit={selectedCar.zoom}
          aspectInit={selectedCar.aspect}
          onCancel={onCancel}
          setCroppedImageFor={setCroppedImageFor}
          resetImage={resetImage}
        />
      ) : null}
      {cars.map((car) => (
        <div className="imageCard" key={car.id}>
          <img
            src={car.croppedImageUrl ? car.croppedImageUrl : car.imageUrl}
            alt=""
            onClick={() => {
              console.log(car);
              setSelectedCar(car);
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
