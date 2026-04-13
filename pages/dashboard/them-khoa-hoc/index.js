import React, { useReducer, useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '../../../components/univisport/Editor';
import { debounce } from 'lodash';

// Vietnamese to ASCII for slug generation
const vietnameseToAscii = (str) => {
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
    'Đ': 'D',
  };
  return str.replace(/./g, (char) => vietnameseMap[char] || char);
};

// Generate slug from title
const generateSlug = (title) =>
  vietnameseToAscii(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim();

// Transform Cloudinary URL to relative path
const toRelativePath = (url) => {
  if (!url) return '';
  
  // If it's already a relative path, return as is
  if (url.startsWith('/') && !url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // If it's not a Cloudinary URL, return as is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    
    // Find the upload folder and extract the path after it
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && pathParts.length > uploadIndex + 1) {
      // Skip version number if present (v1234567890)
      const versionIndex = uploadIndex + 1;
      const isVersion = pathParts[versionIndex] && pathParts[versionIndex].startsWith('v') && !isNaN(pathParts[versionIndex].slice(1));
      const startIndex = isVersion ? versionIndex + 1 : versionIndex;
      
      if (pathParts.length > startIndex) {
        return `/${pathParts.slice(startIndex).join('/')}`;
      }
    }
    
    // Fallback: return the last part of the path
    return `/${pathParts[pathParts.length - 1]}`;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return url;
  }
};

// Transform relative path to full Cloudinary URL
const toCloudinaryUrl = (relativePath) => {
  if (!relativePath) return '';
  
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  
  // If it's already a Cloudinary URL, return as is
  if (relativePath.includes('res.cloudinary.com')) {
    return relativePath;
  }
  
  // Convert relative path to full Cloudinary URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME || 'ds3hfu1uz';
  const folder = process.env.CLOUDINARY_FOLDER || 'btacademy';
  
  // Clean the path
  let cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  // If the path already contains the folder, don't add it again
  if (cleanPath.startsWith(`${folder}/`)) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
  }
  
  // Add the folder if it's not already there
  return `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${cleanPath}`;
};

