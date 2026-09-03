import { useState, useRef } from 'react';
import './styles/FileUpload.css';

function FileUpload({ onFileSelect, accept = 'image/*', label = 'document' }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={`upload-zone ${isDragging ? 'is-dragging' : ''} ${preview ? 'has-file' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {preview ? (
        <div className="upload-zone__preview">
          <img src={preview} alt="preview" />
          <div className="upload-zone__preview-info">
            <p className="upload-zone__filename">{fileName}</p>
            <button type="button" className="upload-zone__remove" onClick={clearFile}>
              <span className="material-symbols-outlined">close</span> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-zone__empty">
          <span className="material-symbols-outlined upload-zone__icon">cloud_upload</span>
          <p className="upload-zone__title">Click to upload or drag and drop</p>
          <p className="upload-zone__hint">Upload your {label} — PNG, JPG up to 5MB</p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;