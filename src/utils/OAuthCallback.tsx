import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from './axios';
import API_CONSTANTS from './apiConstants';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

    //   console.log('🔍 OAuth Callback Debug:');
    //   console.log('code:', code);
    //   console.log('provider:', provider);
    //   console.log('error:', error);

      if (error) {
        const errorMessages = {
          oauth_denied: 'OAuth access was denied',
          no_code: 'No authorization code received',
          auth_failed: 'Authentication failed. Please try again.'
        };
        
        const message = errorMessages[error as keyof typeof errorMessages] || 'Authentication failed';
        alert(message);
        navigate('/auth', { replace: true });
        return;
      }

      if (!code || !provider) {
        // console.error('Missing code or provider');
        alert('Invalid OAuth callback - missing code or provider');
        navigate('/auth', { replace: true });
        return;
      }

      try {
        // Enhanced debugging
        const endpoint = provider === 'google' ? API_CONSTANTS.GOOGLE_TOKEN : API_CONSTANTS.LINKEDIN_TOKEN;
        
        // console.log('🔍 Token Exchange Debug:');
        // console.log('endpoint:', endpoint);
        // console.log('axiosInstance.defaults.baseURL:', axiosInstance.defaults.baseURL);
        // console.log('Full URL will be:', `${axiosInstance.defaults.baseURL}${endpoint}`);
        // console.log('Sending code:', code);

        const response = await axiosInstance.post(endpoint, { code });

        // console.log('✅ Token exchange successful');
        // console.log('response.status:', response.status);
        // console.log('response.data:', response.data);

        if (response.status === 200) {
          const data = response.data;
          
        //   console.log('💾 Storing token and redirecting to dashboard');
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          navigate("/dashboard", { replace: true });
        }
      } catch (error: any) {
        // console.error("❌ OAuth token exchange error:", error);
        
        // Enhanced error logging
        // if (error.response) {
        //   console.error('Error response status:', error.response.status);
        //   console.error('Error response data:', error.response.data);
        //   console.error('Error response headers:', error.response.headers);
        // } else if (error.request) {
        //   console.error('No response received:', error.request);
        // } else {
        //   console.error('Error message:', error.message);
        // }
        
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message ||
                           error.message ||
                           "Authentication failed. Please try again.";
        
        alert(`Authentication failed: ${errorMessage}`);
        navigate('/auth', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Processing authentication...</p>
      </div>
    </div>
  );
};