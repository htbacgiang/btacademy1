import { useState } from "react";
import Image from "next/image";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFacebookF,
  FaYoutube,

} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    area: "",
    budget: "",
    location: "",
    message: "",
    consultationDate: "",
    consultationTime: "",
    consultationType: "office"
  });


  const [errors, setErrors] = useState({});

  const contactInfo = {
    campuses: [
      {
        name: "CS1 - Hà Nội",
        address: "19 Nguyễn Gia Thiều, Hoàn Kiếm, Hà Nội"
      },
      {
        name: "CS2 - Thái Nguyên", 
        address: "Tòa nhà Viettel, Số 4 Hoàng Văn Thụ, Thái Nguyên"
      }
    ],
    phone: "0988 02 7494",
    email: "contact@btacademy.com.vn",
    workingHours: {
      weekdays: "Thứ 2 - Thứ 7: 8:00 - 20:00",
      weekend: "Chủ nhật: 9:00 - 20:00"
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, url: "https://facebook.com/btacademy", color: "bg-blue-600" },
    { name: "YouTube", icon: FaYoutube, url: "https://youtube.com/@btacademy", color: "bg-red-600" },
    { name: "Zalo", icon: SiZalo, url: "https://zalo.me/0988027494", color: "bg-blue-500" }
  ];


  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else {
      // Basic phone validation
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    // Validate email if provided
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    // Validate consultation date if provided
    if (formData.consultationDate) {
      const selectedDate = new Date(formData.consultationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.consultationDate = 'Ngày tư vấn phải là ngày trong tương lai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/consultation/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setErrors({});
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          projectType: "",
          area: "",
          budget: "",
          location: "",
          message: "",
          consultationDate: "",
          consultationTime: "",
          consultationType: "office"
        });
      } else {
        setSubmitStatus("error");
        console.error('API Error:', result.message);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error('Network Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto">
      {/* Tabs Navigation */}
      <div className="h-[70px]"></div>
      {/* Contact Information */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Thông tin liên hệ
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Địa chỉ cơ sở</h3>
                    {contactInfo.campuses.map((campus, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <p className="font-semibold text-gray-800">{campus.name}</p>
                        <p className="text-gray-700 leading-relaxed">{campus.address}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Hotline</h3>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-green-600 hover:text-green-700 font-medium text-lg transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Giờ làm việc</h3>
                    <p className="text-gray-700">{contactInfo.workingHours.weekdays}</p>
                    <p className="text-gray-700">{contactInfo.workingHours.weekend}</p>
                  </div>
                </div>
              </div>

        
            </div>

            {/* Map */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Vị trí các cơ sở</h3>
              
              {/* CS1 - Hà Nội Map */}
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-3">CS1 - Hà Nội</h4>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.309861592884!2d105.84330317559623!3d21.020284180626888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9a62f8ad67%3A0xc0d673a4940ea1d6!2zQlQgQWNhZGVteSAtIMSQw6BvIHThuqFvIGdp4buNbmcgbsOzaSB2w6AgdGjhuqduIHRow6FpIGRvYW5oIG5naGnhu4dw!5e0!3m2!1svi!2s!4v1757508252499!5m2!1svi!2s" 
                    width="100%" 
                    height="200" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              
              {/* CS2 - Thái Nguyên Map */}
              <div>
                <h4 className="text-lg font-semibold text-green-800 mb-3">CS2 - Thái Nguyên</h4>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.7792792051196!2d105.8367287!3d21.594537100000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135271ea3d9bd6b%3A0xfaa8f55caebc0043!2zVmlldHRlbCBUaMOhaSBOZ3V5w6puIC0gQ2hpIG5ow6FuaCBU4bqtcCDEkW_DoG4gQ8O0bmcgbmdoaeG7h3AgLSBWaeG7hW4gdGjhu5FuZyBRdcOibiDEkeG7mWk!5e0!3m2!1svi!2s!4v1758653790741!5m2!1svi!2s" 
                    width="100%" 
                    height="200" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
