import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import VoiceTestListComponent from '../../../components/admin/VoiceTestListComponent';

const VoiceTestManagement = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user?.role !== 'admin') {
      router.push('/dang-nhap');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout title="Quản lý bài test giọng - BT Academy">
      <VoiceTestListComponent />
    </AdminLayout>
  );
};

export default VoiceTestManagement;
