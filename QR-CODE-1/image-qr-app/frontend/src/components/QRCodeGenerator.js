import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ imageUrl }) => {
  return (
    <div>
      <h3>QR Code for Downloading Image:</h3>
      <QRCode value={imageUrl} size={128} />
    </div>
  );
};

export default QRCodeGenerator;
