import { useState, useEffect } from 'react';

const EnvDebug = () => {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Collect all environment variables that start with VITE_
    const viteEnvVars: Record<string, string> = {};
    
    // @ts-ignore - Import.meta is properly typed by Vite
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        // @ts-ignore - Import.meta is properly typed by Vite
        viteEnvVars[key] = import.meta.env[key];
      }
    });
    
    setEnvVars(viteEnvVars);
  }, []);
  
  return (
    <div className="p-4 border border-gray-300 rounded-lg m-4">
      <h2 className="text-xl font-bold mb-2">Environment Variables Debug</h2>
      {Object.keys(envVars).length === 0 ? (
        <p>No VITE_ environment variables found</p>
      ) : (
        <ul>
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key} className="mb-1">
              <strong>{key}:</strong> {value ? `${value.substring(0, 5)}...` : 'Not set'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnvDebug;