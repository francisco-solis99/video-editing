import { lazy, Suspense } from 'react';
import { Header } from '@/components/Header'
import { Routes, Route } from 'react-router';
import Loader from '@/components/Loader';

const VideoUploadPage = lazy(() => import('@/pages/VideoUpload'));
const VideoProcessPage = lazy(() => import('@/pages/VideoProcess'));
const VideoResultPage = lazy(() => import('@/pages/VideoResult'));

function App() {

  return (
    <>
      <Header showExport={false} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<VideoUploadPage />} />
          <Route path="/video-process" element={<VideoProcessPage />} />
          <Route path="/video-result" element={<VideoResultPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
