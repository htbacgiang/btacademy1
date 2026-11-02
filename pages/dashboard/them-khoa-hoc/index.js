import React, { useReducer, useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '../../../components/univisport/Editor';
import { debounce } from 'lodash';
import { locationOptions } from '../../../utils/locationMapping';
import R2ImageModal from '../../../components/editor/R2ImageModal';
import {
  FiZap,
  FiUploadCloud,
  FiImage,
  FiTrash2,
  FiExternalLink,
  FiRefreshCw,
  FiFolder,
} from 'react-icons/fi';

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
  const [showR2Modal, setShowR2Modal] = useState(false);
  const [r2InitialTab, setR2InitialTab] = useState('manage');
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [generatingFaqs, setGeneratingFaqs] = useState(false);
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
    if (showR2Modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showR2Modal]);

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
          sessions: course.sessions !== undefined && course.sessions !== null ? course.sessions : 1,
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

  useEffect(() => {
    if (_id) fetchCourse();
  }, [_id, fetchCourse]);

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


  // Direct upload to Cloudflare R2
  const uploadFileToR2 = async (file) => {
    setUploading(true);
    try {
      // 1. Try presigned PUT
      const { data: presignedData } = await axios.post('/api/r2/upload', {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        folder: 'courses',
      });

      try {
        await axios.put(presignedData.uploadUrl, file, {
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        });
        return { url: presignedData.publicUrl, key: presignedData.key };
      } catch (putErr) {
        // Fallback to proxy upload
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'courses');
        const { data: proxyData } = await axios.post('/api/r2/upload-proxy', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return { url: proxyData.publicUrl, key: proxyData.key };
      }
    } catch (err) {
      // Direct proxy fallback
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'courses');
      const { data: proxyData } = await axios.post('/api/r2/upload-proxy', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { url: proxyData.publicUrl, key: proxyData.key };
    } finally {
      setUploading(false);
    }
  };

  // Handle image drop and upload to Cloudflare R2
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        addError('Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 10MB');
        return;
      }
      setErrors((prev) => prev.filter((err) => !err.includes('JPEG')));

      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setImage({
        src: '',
        preview: previewUrl,
        file,
      });

      try {
        const result = await uploadFileToR2(file);
        setImage({
          src: result.url,
          preview: result.url,
          file: null,
        });
        dispatch({
          type: 'UPDATE_FIELD',
          field: 'image',
          value: result.url,
        });
        toast.success('Đã tải ảnh lên Cloudflare R2 thành công!');
      } catch (error) {
        console.error('Error uploading image to R2:', error);
        addError('Không thể tải ảnh lên R2');
        setImage(null);
        dispatch({ type: 'UPDATE_FIELD', field: 'image', value: '' });
      }
    },
  });

  // Handle R2 image selection from modal
  const handleR2Select = (result) => {
    if (result?.src) {
      setImage({
        src: result.src,
        preview: result.src,
        file: null,
      });
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'image',
        value: result.src,
      });
      setShowR2Modal(false);
      toast.success('Đã chọn ảnh từ Cloudflare R2!');
    }
  };

  const handleOpenR2 = (tab = 'manage') => {
    setR2InitialTab(tab);
    setShowR2Modal(true);
  };

  // AI Generation for Course Description
  const handleGenerateAiDescription = async () => {
    const cleanContent = formData.content ? formData.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    if (!formData.title?.trim() && cleanContent.length < 20) {
      toast.warning('Vui lòng nhập tên khóa học hoặc nội dung chi tiết trước khi tạo mô tả bằng Gemini AI!');
      return;
    }

    setGeneratingDesc(true);
    try {
      const combinedContent = [
        formData.subtitle,
        cleanContent,
        Array.isArray(formData.curriculum) && formData.curriculum.length > 0
          ? formData.curriculum.map((c) => `${c.title}: ${c.description}`).join('. ')
          : '',
      ].filter(Boolean).join('\n');

      const { data } = await axios.post('/api/ai/generate', {
        type: 'description',
        itemType: 'course',
        title: formData.title || '',
        content: combinedContent,
      });

      if (data?.description) {
        dispatch({ type: 'UPDATE_FIELD', field: 'description', value: data.description });
        toast.success('Đã tạo mô tả khóa học bằng Gemini AI thành công!');
      }
    } catch (err) {
      console.error('Lỗi tạo mô tả AI:', err);
      toast.error(err.response?.data?.error || 'Không thể tạo mô tả bằng Gemini AI. Vui lòng thử lại!');
    } finally {
      setGeneratingDesc(false);
    }
  };

  // AI Generation for Course FAQ
  const handleGenerateAiFaqs = async () => {
    const cleanContent = formData.content ? formData.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    if (!formData.title?.trim() && cleanContent.length < 20) {
      toast.warning('Vui lòng nhập tên khóa học hoặc nội dung chi tiết trước khi tạo FAQ bằng Gemini AI!');
      return;
    }

    setGeneratingFaqs(true);
    try {
      const combinedContent = [
        formData.subtitle,
        formData.description,
        cleanContent,
        Array.isArray(formData.curriculum) && formData.curriculum.length > 0
          ? formData.curriculum.map((c) => `${c.title}: ${c.description}`).join('. ')
          : '',
      ].filter(Boolean).join('\n');

      const { data } = await axios.post('/api/ai/generate', {
        type: 'faqs',
        itemType: 'course',
        title: formData.title || '',
        content: combinedContent,
      });

      if (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
        if (formData.faq && formData.faq.length > 0) {
          dispatch({ type: 'UPDATE_FIELD', field: 'faq', value: [...formData.faq, ...data.faqs] });
        } else {
          dispatch({ type: 'UPDATE_FIELD', field: 'faq', value: data.faqs });
        }
        toast.success(`Đã tạo ${data.faqs.length} câu hỏi thường gặp bằng Gemini AI thành công!`);
      }
    } catch (err) {
      console.error('Lỗi tạo FAQ bằng AI:', err);
      toast.error(err.response?.data?.error || 'Không thể tạo FAQ bằng Gemini AI. Vui lòng thử lại!');
    } finally {
      setGeneratingFaqs(false);
    }
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
      const isCustomSessions = formData.sessions === 'Tùy nhu cầu';
      if (!isCustomSessions && (!formData.sessions || Number(formData.sessions) < 1)) {
        addError('Số buổi học là bắt buộc (nhập số buổi hoặc chọn "Tùy nhu cầu")');
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
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="form-label required mb-0" htmlFor="description">
                    Mô tả khóa học (Chuẩn SEO)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={generatingDesc}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-lg transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                    title="Dùng Gemini AI tự động tạo mô tả khóa học chuẩn SEO"
                  >
                    <FiZap
                      size={13}
                      className={generatingDesc ? 'animate-spin text-purple-600' : 'text-purple-600'}
                    />
                    <span>{generatingDesc ? 'Đang viết mô tả...' : '✨ Tạo với Gemini AI'}</span>
                  </button>
                </div>
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
                <div className="mt-2 text-sm flex items-center justify-between">
                  <span className={`${formData.description.length < 160 ? 'text-red-500' : formData.description.length > 300 ? 'text-red-500' : 'text-green-600'}`}>
                    {formData.description.length}/300 ký tự
                  </span>
                  <span className="text-gray-500 text-xs">
                    (Tối thiểu 160 ký tự cho SEO)
                  </span>
                </div>
              </div>
            </div>

            {/* Image Upload Section - Cloudflare R2 (Gọn gàng) */}
            <div className="form-section">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="form-section-title !mb-0 text-base">Hình ảnh khóa học</h3>
                  <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#105d97] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded">
                    <FiFolder size={11} /> courses
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenR2('manage')}
                    className="text-xs px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#105d97] dark:bg-sky-950/60 dark:text-sky-300 rounded-lg font-semibold flex items-center gap-1 transition-colors border border-sky-200 dark:border-sky-800 shadow-2xs cursor-pointer"
                    title="Chọn ảnh khóa học có sẵn từ kho Cloudflare R2"
                  >
                    <FiImage size={13} />
                    <span>Chọn từ R2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenR2('upload')}
                    className="text-xs px-2.5 py-1 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="Tải ảnh mới lên thư mục courses trên Cloudflare R2"
                  >
                    <FiUploadCloud size={13} />
                    <span>Tải ảnh lên R2</span>
                  </button>
                </div>
              </div>

              {formData.image ? (
                <div className="p-3 bg-gray-50/80 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-3.5 shadow-2xs">
                  {/* Thumbnail xem trước gọn gàng */}
                  <div className="relative w-full sm:w-44 h-28 shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center group shadow-xs">
                    <img
                      src={toCloudinaryUrl(formData.image)}
                      alt="Ảnh đại diện khóa học"
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>R2</span>
                    </div>
                  </div>

                  {/* Thông tin & nút thao tác */}
                  <div className="flex-1 min-w-0 w-full space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        Ảnh khóa học đã chọn
                      </span>
                      <a
                        href={toCloudinaryUrl(formData.image)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono text-[#105d97] dark:text-sky-400 hover:underline inline-flex items-center gap-1 max-w-[220px] truncate"
                        title={formData.image}
                      >
                        <span className="truncate">{formData.image.split('/').pop()}</span>
                        <FiExternalLink size={11} className="shrink-0" />
                      </a>
                    </div>

                    {/* Dải nút bấm gọn gàng */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenR2('manage')}
                        className="text-xs px-2.5 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <FiRefreshCw size={12} className="text-[#105d97]" />
                        <span>Đổi ảnh từ R2</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenR2('upload')}
                        className="text-xs px-2.5 py-1 bg-[#105d97] hover:bg-[#0c4a7c] text-white rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <FiUploadCloud size={12} />
                        <span>Tải ảnh mới</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xóa ảnh này"
                      >
                        <FiTrash2 size={13} />
                        <span>Xóa</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono truncate" title={formData.image}>
                      {formData.image}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all duration-200 ${isDragActive
                      ? 'border-[#105d97] bg-blue-50/70 dark:bg-gray-700/60 scale-[1.005]'
                      : 'border-gray-300 dark:border-gray-700 hover:border-[#105d97] bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/20'
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-[#105d97] dark:text-sky-300 flex items-center justify-center shrink-0 shadow-2xs">
                        <FiUploadCloud size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
                          Kéo thả ảnh vào đây hoặc bấm để chọn tệp
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                          Tự động lưu vào Cloudflare R2 / <span className="font-mono font-semibold text-[#105d97] dark:text-sky-400">courses</span> (JPEG, PNG, WEBP dưới 10MB)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenR2('manage');
                      }}
                      className="text-xs font-semibold px-2.5 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:border-[#105d97] hover:text-[#105d97] inline-flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                    >
                      <FiImage size={13} className="text-[#105d97]" />
                      <span>Chọn từ R2</span>
                    </button>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="uploading-indicator mt-2 flex items-center gap-2 text-xs text-[#105d97] font-medium">
                  <div className="loading-spinner !w-3 !h-3"></div>
                  <span>Đang tải ảnh lên Cloudflare R2...</span>
                </div>
              )}
            </div>

            {/* Course Details Section */}
            <div className="form-section">
              <h3 className="form-section-title">⚙️ Chi tiết khóa học</h3>

              {/* 1. ĐỊA ĐIỂM - SẮP XẾP THEO HÀNG NGANG GỌN GÀNG */}
              <div className="form-group mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label required mb-0">
                    Địa điểm học
                  </label>
                  <span className="text-xs text-gray-500">
                    Đã chọn {formData.locations.length} địa điểm
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {locationOptions.map((option, index) => {
                    const isChecked = formData.locations.includes(option.code);
                    return (
                      <label
                        key={option.code}
                        htmlFor={`location-${index}`}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all select-none ${isChecked
                          ? 'border-green-600 bg-green-50/70 dark:bg-green-950/40 text-green-950 dark:text-green-100 shadow-sm ring-1 ring-green-500'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        <input
                          type="checkbox"
                          id={`location-${index}`}
                          checked={isChecked}
                          onChange={(e) => {
                            const newLocations = e.target.checked
                              ? [...formData.locations, option.code]
                              : formData.locations.filter((loc) => loc !== option.code);
                            dispatch({ type: 'UPDATE_FIELD', field: 'locations', value: newLocations });
                          }}
                          className="mt-0.5 rounded text-green-600 focus:ring-green-500 w-4 h-4 shrink-0"
                          aria-label={option.label}
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <strong className="block font-semibold text-gray-900 dark:text-white leading-tight">
                            {option.code}
                          </strong>
                          <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                            {option.address}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.some((e) => e.includes('địa điểm')) && (
                  <p className="text-xs text-red-500 mt-1">Vui lòng chọn ít nhất một địa điểm</p>
                )}
              </div>

              {/* 2. CẤP ĐỘ, SỐ BUỔI HỌC, LỊCH HỌC */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Cấp độ */}
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

                {/* Số buổi học */}
                <div className="form-group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label required mb-0" htmlFor="sessions">
                      Số buổi học
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.sessions === 'Tùy nhu cầu') {
                          dispatch({ type: 'UPDATE_FIELD', field: 'sessions', value: 10 });
                        } else {
                          dispatch({ type: 'UPDATE_FIELD', field: 'sessions', value: 'Tùy nhu cầu' });
                        }
                      }}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium transition ${formData.sessions === 'Tùy nhu cầu'
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                    >
                      {formData.sessions === 'Tùy nhu cầu' ? '✓ Đang chọn: Tùy nhu cầu' : '+ Chọn: Tùy nhu cầu'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="sessions"
                      type={formData.sessions === 'Tùy nhu cầu' ? 'text' : 'number'}
                      value={formData.sessions}
                      readOnly={formData.sessions === 'Tùy nhu cầu'}
                      onChange={(e) => {
                        const val = e.target.value;
                        dispatch({
                          type: 'UPDATE_FIELD',
                          field: 'sessions',
                          value: val === 'Tùy nhu cầu' ? val : (isNaN(Number(val)) ? val : Number(val)),
                        });
                      }}
                      className={`form-input ${errors.some((e) => e.includes('Số buổi')) ? 'error' : ''} ${formData.sessions === 'Tùy nhu cầu' ? 'bg-green-50 font-semibold text-green-800' : ''
                        }`}
                      min="1"
                      required
                      placeholder="Ví dụ: 10 hoặc Tùy nhu cầu"
                      aria-label="Số buổi học"
                      aria-describedby={errors.some((e) => e.includes('Số buổi')) ? 'error-sessions' : undefined}
                    />
                    {formData.sessions === 'Tùy nhu cầu' && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'sessions', value: 10 })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:underline"
                      >
                        Đổi sang số
                      </button>
                    )}
                  </div>
                  {/* Preset chips for Số buổi học */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[8, 10, 12, 16].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'sessions', value: num })}
                        className={`text-[11px] px-2 py-0.5 rounded border transition ${formData.sessions === num
                          ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                      >
                        {num} buổi
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'sessions', value: 'Tùy nhu cầu' })}
                      className={`text-[11px] px-2 py-0.5 rounded border transition ${formData.sessions === 'Tùy nhu cầu'
                        ? 'bg-green-100 border-green-500 text-green-800 font-bold ring-1 ring-green-400'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                    >
                      Tùy nhu cầu
                    </button>
                  </div>
                </div>

                {/* Lịch học */}
                <div className="form-group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label required mb-0" htmlFor="schedule">
                      Lịch học
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.schedule === 'Thỏa thuận') {
                          dispatch({ type: 'UPDATE_FIELD', field: 'schedule', value: '' });
                        } else {
                          dispatch({ type: 'UPDATE_FIELD', field: 'schedule', value: 'Thỏa thuận' });
                        }
                      }}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium transition ${formData.schedule === 'Thỏa thuận'
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                    >
                      {formData.schedule === 'Thỏa thuận' ? '✓ Đang chọn: Thỏa thuận' : '+ Chọn: Thỏa thuận'}
                    </button>
                  </div>
                  <input
                    id="schedule"
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'schedule', value: e.target.value })}
                    className={`form-input ${errors.some((e) => e.includes('Lịch học')) ? 'error' : ''} ${formData.schedule === 'Thỏa thuận' ? 'bg-green-50 font-semibold text-green-800' : ''
                      }`}
                    required
                    placeholder="Ví dụ: Thứ 7 - 14:00-16:00 hoặc Thỏa thuận"
                    aria-label="Lịch học"
                    aria-describedby={errors.some((e) => e.includes('Lịch học')) ? 'error-schedule' : undefined}
                  />
                  {/* Preset chips for Lịch học */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'schedule', value: 'Thỏa thuận' })}
                      className={`text-[11px] px-2 py-0.5 rounded border transition ${formData.schedule === 'Thỏa thuận'
                        ? 'bg-green-100 border-green-500 text-green-800 font-bold ring-1 ring-green-400'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                    >
                      Thỏa thuận
                    </button>
                    {['Linh hoạt theo học viên', 'Thứ 7 & Chủ Nhật', 'Buổi tối (19h30 - 21h30)'].map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'schedule', value: sc })}
                        className={`text-[11px] px-2 py-0.5 rounded border transition ${formData.schedule === sc
                          ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                      >
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. SỐ HỌC VIÊN, ĐÁNH GIÁ, SỐ ĐÁNH GIÁ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                    placeholder="5.0"
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
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="form-section-title mb-0">❓ Câu hỏi thường gặp (FAQ)</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAiFaqs}
                    disabled={generatingFaqs}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-lg transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                    title="Dùng Gemini AI tự động phân tích khóa học và tạo các câu hỏi thường gặp FAQ"
                  >
                    <FiZap
                      size={13}
                      className={generatingFaqs ? 'animate-spin text-purple-600' : 'text-purple-600'}
                    />
                    <span>{generatingFaqs ? 'Đang tạo FAQ...' : '✨ Tạo FAQ tự động với Gemini AI'}</span>
                  </button>
                  {formData.faq.length === 0 && (
                    <button
                      type="button"
                      onClick={addSampleFAQ}
                      className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
                    >
                      📝 Thêm FAQ mẫu
                    </button>
                  )}
                </div>
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

        {/* Cloudflare R2 Image Modal */}
        <R2ImageModal
          visible={showR2Modal}
          onClose={() => setShowR2Modal(false)}
          onSelect={handleR2Select}
          initialFolder="courses"
          initialTab={r2InitialTab}
        />
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
