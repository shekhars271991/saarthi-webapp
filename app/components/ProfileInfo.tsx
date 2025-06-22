'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUserProfile } from '../services/apiService';

interface ProfileInfoProps {
  user: {
    name?: string;
    phoneNumber:string;
    _id?: string;
  };
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [loading, setLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const handleSaveName = async () => {
    const trimmedName = name.trim();
    if (trimmedName.length > 30) {
      toast.error('Name cannot exceed 30 characters.');
      return;
    }
    if (!user._id) {
      toast.error('User ID not found.');
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(user._id, trimmedName);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userObj.name = trimmedName;
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      setName(trimmedName);
      setIsEditingName(false);
      toast.success('Name updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error(`Failed to update name: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs  text-black p-4">
      <div className="mb-4">
        <div className="flex items-center space-x-4">
        
          {isEditingName ? (
            <div className=" items-center space-x-2 ">
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                className="border border-gray-300 rounded px-3 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-white"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveName();
                  } else if (e.key === 'Escape') {
                    setIsEditingName(false);
                    setName(user.name || '');
                  }
                }}
              />
              <div className='flex items-center justify-between flex-1 mt-2 mb-2'>
              <button
                onClick={handleSaveName}
                disabled={loading}
                className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setName(user.name || '');
                }}
                disabled={loading}
                className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <span className="text-xl">{name || 'Shekhar'}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className=" focus:outline-none p-1"
                aria-label="Edit name"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center flex-1 mt-2 text-black">{user?.phoneNumber}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;