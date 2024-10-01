// frontend/src/CaptureImage.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import QRCode from 'qrcode.react';

const CaptureImage = () => {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);
    const [qrCode, setQRCode] = useState('');

    // Function to capture image from webcam
    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setImage(imageSrc);
        } else {
            alert("Failed to capture image. Please check your camera settings.");
        }
    };

    // Convert data URI to Blob for upload
    const dataURItoBlob = (dataURI) => {
        if (!dataURI) throw new Error("dataURI is null");

        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    // Upload captured image to the server
    const uploadImage = async () => {
        if (!image) {
            alert("Please capture an image first!");
            return;
        }

        const formData = new FormData();
        const blob = dataURItoBlob(image);
        formData.append('image', blob);

        try {
            const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.qrCodeUrl) {
                setQRCode(response.data.qrCodeUrl);
            } else {
                alert("Failed to generate QR Code. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image. Please check the console for details.");
        }
    };

    return (
        <div>
            <h1>Capture Image and Generate QR Code</h1>
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
            <button onClick={capture}>Capture</button>
            {image && <img src={image} alt="Captured" style={{ marginTop: '10px', width: '300px' }} />}
            <button onClick={uploadImage} style={{ marginTop: '10px' }}>Upload</button>
            {qrCode && (
                <div style={{ marginTop: '20px' }}>
                    <h2>QR Code:</h2>
                    <QRCode value={qrCode} />
                    <a href={qrCode} download="qr_code.png">Download QR Code</a>
                </div>
            )}
        </div>
    );
};

export default CaptureImage;
