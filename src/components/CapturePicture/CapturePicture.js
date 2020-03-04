import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "user"
};

const CapturePicture = props => {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    props.onCapture(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <Webcam
        audio={false}
        videoConstraints={videoConstraints}
        width={500}
        height={500}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Take Picture</button>
    </>
  );
};

export default CapturePicture;
