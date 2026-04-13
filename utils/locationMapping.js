// Mapping địa chỉ chi tiết cho các cơ sở
export const locationMapping = {
  "CS1 - Hà Nội": {
    name: "Cơ sở 1 - Hà Nội",
    address: "19 Nguyễn Gia Thiều, Hoàn Kiếm"
  },
  "CS2 - Thái Nguyên": {
    name: "Cơ sở 2 - Thái Nguyên",
    address: "Tòa nhà Viettel, Số 4 Hoàng Văn Thụ"
  }
};

// Danh sách option chuẩn hoá dùng cho form/API khóa học
export const locationOptions = Object.entries(locationMapping).map(
  ([code, info]) => ({
    code,
    label: info.name,
    address: info.address,
  })
);

// Hàm helper để lấy thông tin địa chỉ
export const getLocationInfo = (locationCode) => {
  return locationMapping[locationCode] || {
    name: locationCode,
    address: "Địa chỉ chi tiết sẽ được cập nhật"
  };
};

// Hàm helper để format địa chỉ cho hiển thị
export const formatLocationsForDisplay = (locations) => {
  if (!locations || locations.length === 0) {
    return 'BT Academy';
  }
  
  return locations.map(location => {
    const info = getLocationInfo(location);
    return info.name;
  }).join(', ');
};
