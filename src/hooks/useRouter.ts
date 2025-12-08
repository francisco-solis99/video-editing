import { useNavigate, useLocation } from 'react-router'

export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()

  function navigateTo(path: string) {
    navigate(path)
  }

  return {
    currentPath: location.pathname,
    navigateTo
  }
}