// Initial state
const initialState = {
  maKhoaHoc: '',
  title: '',
  subtitle: '',
  image: '',
  slug: '',
  content: '',
  description: '',
  sessions: 1,
  level: 'Cơ bản',
  rating: 0,
  reviews: 0,
  students: 0,
  schedule: '',
  locations: [],
  curriculum: [],
  features: [],
  requirements: [],
  faq: [],
  isNew: false,
  isFeatured: false,
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_PRODUCT':
      return { ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Levels
const levels = ['Cơ bản', 'Nâng cao', 'Chuyên nghiệp', 'Tất cả cấp độ'];

export default function CreateCoursePage() {
  const router = useRouter();
  const { _id } = router.query;
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [cloudinaryImages, setCloudinaryImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [originalSlug, setOriginalSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCourseMaKhoaHoc, setNewCourseMaKhoaHoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Add error helper
  const addError = (message) => {
    setErrors((prev) => (prev.includes(message) ? prev : [...prev, message]));
    toast.error(message, { position: 'top-right', autoClose: 3000 });
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      if (image?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  // Fetch course for editing
  const fetchCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/courses?_id=${_id}`);
      const course = response.data.course || {};

      dispatch({
        type: 'SET_PRODUCT',
        payload: {
          maKhoaHoc: course.maKhoaHoc || '',
          title: course.title || '',
          subtitle: course.subtitle || '',
          image: course.image || '',
          slug: course.slug || '',
          content: course.content || '',
          description: course.description || '',
          locations: course.locations || [],
          sessions: course.sessions || 1,
          level: course.level || 'Cơ bản',
          rating: course.rating || 0,
          reviews: course.reviews || 0,
          students: course.students || 0,
          schedule: course.schedule || '',
          curriculum: course.curriculum || [],
          features: course.features || [],
          requirements: course.requirements || [],
          faq: course.faq || [],
          isNew: course.isNew || false,
          isFeatured: course.isFeatured || false,
        },
      });

      if (course.image) {
        const imageUrl = toCloudinaryUrl(course.image);
        setImage({ src: course.image, preview: imageUrl });
      }
      setIsSlugEdited(true);
      setOriginalSlug(course.slug || '');
    } catch (err) {
      console.error('Error fetching course:', err);
      addError('Không thể tải khóa học');
    } finally {
      setIsLoading(false);
    }
  }, [_id]);

  // Fetch Cloudinary images
  const fetchCloudinaryImages = useCallback(async () => {
    try {
      const res = await axios.get('/api/image');
      setCloudinaryImages(res.data.images.map((img) => img.src));
    } catch (err) {
      addError('Không thể tải danh sách ảnh');
    }
  }, []);

  useEffect(() => {
    if (_id) fetchCourse();
    fetchCloudinaryImages();
  }, [_id, fetchCourse, fetchCloudinaryImages]);

  // Handle title change
  const handleTitleChange = (e) => {
    const title = e.target.value;
    dispatch({ type: 'UPDATE_FIELD', field: 'title', value: title });
    if (!isSlugEdited) {
      dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: generateSlug(title) });
    }
  };

  // Handle slug change
  const handleSlugChange = (e) => {
    setIsSlugEdited(true);
    dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: e.target.value.trim().toLowerCase() });
  };

  // Handle maKhoaHoc change
  const handleMaKhoaHocChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'maKhoaHoc', value: e.target.value });
  };

  // FAQ Management Functions
  const addFAQ = () => {
    const newFAQ = { question: '', answer: '' };
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'faq',
      value: [...formData.faq, newFAQ],
    });
  };

  const removeFAQ = (index) => {
    const updatedFAQ = formData.faq.filter((_, i) => i !== index);
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'faq',
      value: updatedFAQ,
    });
  };

  const updateFAQ = (index, field, value) => {
    const updatedFAQ = formData.faq.map((faqItem, i) => 
      i === index ? { ...faqItem, [field]: value } : faqItem
    );
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'faq',
      value: updatedFAQ,
    });
  };

  const addSampleFAQ = () => {
    const sampleFAQs = [
      {
        question: "Khóa học này có phù hợp với người mới bắt đầu không?",
        answer: "Có, khóa học được thiết kế phù hợp cho cả người mới bắt đầu và những người đã có kinh nghiệm. Chúng tôi sẽ hướng dẫn từ những kiến thức cơ bản nhất."
      },
      {
        question: "Tôi có được cấp chứng chỉ sau khi hoàn thành khóa học không?",
        answer: "Có, sau khi hoàn thành đầy đủ khóa học và đạt yêu cầu, bạn sẽ được cấp chứng chỉ hoàn thành có giá trị."
      },
      {
        question: "Nếu tôi bỏ lỡ một buổi học thì sao?",
        answer: "Bạn có thể liên hệ với giảng viên để được hỗ trợ bù học hoặc nhận tài liệu bài học. Chúng tôi khuyến khích tham gia đầy đủ để đạt hiệu quả tốt nhất."
      }
    ];

    dispatch({
      type: 'UPDATE_FIELD',
      field: 'faq',
      value: [...formData.faq, ...sampleFAQs],
    });
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    dispatch({ type: 'UPDATE_FIELD', field: 'description', value: value });
  };

  // Handle content change
  const handleContentChange = (content) => {
    const sanitizedContent = typeof content === 'string' ? content : '';
    dispatch({ type: 'UPDATE_FIELD', field: 'content', value: sanitizedContent });
  };


  // Handle image drop and upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        addError('Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 5MB');
        return;
      }
      setErrors((prev) => prev.filter((err) => err !== 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 5MB'));

      const file = acceptedFiles[0];
      const newImage = {
        src: '',
        preview: URL.createObjectURL(file),
        file,
      };
      setImage(newImage);

      setUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);
        const response = await axios.post('/api/image', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const relativePath = toRelativePath(response.data.src);
        setImage({
          src: relativePath,
          preview: response.data.src,
          file: null,
        });
        dispatch({
          type: 'UPDATE_FIELD',
          field: 'image',
          value: relativePath,
        });
      } catch (error) {
        console.error('Error uploading image:', error.response?.data || error.message);
        addError('Không thể upload ảnh');
        setImage(null);
        dispatch({ type: 'UPDATE_FIELD', field: 'image', value: '' });
      } finally {
        setUploading(false);
      }
    },
  });

  // Handle Cloudinary image selection
  const handleSelectImage = (src) => {
    const relativePath = toRelativePath(src);
    setImage({ src: relativePath, preview: src });
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'image',
      value: relativePath,
    });
    setIsModalOpen(false);
  };

  // Check slug availability
  const checkSlug = async (slug, courseId = null) => {
    try {
      const normalizedSlug = slug.trim().toLowerCase();
      const response = await axios.post('/api/courses', { action: 'checkSlug', slug: normalizedSlug, _id: courseId });
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error checking slug:', error.response?.data || error.message);
      return false;
    }
  };

  // Debounce slug check
  const debouncedCheckSlug = useCallback(
    debounce(async (slug, courseId) => {
      const isValid = await checkSlug(slug, courseId);
      if (!isValid) {
        addError('Slug đã tồn tại, vui lòng chọn slug khác');
      } else {
        setErrors((prev) => prev.filter((err) => err !== 'Slug đã tồn tại, vui lòng chọn slug khác'));
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.slug && (!_id || formData.slug !== originalSlug)) {
      debouncedCheckSlug(formData.slug, _id);
    }
  }, [formData.slug, _id, originalSlug, debouncedCheckSlug]);

  // Reset form
  const resetForm = () => {
    dispatch({ type: 'RESET' });
    if (image?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    setIsSlugEdited(false);
    setOriginalSlug('');
    setErrors([]);
    setNewCourseMaKhoaHoc(null);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    if (image?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'image',
      value: '',
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      // Client-side validation
      if (!formData.title) {
        addError('Tên khóa học là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.maKhoaHoc) {
        addError('Mã khóa học là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!/^[A-Za-z0-9_-]+$/.test(formData.maKhoaHoc)) {
        addError('Mã khóa học chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang');
        setIsSubmitting(false);
        return;
      }
      if (!formData.slug) {
        addError('Slug là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.description) {
        addError('Mô tả là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (formData.description.length < 160) {
        addError('Mô tả phải có ít nhất 160 ký tự cho chuẩn SEO');
        setIsSubmitting(false);
        return;
      }
      if (formData.description.length > 300) {
        addError('Mô tả không được vượt quá 300 ký tự cho chuẩn SEO');
        setIsSubmitting(false);
        return;
      }
      if (!formData.schedule) {
        addError('Lịch học là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.locations || formData.locations.length === 0) {
        addError('Vui lòng chọn ít nhất một địa điểm');
        setIsSubmitting(false);
        return;
      }
      if (!formData.image) {
        addError('Vui lòng tải lên ảnh khóa học');
        setIsSubmitting(false);
        return;
      }
      if (!formData.sessions || formData.sessions < 1) {
        addError('Số buổi học là bắt buộc và phải lớn hơn 0');
        setIsSubmitting(false);
        return;
      }
      if (formData.rating < 0 || formData.rating > 5) {
        addError('Đánh giá phải từ 0 đến 5');
        setIsSubmitting(false);
        return;
      }
      if (formData.reviews < 0) {
        addError('Số lượng đánh giá không được âm');
        setIsSubmitting(false);
        return;
      }
      if (formData.students < 0) {
        addError('Số học viên không được âm');
        setIsSubmitting(false);
        return;
      }

      // Validate FAQ
      if (formData.faq && formData.faq.length > 0) {
        for (let i = 0; i < formData.faq.length; i++) {
          const faqItem = formData.faq[i];
          if (!faqItem.question.trim()) {
            addError(`Câu hỏi FAQ #${i + 1} không được để trống`);
            setIsSubmitting(false);
            return;
          }
          if (!faqItem.answer.trim()) {
            addError(`Câu trả lời FAQ #${i + 1} không được để trống`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Ensure image is uploaded
      if (image?.file) {
        addError('Vui lòng chờ ảnh được tải lên');
        setIsSubmitting(false);
        return;
      }

      // Construct course data
      const courseData = {
        maKhoaHoc: formData.maKhoaHoc,
        title: formData.title,
        subtitle: formData.subtitle,
        image: formData.image,
        slug: formData.slug.trim().toLowerCase(),
        content: formData.content,
        description: formData.description,
        sessions: formData.sessions,
        level: formData.level,
        rating: Number(formData.rating),
        reviews: formData.reviews,
        students: formData.students,
        schedule: formData.schedule,
        locations: formData.locations,
        curriculum: formData.curriculum,
        features: formData.features,
        requirements: formData.requirements,
        faq: formData.faq,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
      };

      // Validate slug
      let isSlugValid = true;
      if (!_id || formData.slug !== originalSlug) {
        isSlugValid = await checkSlug(formData.slug, _id);
        if (!isSlugValid) {
          addError('Slug đã tồn tại, vui lòng chọn slug khác');
          setIsSubmitting(false);
          return;
        }
      }

      // Submit to backend
      if (_id) {
        await axios.put(`/api/courses?_id=${_id}`, courseData);
        setErrors([]);
        toast.success('Khóa học đã được cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        router.push('/dashboard/khoa-hoc');
      } else {
        const response = await axios.post('/api/courses', courseData);
        if (response.data.status === 'success') {
          setNewCourseMaKhoaHoc(formData.maKhoaHoc);
          setErrors([]);
          toast.success(`Khóa học đã được thêm thành công! Mã khóa học: ${formData.maKhoaHoc}`, {
            position: 'top-right',
            autoClose: 3000,
          });
          resetForm();
        } else {
          throw new Error(response.data.err || 'Không thể tạo khóa học');
        }
      }
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.err || 'Không thể lưu khóa học';
      addError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title={_id ? 'Sửa khóa học' : 'Thêm khóa học'}>
      <div className="product-form-container">
        <div className="product-form-header">
          <h2 className='uppercase'>{_id ? 'Sửa khóa học' : 'Thêm khóa học mới'}</h2>
          <p>Quản lý thông tin khóa học của bạn một cách dễ dàng</p>
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, idx) => (
              <div key={idx} className="error-message" id={`error-${idx}`}>
                {error}
              </div>
            ))}
          </div>
        )}

        {newCourseMaKhoaHoc && !_id && (
          <div className="success-message">
            Khóa học đã được tạo với mã khóa học: <strong>{newCourseMaKhoaHoc}</strong>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-black dark:text-white">
            <div className="loading-spinner"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="product-form">
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">📝 Thông tin cơ bản</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                <div className="form-group md:col-span-3">
                  <label className="form-label required" htmlFor="maKhoaHoc">
                    Mã khóa học
                  </label>
                  <input
                    id="maKhoaHoc"
                    type="text"
                    value={formData.maKhoaHoc}
                    onChange={handleMaKhoaHocChange}
                    className={`form-input ${errors.some((e) => e.includes('Mã khóa học')) ? 'error' : ''}`}
                    required
                    placeholder="Ví dụ: MC001"
                    aria-label="Mã khóa học"
                    aria-describedby={errors.some((e) => e.includes('Mã khóa học')) ? 'error-maKhoaHoc' : undefined}
                  />
                </div>

                <div className="form-group md:col-span-7">
                  <label className="form-label required" htmlFor="title">
                    Tên khóa học
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className={`form-input ${errors.some((e) => e.includes('Tên khóa học')) ? 'error' : ''}`}
                    required
                    placeholder="Nhập tên khóa học"
                    aria-label="Tên khóa học"
                    aria-describedby={errors.some((e) => e.includes('Tên khóa học')) ? 'error-title' : undefined}
                  />
                </div>
              </div>


              <div className="form-group">
                <label className="form-label required" htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className={`form-input ${errors.some((e) => e.includes('Slug')) ? 'error' : ''}`}
                  required
                  placeholder="slug-khoa-hoc"
                  aria-label="Slug khóa học"
                  aria-describedby={errors.some((e) => e.includes('Slug')) ? 'error-slug' : undefined}
                />
              </div>

              <div className="form-group">
                <label className="form-label required" htmlFor="description">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  className={`form-input form-textarea ${errors.some((e) => e.includes('Mô tả')) ? 'error' : ''}`}
                  rows={4}
                  placeholder="Nhập mô tả khóa học (160-300 ký tự cho chuẩn SEO)"
                  required
                  aria-label="Mô tả khóa học"
                  aria-describedby={errors.some((e) => e.includes('Mô tả')) ? 'error-description' : undefined}
                />
                <div className="mt-2 text-sm">
                  <span className={`${formData.description.length < 160 ? 'text-red-500' : formData.description.length > 300 ? 'text-red-500' : 'text-green-600'}`}>
                    {formData.description.length}/300 ký tự
                  </span>
                  <span className="ml-2 text-gray-500">
                    (Tối thiểu 160 ký tự cho SEO)
                  </span>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="form-section">
              <h3 className="form-section-title">🖼️ Hình ảnh khóa học</h3>
              
              <div className="image-upload-section">
                <div
                  {...getRootProps()}
                  className={`${isDragActive ? 'drag-active' : ''}`}
                  role="button"
                  aria-label="Tải lên hoặc thả hình ảnh"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      document.querySelector('input[type="file"]').click();
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <div className="upload-icon">📸</div>
                  <p className="upload-text">
                    Thả tập tin vào đây hoặc nhấp để tải lên
                  </p>
                  <p className="upload-hint">
                    (Chỉ hỗ trợ JPEG, JPG, PNG, WEBP dưới 5MB - Chỉ 1 ảnh duy nhất)
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="select-existing-btn"
                >
                  🖼️ Chọn ảnh đã upload
                </button>
              </div>

              {uploading && (
                <div className="uploading-indicator">
                  <div className="loading-spinner"></div>
                  <span>Đang tải ảnh...</span>
                </div>
              )}

              {image && (
                <div className="image-preview-single">
                  <div className="image-preview-item">
                    <img
                      src={image.preview}
                      alt="Ảnh khóa học"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="remove-image-btn"
                      aria-label="Xóa ảnh"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Course Details Section */}
            <div className="form-section">
              <h3 className="form-section-title">⚙️ Chi tiết khóa học</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label required" htmlFor="level">
                    Cấp độ
                  </label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'level', value: e.target.value })}
                    className={`form-input form-select ${errors.some((e) => e.includes('Cấp độ')) ? 'error' : ''}`}
                    required
                    aria-label="Cấp độ khóa học"
                    aria-describedby={errors.some((e) => e.includes('Cấp độ')) ? 'error-level' : undefined}
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    Địa điểm
                  </label>
                  <div className="space-y-2">
                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        id="location-cs1"
                        checked={formData.locations.includes('CS1 - Hà Nội')}
                        onChange={(e) => {
                          const newLocations = e.target.checked
                            ? [...formData.locations, 'CS1 - Hà Nội']
                            : formData.locations.filter(loc => loc !== 'CS1 - Hà Nội');
                          dispatch({ type: 'UPDATE_FIELD', field: 'locations', value: newLocations });
                        }}
                        aria-label="Cơ sở Hà Nội"
                      />
                      <label htmlFor="location-cs1">
                        <strong>CS1 - Hà Nội</strong><br />
                        <span className="text-sm text-gray-600">19 Nguyễn Gia Thiều, Hoàn Kiếm</span>
                      </label>
                    </div>
                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        id="location-cs2"
                        checked={formData.locations.includes('CS2 - Thái Nguyên')}
                        onChange={(e) => {
                          const newLocations = e.target.checked
                            ? [...formData.locations, 'CS2 - Thái Nguyên']
                            : formData.locations.filter(loc => loc !== 'CS2 - Thái Nguyên');
                          dispatch({ type: 'UPDATE_FIELD', field: 'locations', value: newLocations });
                        }}
                        aria-label="Cơ sở Thái Nguyên"
                      />
                      <label htmlFor="location-cs2">
                        <strong>CS2 - Thái Nguyên</strong><br />
                        <span className="text-sm text-gray-600">Tòa nhà Viettel, Số 4 Hoàng Văn Thụ</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="form-group">
                  <label className="form-label required" htmlFor="sessions">
                    Số buổi học
                  </label>
                  <input
                    id="sessions"
                    type="number"
                    value={formData.sessions}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'sessions', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Số buổi')) ? 'error' : ''}`}
                    min="1"
                    required
                    placeholder="10"
                    aria-label="Số buổi học"
                    aria-describedby={errors.some((e) => e.includes('Số buổi')) ? 'error-sessions' : undefined}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rating">
                    Đánh giá (0-5)
                  </label>
                  <input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'rating', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Đánh giá')) ? 'error' : ''}`}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0"
                    aria-label="Đánh giá"
                    aria-describedby={errors.some((e) => e.includes('Đánh giá')) ? 'error-rating' : undefined}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reviews">
                    Số lượng đánh giá
                  </label>
                  <input
                    id="reviews"
                    type="number"
                    value={formData.reviews}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'reviews', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Số lượng đánh giá')) ? 'error' : ''}`}
                    min="0"
                    placeholder="0"
                    aria-label="Số lượng đánh giá"
                    aria-describedby={errors.some((e) => e.includes('Số lượng đánh giá')) ? 'error-reviews' : undefined}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="students">
                    Số học viên
                  </label>
                  <input
                    id="students"
                    type="number"
                    value={formData.students}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'students', value: Number(e.target.value) })}
                    className={`form-input ${errors.some((e) => e.includes('Số học viên')) ? 'error' : ''}`}
                    min="0"
                    placeholder="0"
                    aria-label="Số học viên"
                    aria-describedby={errors.some((e) => e.includes('Số học viên')) ? 'error-students' : undefined}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label className="form-label required" htmlFor="schedule">
                    Lịch học
                  </label>
                  <input
                    id="schedule"
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'schedule', value: e.target.value })}
                    className={`form-input ${errors.some((e) => e.includes('Lịch học')) ? 'error' : ''}`}
                    required
                    placeholder="Ví dụ: Thứ 7 - 14:00-16:00"
                    aria-label="Lịch học"
                    aria-describedby={errors.some((e) => e.includes('Lịch học')) ? 'error-schedule' : undefined}
                  />
                </div>
              </div>
            </div>

            {/* Course Options Section */}
            <div className="form-section">
              <h3 className="form-section-title">🔧 Tùy chọn khóa học</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'isNew', value: e.target.checked })}
                    aria-label="Khóa học mới"
                  />
                  <label htmlFor="isNew">Khóa học mới</label>
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'isFeatured', value: e.target.checked })}
                    aria-label="Khóa học nổi bật"
                  />
                  <label htmlFor="isFeatured">Khóa học nổi bật</label>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="form-section">
              <h3 className="form-section-title">📄 Nội dung chi tiết</h3>
              <Editor
                content={formData.content || ''}
                onChange={handleContentChange}
              />
            </div>

            {/* FAQ Section */}
            <div className="form-section">
              <div className="flex justify-between items-center mb-4">
                <h2 className="form-section-title mb-0">❓ Câu hỏi thường gặp (FAQ)</h2>
                {formData.faq.length === 0 && (
                  <button
                    type="button"
                    onClick={addSampleFAQ}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    📝 Thêm FAQ mẫu
                  </button>
                )}
              </div>
              
              {formData.faq.map((faqItem, index) => (
                <div key={index} className="faq-item border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      FAQ #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      aria-label={`Xóa FAQ ${index + 1}`}
                    >
                      ✕ Xóa
                    </button>
                  </div>
                  
                  <div className="grid gap-3">
                    <div className="form-group">
                      <label className="form-label required">
                        Câu hỏi
                      </label>
                      <input
                        type="text"
                        value={faqItem.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        className="form-input"
                        placeholder="Nhập câu hỏi"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label required">
                        Câu trả lời
                      </label>
                      <textarea
                        value={faqItem.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        className="form-input form-textarea"
                        rows={3}
                        placeholder="Nhập câu trả lời"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addFAQ}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                ➕ Thêm câu hỏi thường gặp
              </button>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.push('/dashboard/khoa-hoc')}
                className="btn btn-secondary"
                aria-label="Hủy"
              >
                ❌ Hủy
              </button>
              <button
                type="submit"
                disabled={uploading || isSubmitting}
                className={`btn btn-primary ${uploading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={_id ? 'Cập nhật khóa học' : 'Thêm khóa học'}
              >
                {uploading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Đang upload...
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Đang xử lý...
                  </>
                ) : _id ? (
                  '✅ Cập nhật'
                ) : (
                  '➕ Thêm khóa học'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Image Selection Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="Chọn ảnh">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" tabIndex={-1} ref={(el) => el?.focus()}>
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">Chọn ảnh đã tải lên</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {cloudinaryImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Cloudinary image ${index + 1}`}
                    className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleSelectImage(src)}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  aria-label="Đóng"
                >
                  ❌ Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
      
      <style jsx>{`
        .faq-item {
          transition: all 0.2s ease-in-out;
        }
        .faq-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .form-section {
          margin-bottom: 2rem;
        }
        .form-section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #374151;
        }
        .dark .form-section-title {
          color: #f3f4f6;
        }
        .image-preview-single {
          margin-top: 1rem;
        }
        .image-preview-item {
          position: relative;
          display: inline-block;
          max-width: 200px;
        }
        .remove-image-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
        }
        .remove-image-btn:hover {
          background: #dc2626;
        }
      `}</style>
    </AdminLayout>
  );
}
