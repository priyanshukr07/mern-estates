import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListingEditor from '../components/ListingEditor';
import { uploadImage } from '../utils/upload';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      Promise.all(Array.from(files).map((file) => uploadImage(file)))
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
          setFiles([]);
        })
        .catch(() => {
          setImageUploadError('Image upload failed. Please try again with up to 6 clear images.');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload up to 6 images per listing.');
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData((prev) => ({
        ...prev,
        type: e.target.id,
      }));
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.checked,
      }));
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.id === 'description') {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError('Upload at least one image before publishing.');
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError('Offer price must be lower than the regular price.');
      }

      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  return (
    <ListingEditor
      mode='create'
      formData={formData}
      files={files}
      setFiles={setFiles}
      imageUploadError={imageUploadError}
      uploading={uploading}
      loading={loading}
      error={error}
      onChange={handleChange}
      onImageSubmit={handleImageSubmit}
      onRemoveImage={handleRemoveImage}
      onSubmit={handleSubmit}
    />
  );
}
