import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from './axios';
import API_CONSTANTS from './apiConstants';
import useUser from "../hooks/useUser";

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

      if (error) {
        const errorMessages = {
          oauth_denied: 'OAuth access was denied',
          no_code: 'No authorization code received',
          auth_failed: 'Authentication failed. Please try again.',
        };

        const message = errorMessages[error as keyof typeof errorMessages] || 'Authentication failed';
        alert(message);
        navigate('/auth', { replace: true });
        setIsProcessing(false);
        return;
      }

      if (!code || !provider) {
        alert('Invalid OAuth callback - missing code or provider');
        navigate('/auth', { replace: true });
        setIsProcessing(false);
        return;
      }

      try {
        const endpoint = provider === 'google' ? API_CONSTANTS.GOOGLE_TOKEN : API_CONSTANTS.LINKEDIN_TOKEN;
        const response = await axiosInstance.post(endpoint, { code });
        if (response.status === 200) {
          const data = response.data;
          updateUser(JSON.stringify(data.user)); // Store user in state/context
          navigate("/dashboard", { replace: true });
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Authentication failed. Please try again.";
        alert(`Authentication failed: ${errorMessage}`);
        navigate('/auth', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="flex h-screen items-center justify-center">
      {isProcessing ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-700">Processing authentication...</p>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Redirecting...</p>
      )}
    </div>
  );
};