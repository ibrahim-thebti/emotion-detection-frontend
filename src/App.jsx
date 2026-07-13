import { useState, useRef } from 'react';

export default function App() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }

  function handleDropzoneClick() {
    fileInputRef.current.click();
  }

  function handleReset() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleScan() {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/detect-emotion`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="main">
      <h1>What does your face say?</h1>
      <p>Emotion detection is a web application that uses the Gemini API to analyze facial expressions and infer emotions. It can be used to improve user experience, enhance security, and provide insights into human behavior.</p>
      <p>© Ibrahim Thebti</p>
      <p className="social-links">
        <a href="https://www.linkedin.com/in/ibrahim-thebti" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
          <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 17.5V9.75H5.78V17.5H8.34ZM7.06 8.7A1.49 1.49 0 1 0 7.06 5.72 1.49 1.49 0 0 0 7.06 8.7ZM18.22 17.5V13.24C18.22 11.11 17.77 9.48 15.28 9.48C14.09 9.48 13.29 10.14 12.96 10.76H12.92V9.75H10.46V17.5H13.02V13.67C13.02 12.66 13.21 11.68 14.47 11.68C15.71 11.68 15.73 12.84 15.73 13.73V17.5H18.22Z" />
          </svg>
        </a>{' '}
        <a href="https://www.instagram.com/ibrhmthebty/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
          <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.75A4.25 4.25 0 1 1 7.75 12 4.25 4.25 0 0 1 12 7.75Zm0 2A2.25 2.25 0 1 0 14.25 12 2.25 2.25 0 0 0 12 9.75ZM17.5 6.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
          </svg>
        </a>{' '}
        <a href="https://www.facebook.com/ibrhymth/" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
          <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5v-6.5H10v-3h2.5V9.25c0-2.46 1.5-3.81 3.7-3.81.84 0 1.74.06 2.3.13v2.57h-1.52c-1.2 0-1.43.57-1.43 1.4V12.5h2.86l-.37 3h-2.49V21H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
          </svg>
        </a>
      </p>
      <label className="field-label">PHOTO</label>
      <div className="dropzone" onClick={handleDropzoneClick}>
        {!previewUrl ? (
          <div className="dropzone-empty">
            <div className="icon">◎</div>
            <div className="label">Click or drop an image</div>
            <div className="sub-label">JPG / PNG, one face works best</div>
          </div>
        ) : (
          <img className="preview" src={previewUrl} alt="preview" />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="actionBtns">
        <button id="scanBtn" onClick={handleScan} disabled={!selectedFile || loading}>
          {loading ? "Scanning..." : "Scan for emotion"}
        </button>
        <button id="resetBtn" onClick={handleReset}>Reset</button>
      </div>

      {error && <p className="error" id="errorBox">{error}</p>}

      {result && (
        <div className="result" id="result">
          <div className="result-label">Detected</div>
          <div className="result-emotion" id="resultEmotion">{result.emotion}</div>
          <div className="result-confidence" id="resultConfidence">
            {Math.round(result.confidence * 100)}% confidence
          </div>
        </div>
      )}
    </section>
  );
}